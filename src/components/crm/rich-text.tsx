import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NOTE_CATEGORIES = [
  { id: "production", label: "Production" },
  { id: "client", label: "Client" },
  { id: "site", label: "Site" },
  { id: "power", label: "Power" },
  { id: "talent", label: "Talent" },
  { id: "labor", label: "Labor" },
  { id: "holds", label: "Holds" },
  { id: "safety", label: "Safety" },
] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number]["id"];

export function sanitizeNoteHtml(html: string) {
  const cleaned = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<\/?(?!\/?(p|br|strong|b|em|i|ul|ol|li|h3|a|div)\b)[^>]*>/gi, "");
  return cleaned.replace(/<a\s+[^>]*href=["'](?!https?:)[^"']*["'][^>]*>/gi, "<a>").trim();
}

export function notePlain(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value) el.innerHTML = value || "";
  }, [value]);

  function cmd(command: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    onChange(sanitizeNoteHtml(ref.current?.innerHTML ?? ""));
  }

  return (
    <div className="rounded-md bg-secondary shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap gap-0.5 border-b border-border p-1">
        <Tool onClick={() => cmd("bold")} label="Bold">
          B
        </Tool>
        <Tool onClick={() => cmd("italic")} label="Italic">
          I
        </Tool>
        <Tool onClick={() => cmd("insertUnorderedList")} label="List">
          List
        </Tool>
        <Tool onClick={() => cmd("formatBlock", "h3")} label="Heading">
          H
        </Tool>
        <Tool
          onClick={() => {
            const href = window.prompt("Link URL");
            if (href && /^https?:\/\//i.test(href)) cmd("createLink", href);
          }}
          label="Link"
        >
          Link
        </Tool>
      </div>
      <div className="relative">
        {!notePlain(value) && placeholder && (
          <p className="pointer-events-none absolute px-3 py-2 text-sm text-muted-foreground">{placeholder}</p>
        )}
        <div
          ref={ref}
          contentEditable
          role="textbox"
          aria-label={placeholder ?? "Note"}
          className="min-h-28 px-3 py-2 text-sm leading-relaxed outline-none [&_a]:underline [&_h3]:text-sm [&_h3]:font-medium [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          onInput={() => onChange(sanitizeNoteHtml(ref.current?.innerHTML ?? ""))}
        />
      </div>
    </div>
  );
}

function Tool({ onClick, label, children }: { onClick: () => void; label: string; children: string }) {
  return (
    <Button type="button" size="sm" variant="ghost" className={cn("h-7 px-2", children === "B" && "font-bold", children === "I" && "italic")} onClick={onClick}>
      <span className="sr-only">{label}</span>
      {children}
    </Button>
  );
}

export function NoteHtml({ html, className }: { html: string; className?: string }) {
  const safe = sanitizeNoteHtml(html);
  if (!notePlain(safe)) return null;
  return <div className={cn("text-sm leading-relaxed [&_a]:underline [&_h3]:text-sm [&_h3]:font-medium [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5", className)} dangerouslySetInnerHTML={{ __html: safe }} />;
}
