# Content Library

This directory is the **source of truth for all learner-facing content**.
Never publish content directly from `raw/` or `drafts/` — only from `content/`.

## Directory Structure

```
content/
  boards/
    {board}/          # ocr | aqa | edexcel | eduqas
      {spec_code}/    # j277 | 8525 | 1cp2 | c500qs
        paper{n}/
          {topic-slug}/
            metadata.yaml     ← board refs, dates, source URLs, reviewer
            topic.mdx         ← full revision notes (human-reviewed)
            quiz.json         ← 5-10 retrieval questions per topic
            mock.json         ← longer mixed-topic question sets
            diagrams/         ← owned SVG assets for this topic
raw/
  official/           ← OCR/AQA/Pearson spec PDFs and past papers
  licensed/           ← Any third-party licensed material
drafts/
  extracted/          ← Machine-produced JSON from PDF extraction
generated/
  search/             ← Search index built from content/
  content-index/      ← Typed TS arrays built from content/
  ai-seeds/           ← AI generation seed files per topic
```

## Adding New Content

1. Add source PDF to `raw/official/` with a `manifest.yaml` entry.
2. Run `npm run ingest:pdf -- --file=raw/official/my-spec.pdf --board=ocr --spec=J277`
   to produce a draft in `drafts/extracted/`.
3. Human review: copy draft to `content/boards/ocr/j277/.../topic.mdx`, edit for house style.
4. Set `status: published` and `last_reviewed_at` in `metadata.yaml`.
5. Run `npm run curriculum:validate` — must pass before merge.
6. Run `npm run diagrams` to generate any missing SVG diagrams.

## House Style Rules

- Short paragraphs — maximum 4 sentences.
- Bullet points for lists of 3 or more items.
- One diagram per concept that benefits from visual explanation.
- Every section must have an `examTip`.
- All key terms must appear in `keyTerms`.
- Common mistakes must be phrased as student errors, not warnings.

## Freshness Policy

| Board   | Max age before re-review |
|---------|--------------------------|
| OCR     | 90 days                  |
| AQA     | 90 days                  |
| Edexcel | 120 days                 |
| EDUQAS  | 120 days                 |

CI will fail if `last_reviewed_at` is stale.
