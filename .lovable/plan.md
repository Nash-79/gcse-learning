

## Goal
Make the **Notes tab** on every topic page look polished and easy to scan — like a properly typeset article — instead of one undifferentiated wall of muted text.

## Root cause
In `src/pages/TopicPage.tsx` (lines 365-369) the entire `content.explanation: string[]` is rendered as:
```tsx
<div className="prose prose-lg max-w-none">
  {content.explanation.map((p, i) => (
    <p className="text-lg leading-relaxed text-muted-foreground">{p}</p>
  ))}
</div>
```
Every paragraph uses the same muted color, no spacing rhythm, no lead paragraph, no section markers, and the long em-dash sentences (e.g. *"Syntax errors (you broke Python's grammar rules — like forgetting a colon)"*) have no visual breaks. The data files (15+ topics) are well-structured but boring strings — fixing them all individually is wasteful when a presentation fix solves it everywhere.

## Approach
Build a new `<TopicNotes>` presentation component that takes `explanation: string[]` and renders it as a styled article. **Zero data changes** — works for all existing and future topics.

### What it does
1. **Lead paragraph** — first paragraph rendered larger, in `text-foreground` (not muted), as a confident summary.
2. **Numbered/labelled sections** — each subsequent paragraph gets a small auto-generated heading derived from its first noun phrase (e.g. "Writing Code", "Errors") **OR** simpler: a soft section divider + index pill ("01", "02", "03") so each paragraph reads as its own section.
3. **Inline emphasis** — auto-detect and style:
   - Backtick `code` → inline `<code>` chip
   - Em-dash `—` clauses → render as a softer continuation
   - Parenthetical definitions like `(called sequence)` → light muted style
   - Capitalised key terms like *Syntax errors*, *Logic errors*, *Runtime errors* when followed by `(` → bold accent
4. **Card framing** — wrap notes in a subtle bordered card with proper padding so it doesn't bleed into the surrounding tabs.
5. **Better typography** — `text-foreground/85`, `leading-[1.75]`, max line length capped at ~72ch for readability, generous `space-y-6`.

### Optional polish (cheap)
- A small "Notes" header chip with a 📖 icon at the top of the section (matches the AI Helper aesthetic).
- Reading time estimate ("~2 min read") computed from word count.

## Files to change
- **New**: `src/components/content/TopicNotes.tsx` — the presentational component (handles all the inline parsing + numbered section layout).
- **Edit**: `src/pages/TopicPage.tsx` — replace lines 365-369 with `<TopicNotes paragraphs={content.explanation} />`.

No data files touched. No backend changes. Works across all 15+ topics instantly.

## Acceptance check
Open `/topic/intro-to-python` → Notes tab. Expected:
- Lead paragraph is larger, brighter, and reads like an intro.
- The remaining 3 paragraphs each appear as their own visually-separated section with numbered/iconed lead-ins.
- Inline parentheticals and key terms (Syntax/Logic/Runtime errors) stand out.
- Same polish appears on `/topic/variables-constants`, `/topic/boolean-logic`, and any other topic — all from the same component.

