from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Iterable

try:
    import pypdf
except ImportError as exc:  # pragma: no cover
    raise SystemExit("pypdf is required to build topic augmentations. Install it in the Python environment.") from exc


ROOT = Path(__file__).resolve().parent.parent
CONTENT_LIBRARY = ROOT / "content-library"
OUTPUT_FILE = ROOT / "src" / "generated" / "topicAugmentations.ts"

BOARD_VALUES = ("ocr", "aqa", "edexcel", "eduqas")

STEM_TO_SLUGS: dict[str, list[str]] = {
    "algorithms_searching_sorting": ["algorithms", "searching-algorithms", "sorting-algorithms", "searching-sorting", "insertion-sort"],
    "algorithms_trace_tables": ["algorithms", "pseudocode-trace-tables"],
    "boolean_logic": ["boolean-logic"],
    "character_sets": ["memory-and-storage"],
    "computational_thinking": ["algorithms"],
    "cpu_architecture": ["systems-architecture"],
    "cpu_architecture_von_neumann": ["systems-architecture"],
    "cyber_security_prevention": ["network-security"],
    "cyber_security_threats": ["network-security"],
    "data_representation_media": ["memory-and-storage"],
    "data_representation_numbers": ["memory-and-storage"],
    "embedded_systems": ["systems-architecture"],
    "fde_cycle_and_systems": ["systems-architecture"],
    "fde_cycle_systems_software": ["systems-architecture", "systems-software"],
    "legal_ethical_environmental": ["ethical-legal-environmental"],
    "legal_ethical_environmental_issues": ["ethical-legal-environmental"],
    "memory_and_storage": ["memory-and-storage"],
    "memory_storage": ["memory-and-storage"],
    "networks_basics": ["computer-networks"],
    "network_hardware_and_topologies": ["computer-networks"],
    "network_hardware_topologies": ["computer-networks"],
    "network_protocols": ["computer-networks"],
    "network_protocols_internet": ["computer-networks"],
    "programming_data_structures": ["lists-tuples-dicts", "string-handling", "string-manipulation", "2d-arrays"],
    "programming_fundamentals": [
        "intro-to-python",
        "variables-data-types",
        "variables-constants",
        "data-types-casting",
        "input-output-casting",
        "arithmetic-operators",
        "selection-if-else",
        "iteration",
    ],
    "programming_testing_and_robustness": ["error-handling", "robust-programming"],
    "programming_testing_robustness": ["error-handling", "robust-programming"],
}


def clean_text(text: str) -> str:
    replacements = {
        "\ufb00": "ff",
        "\ufb01": "fi",
        "\ufb02": "fl",
        "\ufb03": "ffi",
        "\ufb04": "ffl",
        "\u2013": "-",
        "\u2014": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2022": "-",
        "\xa0": " ",
        "\uf271": "",
        "\uf194": "",
        "\uf4ca": "",
        "\uf1d2": "",
        "\uf479": "",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def read_pdf_text(pdf_path: Path, max_pages: int = 3) -> str:
    reader = pypdf.PdfReader(str(pdf_path))
    chunks: list[str] = []
    for page in reader.pages[:max_pages]:
        chunks.append(page.extract_text() or "")
    return clean_text("\n".join(chunks))


def pick_slug_group(stem: str) -> list[str]:
    return STEM_TO_SLUGS.get(stem, [])


def dedupe_keep_order(items: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for item in items:
        normalized = item.strip()
        if not normalized:
            continue
        if normalized in seen:
            continue
        seen.add(normalized)
        ordered.append(normalized)
    return ordered


def extract_checklist(text: str) -> list[str]:
    match = re.search(
        r"What you must know(.*?)(Worked examples|Quick reference|Specification note|Over 1,100,000\+)",
        text,
        re.IGNORECASE | re.DOTALL,
    )
    block = match.group(1) if match else text[:2500]
    lines = [line.strip(" -") for line in block.splitlines()]
    candidates: list[str] = []
    allowed_starts = (
        "Describe", "Explain", "State", "Identify", "Trace", "Write",
        "Compare", "Define", "Complete", "Calculate", "Determine", "Recognise",
    )
    for line in lines:
        if len(line) < 18:
            continue
        if "OCR GCSE Computer Science" in line or "Assessment Hub" in line:
            continue
        if re.search(r"(What you must know|Worked examples|Quick reference|Typical pitfalls)", line, re.IGNORECASE):
            continue
        if not line.startswith(allowed_starts):
            continue
        cleaned = re.split(r"(?<=[.])\s+(?=[A-Z])", line)[0].strip()
        if len(cleaned) > 140:
            continue
        if not cleaned.endswith("."):
            cleaned = f"{cleaned}."
        candidates.append(cleaned)
    return dedupe_keep_order(candidates)[:8]


def extract_exam_focus(text: str) -> list[str]:
    focus_items: list[str] = []
    match = re.search(
        r"Exam questions typically ask you to (.*?)(What you must know|Specification note|Over 1,100,000\+)",
        text,
        re.IGNORECASE | re.DOTALL,
    )
    if match:
        sentence = match.group(1).replace("\n", " ").strip(" .")
        sentence = re.sub(r"Why .*", "", sentence, flags=re.IGNORECASE).strip(" .")
        parts = re.split(r", | and ", sentence)
        for part in parts:
            part = part.strip(" .")
            if len(part) < 18 or len(part) > 140:
                continue
            if part.lower().startswith(("questions range", "require", "including")):
                continue
            focus_items.append(part[0].upper() + part[1:])
    return dedupe_keep_order(focus_items)[:5]


def extract_long_answers(text: str, tier: str) -> list[dict]:
    # Split text by "Assessment Hub" which marks the start of a new question
    question_blocks = re.split(r"Assessment Hub Notes / Textbook Long-Answer Practice", text)
    if len(question_blocks) <= 1:
        return []

    results = []
    # Skip the first block as it's typically preamble
    for block in question_blocks[1:]:
        # Clean up the block
        block = block.strip()
        
        # Title and Scenario
        # Title is usually the first line after the split, scenario follows
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if not lines:
            continue
            
        title = lines[0]
        # Skip some potential noise lines at the start of the title
        if "Question" in title and len(title) < 15:
             title = lines[1] if len(lines) > 1 else title
             
        # Extract Task and Mark Range
        task_match = re.search(r"Task \((\d+ marks)\):\s*(.*?)(?:\nHide Solution|\nLevels of response|\nIndicative content:)", block, re.DOTALL)
        if not task_match:
            continue
            
        mark_range = task_match.group(1)
        task = clean_text(task_match.group(2))
        
        # Scenario is between title and task
        # Find position of title and task to get text in between
        title_idx = block.find(title)
        task_idx = block.find(f"Task ({mark_range})")
        
        scenario = ""
        if title_idx != -1 and task_idx != -1:
            scenario_block = block[title_idx + len(title):task_idx].strip()
            # Clean up scenario - remove lines that look like page headers/urls
            scenario_lines = [line for line in scenario_block.splitlines() if not re.search(r"(q=\d+|difficulty=|topic=|\.co\.uk| marks of exam-aligned content)", line)]
            scenario = clean_text(" ".join(scenario_lines))

        # Indicative content
        # Stop at "I will explain" or "Sample answer" or "Worked Solution"
        indicative_match = re.search(r"Indicative content:\s*(.*?)(?:\nI will explain|\nSample answer|\nWorked Solution|\nExample Answer|\nSolution|\nHow .*? Works:|\nAssessment Hub|\Z)", block, re.DOTALL | re.IGNORECASE)
        indicative_block = clean_text(indicative_match.group(1)) if indicative_match else ""
        
        # Split into points - more robustly
        # Try splitting by ". " followed by a capital letter, or by bullet points
        indicative_points = []
        if indicative_block:
             # Look for analysis headings as separate points
             headings = ["Database size analysis:", "Sorted data analysis:", "User experience analysis:", "Binary search:", "Linear search:"]
             for heading in headings:
                 if heading in indicative_block:
                     # Add heading as a point if it has content
                     match = re.search(f"({heading}.*?)(?={'|'.join([h.replace(':', '') for h in headings if h != heading])}|\\Z)", indicative_block, re.DOTALL)
                     if match:
                         indicative_points.append(clean_text(match.group(1)))
             
             # If no headings found or to complement headings
             if not indicative_points:
                 # Standard split by period
                 raw_points = re.split(r"(?<=[.])\s+(?=[A-Z])", indicative_block)
                 indicative_points = [p.strip() for p in raw_points if len(p.strip()) > 30]

        # Sample Answer / Worked Solution
        # Triggers: "I will explain", "Sample answer", "How ... Works:", "Analysis:", "Worked Solution:", "Example Answer:"
        sample_triggers = [
            r"I will explain.*?\n",
            r"Sample answer.*?\n",
            r"How .*? Works:\n",
            r"Worked Solution:.*?\n",
            r"Example Answer:.*?\n",
            r"Solution:.*?\n",
            r"Assessment Hub Notes / Textbook Long-Answer Practice" # Use this to find start of next
        ]
        
        sample_answer = ""
        # Find the earliest trigger after indicative content (if any)
        start_search_idx = block.find("Indicative content:")
        if start_search_idx == -1:
            start_search_idx = block.find(task) + len(task)
        else:
            # Skip the indicative content itself
            if indicative_block:
                start_search_idx = block.find(indicative_block[-20:], start_search_idx) + 20
        
        search_area = block[start_search_idx:]
        
        earliest_match = None
        earliest_pos = len(search_area)
        
        for trigger in sample_triggers:
            match = re.search(trigger, search_area, re.IGNORECASE | re.DOTALL)
            if match and match.start() < earliest_pos:
                earliest_pos = match.start()
                earliest_match = match
        
        if earliest_match:
            # Sample answer starts at the beginning of the trigger and goes to the end or next question
            sample_answer = clean_text(search_area[earliest_pos:])
        else:
            # Fallback: if we have indicative content, maybe the sample answer is just after it without a trigger
            if indicative_block:
                sample_answer = clean_text(search_area)
        
        # Clean up: remove "Assessment Hub" if it leaked in
        sample_answer = re.split(r"Assessment Hub", sample_answer, flags=re.IGNORECASE)[0].strip()

        # If it's still too short, it might be a failure to find the trigger
        if len(sample_answer) < 50 and not earliest_match:
             # Just take everything after the task as a last resort
             last_resort = block[block.find(task) + len(task):].strip()
             # Try to skip the levels of response / indicative content
             if "Indicative content:" in last_resort:
                 last_resort = last_resort.split("Indicative content:")[-1]
                 # Skip the points
                 if indicative_block:
                     last_resort = last_resort.split(indicative_block[-10:])[-1]
             sample_answer = clean_text(last_resort)

        ai_prompt = "\n".join([
            f"Review my {tier} long-answer response for {title}.",
            f"Scenario: {scenario}",
            f"Task: {task}",
            "Check that I use GCSE Computer Science terminology, compare both sides where needed, and justify my recommendation clearly.",
            "Mark it using this indicative content:",
            *[f"- {point}" for point in indicative_points],
        ])

        results.append({
            "tier": tier,
            "title": title,
            "scenario": scenario,
            "task": task,
            "markRange": mark_range,
            "indicativePoints": indicative_points[:6],
            "sampleAnswer": sample_answer,
            "aiPrompt": ai_prompt,
        })
    
    return results


def main() -> None:
    augmentations: list[dict] = []

    for board in BOARD_VALUES:
        textbook_dir = CONTENT_LIBRARY / board / "textbook"
        if textbook_dir.exists():
            for pdf_path in sorted(textbook_dir.glob("*.pdf")):
                stem = pdf_path.stem
                slugs = pick_slug_group(stem)
                if not slugs:
                    continue
                text = read_pdf_text(pdf_path)
                checklist = extract_checklist(text)
                exam_focus = extract_exam_focus(text)

                for slug in slugs:
                    augmentations.append({
                        "board": board,
                        "slug": slug,
                        "sourceStem": stem,
                        "revisionChecklist": checklist,
                        "examFocus": exam_focus,
                        "longAnswerPrompts": [],
                    })

        longanswer_dir = CONTENT_LIBRARY / board / "longanswer"
        if longanswer_dir.exists():
            for topic_dir in sorted(path for path in longanswer_dir.iterdir() if path.is_dir()):
                slugs = pick_slug_group(topic_dir.name)
                if not slugs:
                    continue

                prompt_payloads: list[dict] = []
                for tier in ("standard", "extension"):
                    pdf_path = topic_dir / f"{tier}_full.pdf"
                    if not pdf_path.exists():
                        continue
                    # Read more pages to catch all questions
                    text = read_pdf_text(pdf_path, max_pages=20)
                    prompts = extract_long_answers(text, tier)
                    prompt_payloads.extend(prompts)

                if not prompt_payloads:
                    continue

                for slug in slugs:
                    augmentations.append({
                        "board": board,
                        "slug": slug,
                        "sourceStem": topic_dir.name,
                        "revisionChecklist": [],
                        "examFocus": [],
                        "longAnswerPrompts": prompt_payloads,
                    })

    merged: dict[tuple[str, str], dict] = {}
    for item in augmentations:
        key = (item["board"], item["slug"])
        existing = merged.get(key)
        if existing is None:
            merged[key] = {
                "board": item["board"],
                "slug": item["slug"],
                "sourceStems": [item["sourceStem"]],
                "revisionChecklist": item["revisionChecklist"],
                "examFocus": item["examFocus"],
                "longAnswerPrompts": item["longAnswerPrompts"],
            }
            continue

        existing["sourceStems"] = dedupe_keep_order([*existing["sourceStems"], item["sourceStem"]])
        existing["revisionChecklist"] = dedupe_keep_order([*existing["revisionChecklist"], *item["revisionChecklist"]])[:8]
        existing["examFocus"] = dedupe_keep_order([*existing["examFocus"], *item["examFocus"]])[:5]
        existing["longAnswerPrompts"] = existing["longAnswerPrompts"] + [
            prompt for prompt in item["longAnswerPrompts"]
            if not any(existing_prompt["title"] == prompt["title"] and existing_prompt["tier"] == prompt["tier"] for existing_prompt in existing["longAnswerPrompts"])
        ]

    final_items = sorted(merged.values(), key=lambda item: (item["board"], item["slug"]))

    output = """/* eslint-disable */
// Auto-generated by scripts/build_topic_augmentations.py
export type TopicAugmentationBoard = "ocr" | "aqa" | "edexcel" | "eduqas";

export interface LongAnswerPrompt {
  tier: "standard" | "extension";
  title: string;
  scenario: string;
  task: string;
  markRange?: string | null;
  indicativePoints: string[];
  sampleAnswer?: string;
  aiPrompt: string;
}

export interface TopicAugmentation {
  board: TopicAugmentationBoard;
  slug: string;
  sourceStems: string[];
  revisionChecklist: string[];
  examFocus: string[];
  longAnswerPrompts: LongAnswerPrompt[];
}

export const topicAugmentations: TopicAugmentation[] = """ + json.dumps(final_items, indent=2) + " as TopicAugmentation[];\n"

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(output, encoding="utf8")
    print(f"Generated {OUTPUT_FILE.relative_to(ROOT)} with {len(final_items)} topic augmentations.")


if __name__ == "__main__":
    main()
