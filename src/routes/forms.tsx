import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { FormFill } from "@/components/crm/form-fill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  archiveForm,
  createForm,
  downloadFormUpload,
  getFormsDesk,
  rotateVendorToken,
  saveForm,
  type CustomForm,
  type DirectoryVendor,
  type FormSubmission,
} from "@/lib/crm/forms";
import { CHOICE_TYPES, FIELD_TYPES, conditionLabel, newFieldId, slugify } from "@/lib/crm/form-logic";
import type { FormCondition, FormField, FormStep } from "@/lib/crm/types";
import { formatDateTime, formatBytes, saveBase64File } from "@/lib/utils";

export const Route = createFileRoute("/forms")({ component: FormsPage });

function origin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

function snippet(slug: string, vendor?: string) {
  const vendorAttr = vendor ? ` data-nl-vendor="${vendor}"` : "";
  return `<div data-nl-form="${slug}"${vendorAttr}></div>\n<script async src="${origin()}/embed.js"></script>`;
}

async function copy(text: string, ok = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(ok);
  } catch {
    toast.message(text);
  }
}

function FormsPage() {
  const desk = useQuery({ queryKey: ["forms-desk"], queryFn: () => getFormsDesk() });
  const qc = useQueryClient();
  const forms = desk.data?.forms ?? [];
  const vendors = desk.data?.vendors ?? [];
  const submissions = desk.data?.submissions ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tab, setTab] = useState("library");

  function refresh() {
    qc.invalidateQueries({ queryKey: ["forms-desk"] });
    qc.invalidateQueries({ queryKey: ["forms"] });
  }

  const selected = forms.find((f) => f.id === selectedId) ?? forms[0] ?? null;

  useEffect(() => {
    if (selected && selectedId == null) setSelectedId(selected.id);
  }, [selected, selectedId]);

  return (
    <div className="pb-12">
      <PageHeader
        title="Forms"
        subtitle="Conditional logic, wizard steps, vendor assignment, file uploads — two-line embed for any site."
        actions={
          <Button
            size="sm"
            onClick={() =>
              createForm({ data: { name: "New inquiry" } }).then((f) => {
                toast.success("Form created");
                setSelectedId(f.id);
                setTab("builder");
                refresh();
              })
            }
          >
            <Plus className="size-3.5" />
            New form
          </Button>
        }
      />
      <div className="px-4 sm:px-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-4">
            <div className="grid gap-3 lg:grid-cols-2">
              {forms.map((f) => (
                <article key={f.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-sm font-medium">{f.name}</h2>
                      <p className="font-mono text-xs text-muted-foreground">/{f.slug}</p>
                    </div>
                    <Badge variant={f.active ? "success" : "outline"}>{f.submissions} in</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description || "No description."}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {f.wizard && <Badge variant="steel">wizard</Badge>}
                    {f.fields.some((x) => x.condition) && <Badge variant="steel">logic</Badge>}
                    {f.fields.some((x) => x.type === "file") && <Badge>files</Badge>}
                    {f.vendorLock && <Badge variant="warn">vendor lock</Badge>}
                    {f.vendors.map((v) => (
                      <Badge key={v.id} variant="outline">
                        {v.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedId(f.id);
                        setTab("builder");
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <Link to="/f/$slug" params={{ slug: f.slug }} target="_blank">
                        Open
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => copy(snippet(f.slug), "Embed snippet copied")}>
                      <Copy className="size-3.5" />
                      Embed
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builder" className="mt-4">
            {selected ? (
              <Builder
                key={selected.id}
                form={selected}
                vendors={vendors}
                onSaved={(id) => {
                  setSelectedId(id);
                  refresh();
                }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Create a form to open the builder.</p>
            )}
          </TabsContent>

          <TabsContent value="inbox" className="mt-4">
            <Inbox submissions={submissions} forms={forms} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Builder({
  form,
  vendors,
  onSaved,
}: {
  form: CustomForm;
  vendors: DirectoryVendor[];
  onSaved: (id: number) => void;
}) {
  const [name, setName] = useState(form.name);
  const [slug, setSlug] = useState(form.slug);
  const [description, setDescription] = useState(form.description ?? "");
  const [thankYou, setThankYou] = useState(form.thankYou ?? "");
  const [notifyEmail, setNotifyEmail] = useState(form.notifyEmail ?? "");
  const [allowEmbed, setAllowEmbed] = useState(form.allowEmbed);
  const [wizard, setWizard] = useState(form.wizard);
  const [vendorLock, setVendorLock] = useState(form.vendorLock);
  const [createsLead, setCreatesLead] = useState(form.createsLead);
  const [active, setActive] = useState(form.active);
  const [fields, setFields] = useState<FormField[]>(form.fields);
  const [steps, setSteps] = useState<FormStep[]>(form.steps.length ? form.steps : [{ id: "s0", title: "Details" }]);
  const [vendorIds, setVendorIds] = useState<number[]>(form.vendors.map((v) => v.id));
  const [picked, setPicked] = useState<string | null>(form.fields[0]?.id ?? null);
  const [pane, setPane] = useState<"fields" | "logic" | "vendors" | "embed">("fields");
  const field = fields.find((f) => f.id === picked) ?? null;
  const assigned = form.vendors.filter((v) => vendorIds.includes(v.id));

  function patchField(id: string, next: Partial<FormField>) {
    setFields((list) => list.map((f) => (f.id === id ? { ...f, ...next } : f)));
  }

  function move(id: string, dir: -1 | 1) {
    setFields((list) => {
      const i = list.findIndex((f) => f.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const copy = [...list];
      const [row] = copy.splice(i, 1);
      copy.splice(j, 0, row);
      return copy;
    });
  }

  function addField(type: string) {
    const id = newFieldId();
    const row: FormField = {
      id,
      label: FIELD_TYPES.find((t) => t.id === type)?.label ?? "Field",
      type,
      required: type !== "heading" && type !== "file",
      step: wizard ? Math.max(0, steps.length - 1) : 0,
      options: CHOICE_TYPES.has(type) ? ["Option A", "Option B"] : undefined,
      accept: type === "file" ? "application/pdf,image/*" : undefined,
    };
    setFields((list) => [...list, row]);
    setPicked(id);
  }

  function persist() {
    void saveForm({
      data: {
        id: form.id,
        name,
        slug,
        description,
        thankYou,
        notifyEmail,
        allowEmbed,
        wizard,
        vendorLock,
        createsLead,
        active,
        fields,
        steps: wizard ? steps : [],
        vendorIds,
      },
    }).then((r) => {
      if (r.ok) {
        setSlug(r.slug);
        toast.success("Saved");
        onSaved(form.id);
      }
    });
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (slug === form.slug) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-1">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className="font-mono" />
          </div>
          <div className="space-y-1">
            <Label>Notify</Label>
            <Input value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} placeholder="sales@northline.av" />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Thank-you</Label>
            <Input value={thankYou} onChange={(e) => setThankYou(e.target.value)} />
          </div>
          <Toggle label="Active" checked={active} onChange={setActive} />
          <Toggle label="Wizard steps" checked={wizard} onChange={setWizard} />
          <Toggle label="Create lead" checked={createsLead} onChange={setCreatesLead} />
          <Toggle label="Allow embed" checked={allowEmbed} onChange={setAllowEmbed} />
          <Toggle label="Vendor lock" checked={vendorLock} onChange={setVendorLock} />
        </div>

        {wizard && (
          <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium">Steps</h2>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSteps((s) => [...s, { id: newFieldId(), title: `Step ${s.length + 1}` }])}
              >
                Add step
              </Button>
            </div>
            <ul className="space-y-2">
              {steps.map((s, i) => (
                <li key={s.id} className="flex flex-wrap items-center gap-2">
                  <span className="w-6 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <Input value={s.title} onChange={(e) => setSteps((list) => list.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)))} />
                  <Input
                    placeholder="Shown if…"
                    value={s.description ?? ""}
                    onChange={(e) => setSteps((list) => list.map((x) => (x.id === s.id ? { ...x, description: e.target.value } : x)))}
                  />
                  {steps.length > 1 && (
                    <Button size="icon-sm" variant="ghost" onClick={() => setSteps((list) => list.filter((x) => x.id !== s.id))}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="mb-3 flex flex-wrap gap-1">
            {(["fields", "logic", "vendors", "embed"] as const).map((p) => (
              <Button key={p} size="sm" variant={pane === p ? "default" : "ghost"} onClick={() => setPane(p)}>
                {p === "fields" ? "Fields" : p === "logic" ? "Logic" : p === "vendors" ? "Vendors" : "Embed"}
              </Button>
            ))}
          </div>

          {pane === "fields" && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {FIELD_TYPES.map((t) => (
                  <Button key={t.id} size="sm" variant="secondary" onClick={() => addField(t.id)}>
                    {t.label}
                  </Button>
                ))}
              </div>
              <ul className="divide-y divide-border">
                {fields.map((f, i) => (
                  <li key={f.id} className="flex items-center gap-2 py-2">
                    <button
                      type="button"
                      className={`min-w-0 flex-1 text-left text-sm ${picked === f.id ? "font-medium" : "text-muted-foreground"}`}
                      onClick={() => setPicked(f.id)}
                    >
                      {f.label}
                      <span className="ml-2 font-mono text-[11px] text-muted-foreground">{f.type}</span>
                      {f.required ? " · required" : ""}
                      {wizard ? ` · step ${(f.step ?? 0) + 1}` : ""}
                    </button>
                    <Button size="icon-sm" variant="ghost" onClick={() => move(f.id, -1)} disabled={i === 0}>
                      <ChevronUp className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => move(f.id, 1)} disabled={i === fields.length - 1}>
                      <ChevronDown className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        setFields((list) => list.filter((x) => x.id !== f.id));
                        if (picked === f.id) setPicked(null);
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
              {field && (
                <FieldInspector
                  field={field}
                  fields={fields}
                  steps={steps}
                  wizard={wizard}
                  onChange={(next) => patchField(field.id, next)}
                />
              )}
            </div>
          )}

          {pane === "logic" && (
            <ul className="space-y-2 text-sm">
              {fields.filter((f) => f.condition).length === 0 && (
                <li className="text-muted-foreground">No conditions yet. Open a field and set “Show when”.</li>
              )}
              {fields
                .filter((f) => f.condition)
                .map((f) => (
                  <li key={f.id} className="rounded-md bg-muted px-3 py-2">
                    <span className="font-medium">{f.label}</span>
                    <span className="text-muted-foreground"> — {conditionLabel(f.condition, fields)}</span>
                  </li>
                ))}
            </ul>
          )}

          {pane === "vendors" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Assigned vendors get a tokenized URL. Vendor lock rejects anyone without that token.
              </p>
              <ul className="space-y-2">
                {vendors.map((v) => {
                  const on = vendorIds.includes(v.id);
                  const token = assigned.find((a) => a.id === v.id)?.token;
                  return (
                    <li key={v.id} className="flex flex-wrap items-center gap-2 rounded-md bg-muted px-3 py-2">
                      <label className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 accent-current"
                          checked={on}
                          onChange={() =>
                            setVendorIds((ids) => (on ? ids.filter((id) => id !== v.id) : [...ids, v.id]))
                          }
                        />
                        <span className="truncate">
                          {v.name}
                          <span className="text-muted-foreground"> · {v.category}</span>
                        </span>
                      </label>
                      {token && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => copy(snippet(slug, token), "Vendor embed copied")}>
                            Embed
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copy(`${origin()}/f/${slug}?vendor=${token}`, "Vendor URL copied")}
                          >
                            Link
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              rotateVendorToken({ data: { formId: form.id, vendorId: v.id } }).then((r) => {
                                if (r.ok) {
                                  toast.success("Token rotated");
                                  onSaved(form.id);
                                }
                              })
                            }
                          >
                            Rotate
                          </Button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {pane === "embed" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Drop this on any marketing site. Two lines. Height resizes itself.</p>
              <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">{snippet(slug)}</pre>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => copy(snippet(slug), "Snippet copied")}>
                  Copy snippet
                </Button>
                <Button size="sm" variant="secondary" asChild>
                  <Link to="/f/$slug" params={{ slug }} search={{ embed: true }}>
                    Embed preview
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={persist}>Save form</Button>
          <Button
            variant="secondary"
            onClick={() =>
              archiveForm({ data: { id: form.id, active: !active } }).then(() => {
                setActive(!active);
                toast.success(active ? "Archived" : "Restored");
                onSaved(form.id);
              })
            }
          >
            {active ? "Archive" : "Restore"}
          </Button>
        </div>
      </div>

      <aside className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] lg:sticky lg:top-16 lg:self-start">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Live preview</p>
        <FormFill
          key={`${form.id}-${fields.length}-${wizard}`}
          name={name}
          description={description}
          thankYou={thankYou}
          fields={fields}
          steps={steps}
          wizard={wizard}
          preview
        />
      </aside>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function FieldInspector({
  field,
  fields,
  steps,
  wizard,
  onChange,
}: {
  field: FormField;
  fields: FormField[];
  steps: FormStep[];
  wizard: boolean;
  onChange: (next: Partial<FormField>) => void;
}) {
  const cond: FormCondition = field.condition ?? { fieldId: "", op: "eq", value: "" };
  const others = fields.filter((f) => f.id !== field.id && f.type !== "heading");
  return (
    <div className="space-y-3 rounded-md bg-muted p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Label</Label>
          <Input value={field.label} onChange={(e) => onChange({ label: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Type</Label>
          <select
            size={1}
            value={field.type}
            onChange={(e) =>
              onChange({
                type: e.target.value,
                options: CHOICE_TYPES.has(e.target.value) ? field.options ?? ["Option A", "Option B"] : field.options,
              })
            }
            className="flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label>Placeholder</Label>
          <Input value={field.placeholder ?? ""} onChange={(e) => onChange({ placeholder: e.target.value })} />
        </div>
        {wizard && (
          <div className="space-y-1">
            <Label>Step</Label>
            <select
              size={1}
              value={String(field.step ?? 0)}
              onChange={(e) => onChange({ step: Number(e.target.value) })}
              className="flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]"
            >
              {steps.map((s, i) => (
                <option key={s.id} value={i}>
                  {i + 1}. {s.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-current"
          checked={field.required}
          onChange={(e) => onChange({ required: e.target.checked })}
        />
        Required
      </label>
      <div className="space-y-1">
        <Label>Help</Label>
        <Input value={field.help ?? ""} onChange={(e) => onChange({ help: e.target.value })} />
      </div>
      {CHOICE_TYPES.has(field.type) && (
        <div className="space-y-1">
          <Label>Options (one per line)</Label>
          <Textarea
            rows={3}
            value={(field.options ?? []).join("\n")}
            onChange={(e) => onChange({ options: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
          />
        </div>
      )}
      {field.type === "file" && (
        <div className="space-y-1">
          <Label>Accepted types</Label>
          <Input value={field.accept ?? ""} onChange={(e) => onChange({ accept: e.target.value })} placeholder="application/pdf,image/*" />
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="space-y-1 sm:col-span-1">
          <Label>Show when</Label>
          <select
            size={1}
            value={cond.fieldId}
            onChange={(e) => onChange({ condition: e.target.value ? { ...cond, fieldId: e.target.value } : null })}
            className="flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]"
          >
            <option value="">Always</option>
            {others.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label>Rule</Label>
          <select
            size={1}
            value={cond.op}
            onChange={(e) => onChange({ condition: { ...cond, op: e.target.value as FormCondition["op"] } })}
            className="flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]"
            disabled={!cond.fieldId}
          >
            <option value="eq">is</option>
            <option value="neq">is not</option>
            <option value="contains">contains</option>
            <option value="not_empty">is filled</option>
            <option value="empty">is empty</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label>Value</Label>
          <Input
            value={cond.value ?? ""}
            onChange={(e) => onChange({ condition: { ...cond, value: e.target.value } })}
            disabled={!cond.fieldId || cond.op === "not_empty" || cond.op === "empty"}
          />
        </div>
      </div>
    </div>
  );
}

function Inbox({ submissions, forms }: { submissions: FormSubmission[]; forms: CustomForm[] }) {
  const [formId, setFormId] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);
  const rows = useMemo(
    () => submissions.filter((s) => formId === "all" || String(s.formId) === formId),
    [submissions, formId],
  );
  return (
    <div className="space-y-3">
      <select
        size={1}
        value={formId}
        onChange={(e) => setFormId(e.target.value)}
        className="flex h-10 max-w-sm rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]"
      >
        <option value="all">All forms</option>
        {forms.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
        {rows.length === 0 && <li className="px-4 py-8 text-sm text-muted-foreground">No submissions yet.</li>}
        {rows.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="flex w-full flex-wrap items-center gap-2 px-4 py-3 text-left"
              onClick={() => setOpen(open === s.id ? null : s.id)}
            >
              <span className="min-w-0 flex-1 text-sm font-medium">
                {s.payload.name || s.payload.company || s.payload.email || "Untitled"}
              </span>
              <span className="text-xs text-muted-foreground">{s.formName}</span>
              {s.vendorName && <Badge variant="steel">{s.vendorName}</Badge>}
              <Badge variant="outline">{s.source}</Badge>
              {s.files.length > 0 && <Badge>{s.files.length} file</Badge>}
              <span className="text-xs text-muted-foreground">{formatDateTime(s.createdAt)}</span>
            </button>
            {open === s.id && (
              <div className="space-y-2 px-4 pb-4">
                <dl className="grid gap-1 text-sm sm:grid-cols-2">
                  {Object.entries(s.payload).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-muted-foreground">{k}</dt>
                      <dd>{v || "—"}</dd>
                    </div>
                  ))}
                </dl>
                {s.files.map((f) => (
                  <Button
                    key={f.id}
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      downloadFormUpload({ data: { id: f.id } }).then((r) => {
                        if (r.ok) saveBase64File(r.filename, r.contentB64, r.mime);
                      })
                    }
                  >
                    {f.filename} · {formatBytes(f.sizeBytes)}
                    {f.truncated ? " · preview" : ""}
                  </Button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
