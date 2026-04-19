import { useState } from "react";
import { Copy, Check, Table2 } from "lucide-react";
import type { TraceTable as TraceTableData } from "@/lib/parseAssistantOutput";

interface TraceTableProps {
  heading: string;
  trace: TraceTableData;
  bullets?: string[];
}

function toTsv(trace: TraceTableData): string {
  const header = trace.columns.join("\t");
  const body = trace.rows.map((r) => r.join("\t")).join("\n");
  return `${header}\n${body}`;
}

/**
 * Variable-trace table — dedicated render for structured sections that walk
 * through a loop or algorithm step-by-step. Sticky header, monospace cells,
 * zebra rows, horizontal scroll, and a copy-as-TSV button.
 */
export function TraceTable({ heading, trace, bullets }: TraceTableProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(toTsv(trace));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="my-6">
      <h2 className="text-[17px] font-display font-bold tracking-tight text-foreground mt-8 mb-3.5 pb-2 border-b border-border/40 flex items-center gap-2">
        {heading}
      </h2>
      <div className="rounded-xl border border-border/40 bg-card/80 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/30 bg-muted/30">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
            <Table2 className="w-3.5 h-3.5" />
            Variable trace · {trace.rows.length} step{trace.rows.length === 1 ? "" : "s"}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy as TSV"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] font-mono">
            <thead className="bg-muted/40 sticky top-0">
              <tr>
                {trace.columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 text-left font-semibold text-foreground/90 border-b border-border/30 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trace.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={rowIdx % 2 === 1 ? "bg-muted/15" : undefined}
                >
                  {trace.columns.map((_, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-3 py-1.5 border-b border-border/15 text-foreground/85 whitespace-nowrap"
                    >
                      {row[colIdx] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {bullets && bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-[14px] leading-[1.8] text-foreground/85">
          {bullets.map((b, i) => (
            <li key={i} className="list-disc ml-5 marker:text-secondary/60">
              {b}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
