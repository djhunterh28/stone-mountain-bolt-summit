//#region node_modules/.nitro/vite/services/ssr/assets/form-logic-B_LD3eqk.js
var FIELD_TYPES = [
	{
		id: "text",
		label: "Text"
	},
	{
		id: "email",
		label: "Email"
	},
	{
		id: "tel",
		label: "Phone"
	},
	{
		id: "number",
		label: "Number"
	},
	{
		id: "date",
		label: "Date"
	},
	{
		id: "url",
		label: "URL"
	},
	{
		id: "textarea",
		label: "Long text"
	},
	{
		id: "select",
		label: "Dropdown"
	},
	{
		id: "radio",
		label: "Single choice"
	},
	{
		id: "multicheck",
		label: "Multi choice"
	},
	{
		id: "yesno",
		label: "Yes / No"
	},
	{
		id: "file",
		label: "File upload"
	},
	{
		id: "heading",
		label: "Heading"
	}
];
var CHOICE_TYPES = /* @__PURE__ */ new Set([
	"select",
	"radio",
	"multicheck"
]);
function evalCondition(cond, values) {
	if (!cond?.fieldId) return true;
	const v = values[cond.fieldId] ?? "";
	switch (cond.op) {
		case "eq": return v === (cond.value ?? "");
		case "neq": return v !== (cond.value ?? "");
		case "contains": return v.toLowerCase().includes((cond.value ?? "").toLowerCase());
		case "not_empty": return v.trim().length > 0;
		case "empty": return v.trim().length === 0;
		default: return true;
	}
}
function fieldVisible(field, values) {
	return evalCondition(field.condition, values);
}
function stepHasVisibleFields(fields, index, values) {
	return fields.some((f) => (f.step ?? 0) === index && f.type !== "heading" && fieldVisible(f, values));
}
function visibleStepIndexes(steps, fields, values) {
	if (!steps.length) return [0];
	return steps.map((_, i) => i).filter((i) => evalCondition(steps[i]?.condition, values) && (stepHasVisibleFields(fields, i, values) || fields.every((f) => (f.step ?? 0) !== i)));
}
function slugify(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "form";
}
function newFieldId() {
	return `f_${Math.random().toString(36).slice(2, 8)}`;
}
function inputType(t) {
	if (t === "email" || t === "tel" || t === "number" || t === "date" || t === "url") return t;
	return "text";
}
function conditionLabel(cond, fields) {
	if (!cond?.fieldId) return null;
	const name = fields.find((f) => f.id === cond.fieldId)?.label ?? cond.fieldId;
	if (cond.op === "not_empty") return `Shown if ${name} is filled`;
	if (cond.op === "empty") return `Shown if ${name} is empty`;
	if (cond.op === "contains") return `Shown if ${name} contains “${cond.value ?? ""}”`;
	if (cond.op === "neq") return `Shown if ${name} is not ${cond.value ?? ""}`;
	return `Shown if ${name} is ${cond.value ?? ""}`;
}
//#endregion
export { inputType as a, visibleStepIndexes as c, fieldVisible as i, FIELD_TYPES as n, newFieldId as o, conditionLabel as r, slugify as s, CHOICE_TYPES as t };
