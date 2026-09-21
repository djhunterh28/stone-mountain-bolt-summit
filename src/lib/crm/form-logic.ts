import type { FormCondition, FormField, FormStep } from "./types";

export const FIELD_TYPES = [
  { id: "text", label: "Text" },
  { id: "email", label: "Email" },
  { id: "tel", label: "Phone" },
  { id: "number", label: "Number" },
  { id: "date", label: "Date" },
  { id: "url", label: "URL" },
  { id: "textarea", label: "Long text" },
  { id: "select", label: "Dropdown" },
  { id: "radio", label: "Single choice" },
  { id: "multicheck", label: "Multi choice" },
  { id: "yesno", label: "Yes / No" },
  { id: "file", label: "File upload" },
  { id: "heading", label: "Heading" },
] as const;

export const CHOICE_TYPES = new Set(["select", "radio", "multicheck"]);

export function evalCondition(cond: FormCondition | null | undefined, values: Record<string, string>): boolean {
  if (!cond?.fieldId) return true;
  const v = values[cond.fieldId] ?? "";
  switch (cond.op) {
    case "eq":
      return v === (cond.value ?? "");
    case "neq":
      return v !== (cond.value ?? "");
    case "contains":
      return v.toLowerCase().includes((cond.value ?? "").toLowerCase());
    case "not_empty":
      return v.trim().length > 0;
    case "empty":
      return v.trim().length === 0;
    default:
      return true;
  }
}

export function fieldVisible(field: FormField, values: Record<string, string>): boolean {
  return evalCondition(field.condition, values);
}

export function stepHasVisibleFields(fields: FormField[], index: number, values: Record<string, string>): boolean {
  return fields.some((f) => (f.step ?? 0) === index && f.type !== "heading" && fieldVisible(f, values));
}

export function visibleStepIndexes(steps: FormStep[], fields: FormField[], values: Record<string, string>): number[] {
  if (!steps.length) return [0];
  return steps
    .map((_, i) => i)
    .filter((i) => evalCondition(steps[i]?.condition, values) && (stepHasVisibleFields(fields, i, values) || fields.every((f) => (f.step ?? 0) !== i)));
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "form"
  );
}

export function newFieldId(): string {
  return `f_${Math.random().toString(36).slice(2, 8)}`;
}

export function inputType(t: string): string {
  if (t === "email" || t === "tel" || t === "number" || t === "date" || t === "url") return t;
  return "text";
}

export function conditionLabel(cond: FormCondition | null | undefined, fields: FormField[]): string | null {
  if (!cond?.fieldId) return null;
  const src = fields.find((f) => f.id === cond.fieldId);
  const name = src?.label ?? cond.fieldId;
  if (cond.op === "not_empty") return `Shown if ${name} is filled`;
  if (cond.op === "empty") return `Shown if ${name} is empty`;
  if (cond.op === "contains") return `Shown if ${name} contains “${cond.value ?? ""}”`;
  if (cond.op === "neq") return `Shown if ${name} is not ${cond.value ?? ""}`;
  return `Shown if ${name} is ${cond.value ?? ""}`;
}
