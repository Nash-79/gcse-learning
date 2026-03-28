import os
import time
import json
import re
from typing import Optional, Any

import requests
from fastapi import FastAPI, Header, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# ── Constants ─────────────────────────────────────────────────────────────────

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models"
REFERER = "https://pylearn-gcse.replit.app"
APP_TITLE = "PyLearn GCSE CS"
DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free"
MODELS_CACHE_TTL_SECONDS = 6 * 60 * 60

ALLOWED_MODELS = {
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-3-27b-it:free",
    "qwen/qwen3-coder:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "openai/gpt-oss-120b:free",
    "stepfun/step-3.5-flash:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "arcee-ai/trinity-large-preview:free",
    "openai/gpt-oss-20b:free",
    "minimax/minimax-m2.5:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "z-ai/glm-4.5-air:free",
    "arcee-ai/trinity-mini:free",
    "google/gemma-3-12b-it:free",
    "google/gemma-3-4b-it:free",
    "qwen/qwen3-4b:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
}

_models_cache: dict[str, Any] = {
    "updated_at": 0.0,
    "free_models": [],
}

STRUCTURED_OUTPUT_INSTRUCTION = """

====================
OUTPUT FORMAT RULES
====================

Your first priority is to return a valid JSON object.
If you cannot reliably produce valid JSON, then return clean Markdown using the fallback format below.

PRIMARY MODE: JSON
Return this exact JSON shape:
{
  "mode": "json",
  "summary": "string",
  "sections": [
    {
      "heading": "string",
      "content": "string",
      "bullets": ["string"]
    }
  ],
  "next_step": "string"
}
JSON rules:
- Output valid JSON only, no markdown, no backticks, no comments, no extra keys
- Always include: mode, summary, sections, next_step
- Set "mode" to "json"
- summary must be 1 to 2 sentences
- sections must contain 1 to 4 items
- each section must include "heading" and optionally "content" and/or "bullets"
- use short content and bullets for lists, steps, comparisons
- For code examples, put code in content as a plain string
- next_step may be an empty string

FALLBACK MODE: MARKDOWN
If you cannot produce valid JSON, output this exact structure:
MODE: markdown
SUMMARY:
<1 to 2 sentence direct answer>
## <Section Heading>
<short paragraph>
- <bullet>
NEXT STEP:
<one short practical next step, or leave blank>

STYLE: Be concise, use simple language, avoid filler and repetition, keep output easy to scan.
DECISION: Prefer JSON. Use Markdown fallback only if JSON reliability is uncertain. Never mix formats."""

STRUCTURED_USER_SUFFIX = "\n\nReturn JSON if possible. If not, use the Markdown fallback exactly."

GCSE_SYSTEM_PROMPT = """You are **PyLearn AI** — a dedicated GCSE Computer Science tutor specialising in Python programming for the OCR J277 and AQA 8525 specifications.

## Your Personality
- Friendly, encouraging, and patient — like a great teacher
- You celebrate effort and guide students to the answer rather than just giving it

## CRITICAL: Simple Python Only
- Use ONLY simple Python suitable for GCSE students (age 14-16)
- ALWAYS use: print(), input(), variables, if/elif/else, for loops, while loops, simple string concatenation with +
- NEVER use: f-strings, try/except, classes, list comprehensions, lambda, decorators, generators, walrus operator, type hints
- For string output use: print("Hello " + name) NOT print(f"Hello {name}")
- For number in string use: print("Age: " + str(age)) NOT print(f"Age: {age}")

## Response Rules
1. Keep explanations short — 2-3 sentences max per point, age-appropriate for 14-16 year olds
2. Reference exam context — mention mark schemes, common exam patterns, command words
3. When showing code, always include clear comments on every significant line
4. For debugging help: identify the error, explain WHY it is wrong, show the fix
5. For exam questions: break down the marks available, suggest a structure

## Follow-Up Questions
At the END of EVERY response, include a section:
---
**Want to keep going?**

Then list exactly 3 short follow-up questions as bullet points that naturally extend from the topic just discussed. Make them progressively harder.

## Topics You Cover
- Python basics, operators, selection, iteration, data structures, string handling
- Subprograms, file handling, robust programming, algorithms, SQL, Boolean logic
- OCR J277 and AQA 8525 exam techniques""" + STRUCTURED_OUTPUT_INSTRUCTION


# ── Helpers ───────────────────────────────────────────────────────────────────

def resolve_api_key(user_key: Optional[str]) -> str:
    key = (user_key or "").strip() or os.environ.get("OPENROUTER_API_KEY", "").strip()
    if not key:
        raise HTTPException(status_code=500, detail="No OpenRouter API key configured. Add one in Settings or set OPENROUTER_API_KEY.")
    return key


def make_headers(api_key: str) -> dict:
    return {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": REFERER,
        "X-Title": APP_TITLE,
        "Content-Type": "application/json",
    }


def make_base_headers() -> dict:
    return {
        "HTTP-Referer": os.environ.get("OPENROUTER_HTTP_REFERER", REFERER),
        "X-Title": os.environ.get("OPENROUTER_X_TITLE", APP_TITLE),
        "Content-Type": "application/json",
    }


def safe_model(model: Optional[str]) -> str:
    return model if model in ALLOWED_MODELS else DEFAULT_MODEL


def call_with_backoff(
    payload: dict,
    api_key: str,
    stream: bool = False,
    max_retries: int = 4,
) -> requests.Response:
    """POST to OpenRouter with exponential backoff on 429 rate limits."""
    last_resp = None
    last_exc = None

    for attempt in range(max_retries):
        try:
            resp = requests.post(
                OPENROUTER_URL,
                json=payload,
                headers=make_headers(api_key),
                stream=stream,
                timeout=60,
            )
            if resp.status_code != 429:
                return resp

            last_resp = resp
            wait = 2 ** attempt
            print(f"[PyLearn] Rate limited — retrying in {wait}s (attempt {attempt + 1}/{max_retries})")
            time.sleep(wait)

        except requests.RequestException as e:
            last_exc = e
            wait = 2 ** attempt
            print(f"[PyLearn] Network error: {e} — retrying in {wait}s")
            time.sleep(wait)

    if last_resp is not None:
        return last_resp
    raise HTTPException(status_code=503, detail=f"OpenRouter unavailable after {max_retries} retries: {last_exc}")


def extract_json(text: str):
    try:
        return json.loads(text)
    except Exception:
        m = re.search(r"[\[{][\s\S]*[\]}]", text)
        if m:
            try:
                return json.loads(m.group())
            except Exception:
                pass
    return None


def _as_dollar(value: Any) -> str:
    try:
        n = float(value)
        return f"${n:.6f}"
    except Exception:
        return "$0.00"


def _is_free_model(raw: dict) -> bool:
    model_id = str(raw.get("id", ""))
    if model_id.endswith(":free"):
        return True
    pricing = raw.get("pricing", {}) or {}
    try:
        return float(pricing.get("prompt", 1)) == 0 and float(pricing.get("completion", 1)) == 0
    except Exception:
        return False


def _map_model(raw: dict) -> dict:
    arch = raw.get("architecture", {}) or {}
    top_provider = raw.get("top_provider", {}) or {}
    provider = raw.get("provider", {}) or {}
    input_modalities = arch.get("input_modalities") or ["text"]
    modality = arch.get("modality") or []
    return {
        "id": str(raw.get("id", "")),
        "name": str(raw.get("name") or raw.get("id") or "Unknown"),
        "provider": str(top_provider.get("name") or provider.get("name") or "OpenRouter"),
        "description": str(raw.get("description") or ""),
        "contextWindow": int(raw.get("context_length") or 0),
        "maxOutput": top_provider.get("max_completion_tokens"),
        "inputPrice": _as_dollar((raw.get("pricing") or {}).get("prompt")),
        "outputPrice": _as_dollar((raw.get("pricing") or {}).get("completion")),
        "tags": modality if isinstance(modality, list) else [],
        "architecture": "+".join(input_modalities) + " -> text",
        "tokenizer": str(arch.get("tokenizer") or "Unknown"),
    }


def fetch_openrouter_models(user_key: Optional[str], refresh: bool = False) -> list[dict]:
    now = time.time()
    if not refresh and (now - _models_cache["updated_at"]) < MODELS_CACHE_TTL_SECONDS and _models_cache["free_models"]:
        return _models_cache["free_models"]

    headers = make_base_headers()
    key = (user_key or "").strip() or os.environ.get("OPENROUTER_API_KEY", "").strip()
    if key:
        headers["Authorization"] = f"Bearer {key}"

    resp = requests.get(OPENROUTER_MODELS_URL, headers=headers, timeout=30)
    if not resp.ok:
        if _models_cache["free_models"]:
            return _models_cache["free_models"]
        raise HTTPException(status_code=resp.status_code, detail=f"OpenRouter models API failed: {resp.status_code}")

    data = resp.json()
    raw_models = data.get("data") if isinstance(data, dict) else []
    raw_models = raw_models if isinstance(raw_models, list) else []
    free_models = [_map_model(m) for m in raw_models if isinstance(m, dict) and _is_free_model(m)]
    free_models = [m for m in free_models if m.get("id")]

    _models_cache["updated_at"] = now
    _models_cache["free_models"] = free_models
    return free_models


# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(title="PyLearn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/openrouter/models")
def openrouter_models(
    refresh: int = 0,
    x_user_api_key: Optional[str] = Header(None),
):
    models = fetch_openrouter_models(x_user_api_key, refresh=bool(refresh))
    return {"models": models, "count": len(models), "cached": not bool(refresh)}


# ── AI Chat ───────────────────────────────────────────────────────────────────

@app.post("/api/ai-chat")
def ai_chat(
    body: dict = Body(...),
    x_user_api_key: Optional[str] = Header(None),
):
    api_key = resolve_api_key(x_user_api_key)

    mode = body.get("mode", "chat")
    topic_title = body.get("topicTitle", "")
    messages = body.get("messages", [])
    code = body.get("code", "")
    task_description = body.get("taskDescription", "")
    system_prompt_override = body.get("systemPromptOverride", "")
    user_prompt_override = body.get("userPromptOverride", "")
    max_tokens = body.get("maxTokens", 1000)
    model = safe_model(body.get("model"))

    want_json = False

    if mode == "chat":
        system_prompt = (
            f'You are a GCSE Computer Science tutor helping a student learn Python. The current topic is "{topic_title}".\n\n'
            "IMPORTANT CODING STYLE RULES:\n"
            "- Use ONLY simple Python suitable for 14-16 year old GCSE students\n"
            "- Use: print(), input(), variables, if/elif/else, for loops, while loops, simple string concatenation with +\n"
            "- NEVER use: f-strings, try/except, classes, list comprehensions, lambda, decorators, generators, walrus operator\n"
            "- For string joining, use: print(\"Hello \" + name) NOT print(f\"Hello {name}\")\n"
            "- Keep explanations short (2-3 sentences max per point)\n"
            "- Use simple vocabulary appropriate for 14-16 year olds\n"
            "- Comment every significant line of code\n"
            "- Format code blocks with triple backticks"
        ) + STRUCTURED_OUTPUT_INSTRUCTION

        user_messages = [
            {**m, "content": m["content"] + STRUCTURED_USER_SUFFIX}
            if i == len(messages) - 1 and m["role"] == "user" else m
            for i, m in enumerate(messages)
        ]

    elif mode == "validate":
        system_prompt = (
            f'You are an OCR GCSE Computer Science exam marker. Grade Python code submissions for the topic "{topic_title}".\n\n'
            "Return ONLY a JSON object with:\n"
            "- score (0-10 integer)\n"
            "- maxScore (always 10)\n"
            "- grade (\"A*\"|\"A\"|\"B\"|\"C\"|\"D\"|\"U\")\n"
            "- feedback (2-3 sentence overall feedback as an encouraging teacher)\n"
            "- strengths (array of 2-3 things done well)\n"
            "- improvements (array of 1-3 things to improve)\n"
            "- examTips (array of 1-2 OCR exam-specific tips relevant to this code)\n\n"
            "Be encouraging but honest. Reference OCR J277 exam expectations where relevant."
        )
        user_messages = [{
            "role": "user",
            "content": f"Topic: {topic_title}\n{f'Task: {task_description}' if task_description else ''}\nStudent code:\n```python\n{code}\n```",
        }]
        want_json = True

    elif mode == "generate":
        system_prompt = (system_prompt_override or "") + STRUCTURED_OUTPUT_INSTRUCTION
        user_messages = (
            [{"role": "user", "content": user_prompt_override + STRUCTURED_USER_SUFFIX}]
            if user_prompt_override else messages
        )
        want_json = True

    else:
        raise HTTPException(status_code=400, detail="Invalid mode. Use 'chat', 'validate', or 'generate'.")

    payload: dict = {
        "model": model,
        "messages": [{"role": "system", "content": system_prompt}, *user_messages],
        "max_tokens": max_tokens,
    }
    if want_json:
        payload["response_format"] = {"type": "json_object"}

    resp = call_with_backoff(payload, api_key)

    if resp.status_code == 429:
        raise HTTPException(status_code=429, detail="Rate limit reached after retries. Please wait a moment.")
    if resp.status_code == 402:
        raise HTTPException(status_code=402, detail="AI credits exhausted.")
    if not resp.ok:
        print(f"[PyLearn] AI error: {resp.status_code} {resp.text[:200]}")
        raise HTTPException(status_code=resp.status_code, detail=f"AI API error: {resp.status_code}")

    data = resp.json()
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

    if want_json:
        parsed = extract_json(content)
        if parsed is not None:
            return JSONResponse({"content": json.dumps(parsed) if isinstance(parsed, dict) else content})
        raise HTTPException(status_code=500, detail="Could not parse AI JSON response")

    return JSONResponse({"content": content})


# ── GCSE Streaming Chat ───────────────────────────────────────────────────────

@app.post("/api/gcse-chat")
def gcse_chat(
    body: dict = Body(...),
    x_user_api_key: Optional[str] = Header(None),
):
    api_key = resolve_api_key(x_user_api_key)

    messages = body.get("messages", [])
    model = safe_model(body.get("model"))

    augmented = [
        {**m, "content": m["content"] + STRUCTURED_USER_SUFFIX}
        if i == len(messages) - 1 and m["role"] == "user" else m
        for i, m in enumerate(messages)
    ]

    payload = {
        "model": model,
        "messages": [{"role": "system", "content": GCSE_SYSTEM_PROMPT}, *augmented],
        "stream": True,
    }

    def generate():
        resp = call_with_backoff(payload, api_key, stream=True)
        if resp.status_code == 429:
            yield f'data: {{"error":"Rate limit reached after retries. Please wait a moment."}}\n\n'
            return
        if not resp.ok:
            yield f'data: {{"error":"AI service error: {resp.status_code}"}}\n\n'
            return
        for chunk in resp.iter_content(chunk_size=None):
            if chunk:
                yield chunk

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Mark Answer ───────────────────────────────────────────────────────────────

@app.post("/api/mark-answer")
def mark_answer(
    body: dict = Body(...),
    x_user_api_key: Optional[str] = Header(None),
):
    api_key = resolve_api_key(x_user_api_key)

    question = body.get("question", "")
    student_answer = body.get("studentAnswer", "")
    mark_scheme = body.get("markScheme", [])
    model_answer = body.get("modelAnswer", "")
    marks = body.get("marks", 1)
    question_type = body.get("questionType", "short-answer")

    system_prompt = (
        "You are an expert OCR GCSE Computer Science examiner marking student answers against official mark schemes. "
        "You must be fair, encouraging, and educational.\n\n"
        "Rules:\n"
        "- Award marks ONLY for points that match the mark scheme criteria\n"
        "- Be generous with alternative correct phrasing but strict on accuracy\n"
        "- For code questions, check logic correctness even if syntax varies slightly\n"
        "- For multiple-choice, simply check if the answer matches\n"
        "- Always provide specific, constructive feedback\n"
        "- Reference the mark scheme points the student hit or missed\n"
        "- Use a supportive, educational tone suitable for GCSE students (age 14-16)"
    )

    scheme_text = "\n".join(f"{i + 1}. {m}" for i, m in enumerate(mark_scheme))
    user_prompt = (
        f"Mark this student's answer:\n\n"
        f"**Question ({marks} marks, type: {question_type}):**\n{question}\n\n"
        f"**Student's Answer:**\n{student_answer}\n\n"
        f"**Mark Scheme:**\n{scheme_text}\n\n"
        f"**Model Answer:**\n{model_answer}\n\n"
        f"Please respond using this exact JSON structure:\n"
        f'{{"marksAwarded": <number 0-{marks}>, "totalMarks": {marks}, '
        f'"feedback": "<2-3 sentences of specific feedback>", '
        f'"markBreakdown": [{{"point": "<mark scheme point>", "awarded": true/false, "comment": "<brief explanation>"}}], '
        f'"grade": "<one of: Excellent, Good, Satisfactory, Needs Improvement>", '
        f'"improvementTip": "<one specific tip to improve their answer>"}}'
    )

    payload = {
        "model": DEFAULT_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 1000,
    }

    resp = call_with_backoff(payload, api_key)

    if resp.status_code == 429:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait a moment and try again.")
    if resp.status_code == 402:
        raise HTTPException(status_code=402, detail="AI credits exhausted.")
    if not resp.ok:
        raise HTTPException(status_code=resp.status_code, detail=f"AI gateway error: {resp.status_code}")

    data = resp.json()
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

    parsed = extract_json(content)
    if parsed is not None:
        return JSONResponse(parsed)
    raise HTTPException(status_code=500, detail="Could not parse AI response")


# ── Static frontend (production) ──────────────────────────────────────────────

_static_dir = os.path.join(os.getcwd(), "dist", "public")
if os.path.isfile(os.path.join(_static_dir, "index.html")):
    print(f"[PyLearn] Serving frontend from {_static_dir}")
    app.mount("/", StaticFiles(directory=_static_dir, html=True), name="static")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("server.main:app", host="0.0.0.0", port=port, reload=False)
