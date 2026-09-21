import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { money } from "@/lib/utils";

type AiInput = {
  kind: "email" | "summary" | "report" | "chatbot" | "assistant";
  prompt: string;
};

export const runAi = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: AiInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not available in this environment" };

    let prompt = data.prompt;
    if (data.kind === "assistant") {
      const sql = await getSql();
      const open = (
        await sql`select count(*) as c, coalesce(sum(value),0) as v from deals where status = 'open'`
      )[0];
      const won = (await sql`select count(*) as c, coalesce(sum(value),0) as v from deals where status = 'won'`)[0];
      const rot = (
        await sql`select count(*) as c from deals d join stages s on s.id = d.stage_id
          where d.status = 'open' and now() - d.stage_entered_at > (s.rotting_days || ' days')::interval`
      )[0];
      prompt = `CRM snapshot: open ${money(open?.v)} across ${Number(open?.c ?? 0)} deals; won ${money(won?.v)} (${Number(won?.c ?? 0)}); rotting ${Number(rot?.c ?? 0)}. Question: ${data.prompt}`;
    }

    const system =
      data.kind === "email"
        ? "You write concise, professional emails for Northline, a New York live-event AV production company (LED walls, line arrays, lighting, labor). No fluff. Sign as the account owner. Keep under 180 words."
        : data.kind === "summary"
          ? "You summarize CRM deals for a sales manager at a live-event AV company. Bullet the status, risks, next action. Under 120 words."
          : data.kind === "chatbot"
            ? "You are Northline's website chatbot. Qualify live-event AV inquiries (date, venue, indoor/outdoor, headcount, LED/audio/lighting). Be brief. Ask one question at a time."
            : data.kind === "assistant"
              ? "You are Northline's sales copilot for a NYC live-event AV shop. Answer from the snapshot. Be specific about next actions (site walk, recost, COI). Under 140 words. No markdown headings."
              : "You generate a short sales insights narrative from the numbers given. No markdown headings. 80-140 words.";

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 400,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `xAI API error ${res.status}` };
    return { ok: true as const, text: ((await res.json()) as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ?? "" };
  });
