import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fieldVisible, inputType, visibleStepIndexes } from "@/lib/crm/form-logic";
import type { FormField, FormStep } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

export type FormFileValue = {
  fieldId: string;
  filename: string;
  mime: string;
  sizeBytes: number;
  dataB64: string;
  truncated: boolean;
};

type Props = {
  name: string;
  description?: string | null;
  thankYou?: string | null;
  fields: FormField[];
  steps: FormStep[];
  wizard: boolean;
  vendorName?: string | null;
  submitting?: boolean;
  preview?: boolean;
  onSubmit?: (payload: Record<string, string>, files: FormFileValue[]) => void;
};

const FILE_CAP = 45_000;

async function readFile(file: File): Promise<Omit<FormFileValue, "fieldId">> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const truncated = bytes.byteLength > FILE_CAP;
  const slice = truncated ? bytes.slice(0, FILE_CAP) : bytes;
  let s = "";
  for (let i = 0; i < slice.length; i += 0x8000) {
    s += String.fromCharCode(...slice.subarray(i, i + 0x8000));
  }
  return {
    filename: file.name,
    mime: file.type || "application/octet-stream",
    sizeBytes: file.size,
    dataB64: btoa(s),
    truncated,
  };
}

export function FormFill({
  name,
  description,
  thankYou,
  fields,
  steps,
  wizard,
  vendorName,
  submitting,
  preview,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, FormFileValue>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const indexes = useMemo(
    () => (wizard ? visibleStepIndexes(steps.length ? steps : [{ id: "s0", title: "Details" }], fields, values) : [0]),
    [wizard, steps, fields, values],
  );
  const cursor = indexes.includes(step) ? step : (indexes[0] ?? 0);
  const last = indexes[indexes.length - 1] ?? 0;
  const isLast = cursor === last || !wizard;
  const visible = fields.filter((f) => (!wizard || (f.step ?? 0) === cursor) && fieldVisible(f, values));

  function setVal(id: string, v: string) {
    setValues((prev) => ({ ...prev, [id]: v }));
  }

  function toggleMulti(id: string, option: string) {
    const cur = (values[id] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const next = cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option];
    setVal(id, next.join(","));
  }

  function validate(): string | null {
    for (const f of visible) {
      if (f.type === "heading") continue;
      if (!f.required) continue;
      if (f.type === "file") {
        if (!files[f.id]) return `${f.label} is required`;
        continue;
      }
      if (!(values[f.id] ?? "").trim()) return `${f.label} is required`;
    }
    return null;
  }

  function goNext() {
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setErr(null);
    if (!isLast) {
      const idx = indexes.indexOf(cursor);
      setStep(indexes[idx + 1] ?? last);
      return;
    }
    const payload: Record<string, string> = { ...values };
    for (const f of Object.values(files)) payload[f.fieldId] = f.filename;
    if (preview) {
      setDone(true);
      return;
    }
    onSubmit?.(payload, Object.values(files));
  }

  if (done) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Got it.</h2>
        <p className="text-sm text-muted-foreground">{thankYou || "Received. The shop will follow up."}</p>
        {preview && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              setDone(false);
              setStep(indexes[0] ?? 0);
            }}
          >
            Reset preview
          </Button>
        )}
      </div>
    );
  }

  const stepMeta = wizard ? steps[cursor] : null;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        goNext();
      }}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
        {vendorName && <p className="mt-1 text-xs font-medium tracking-wide text-steel uppercase">{vendorName}</p>}
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>

      {wizard && (
        <ol className="flex flex-wrap gap-2">
          {(steps.length ? steps : [{ id: "s0", title: "Details" }]).map((s, i) => {
            if (!indexes.includes(i)) return null;
            const on = i === cursor;
            const past = indexes.indexOf(i) < indexes.indexOf(cursor);
            return (
              <li key={s.id} className={cn("text-xs", on ? "font-medium text-foreground" : "text-muted-foreground")}>
                <span className={cn("mr-1.5 font-mono tabular-nums", past || on ? "text-steel" : "")}>
                  {String(indexes.indexOf(i) + 1).padStart(2, "0")}
                </span>{" "}
                {s.title}
              </li>
            );
          })}
        </ol>
      )}

      {stepMeta?.description && <p className="text-sm text-muted-foreground">{stepMeta.description}</p>}

      {visible.map((field) => (
        <Field
          key={field.id}
          field={field}
          value={values[field.id] ?? ""}
          file={files[field.id]}
          onChange={(v) => setVal(field.id, v)}
          onMulti={(o) => toggleMulti(field.id, o)}
          onFile={async (file) => {
            if (!file) {
              setFiles((prev) => {
                const next = { ...prev };
                delete next[field.id];
                return next;
              });
              return;
            }
            const read = await readFile(file);
            setFiles((prev) => ({ ...prev, [field.id]: { ...read, fieldId: field.id } }));
            setVal(field.id, file.name);
          }}
        />
      ))}

      {err && <p className="text-sm text-destructive">{err}</p>}

      <div className="flex flex-wrap gap-2">
        {wizard && cursor !== indexes[0] && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              const idx = indexes.indexOf(cursor);
              setStep(indexes[Math.max(0, idx - 1)] ?? 0);
              setErr(null);
            }}
          >
            Back
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Sending…" : isLast ? (preview ? "Test submit" : "Submit") : "Continue"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  field,
  value,
  file,
  onChange,
  onMulti,
  onFile,
}: {
  field: FormField;
  value: string;
  file?: FormFileValue;
  onChange: (v: string) => void;
  onMulti: (option: string) => void;
  onFile: (file: File | null) => void;
}) {
  if (field.type === "heading") {
    return (
      <div className="pt-2">
        <h2 className="text-sm font-medium">{field.label}</h2>
        {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
      </div>
    );
  }

  const selected = value.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.id} className="text-foreground">
        {field.label}
        {field.required ? " *" : ""}
      </Label>
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}

      {field.type === "textarea" ? (
        <Textarea
          id={field.id}
          name={field.id}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      ) : field.type === "select" ? (
        <select
          id={field.id}
          name={field.id}
          size={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]"
        >
          <option value="">Select</option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === "radio" || field.type === "yesno" ? (
        <div className="flex flex-wrap gap-2">
          {(field.type === "yesno" ? ["Yes", "No"] : field.options ?? []).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={cn(
                "h-9 rounded-md px-3 text-sm shadow-[var(--shadow-border)]",
                value === o ? "bg-primary text-primary-foreground" : "bg-secondary",
              )}
            >
              {o}
            </button>
          ))}
        </div>
      ) : field.type === "multicheck" ? (
        <div className="flex flex-col gap-1.5">
          {(field.options ?? []).map((o) => (
            <label key={o} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-current"
                checked={selected.includes(o)}
                onChange={() => onMulti(o)}
              />
              {o}
            </label>
          ))}
        </div>
      ) : field.type === "file" ? (
        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]">
          <input
            id={field.id}
            type="file"
            accept={field.accept}
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <span className="truncate text-muted-foreground">{file ? file.filename : "Choose file"}</span>
        </label>
      ) : (
        <Input
          id={field.id}
          name={field.id}
          type={inputType(field.type)}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function useEmbedHeight(active: boolean) {
  useEffect(() => {
    if (!active || typeof window === "undefined") return;
    const send = () => {
      const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      window.parent?.postMessage({ type: "nl-form-height", height: h }, "*");
    };
    send();
    const ro = new ResizeObserver(send);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [active]);
}
