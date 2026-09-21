import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bot, FormInput, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getLeadBooster } from "@/lib/crm/governance";

export const Route = createFileRoute("/leadbooster")({ component: LeadBoosterPage });

function LeadBoosterPage() {
  const d = useQuery({ queryKey: ["leadbooster"], queryFn: () => getLeadBooster() });
  const v = d.data;
  return (
    <div className="pb-12">
      <PageHeader
        title="LeadBooster"
        subtitle="Chatbots, live chat, and web forms — included on Ultimate. Round-robin to New Business."
      />
      <div className="grid gap-3 px-4 sm:px-6 lg:grid-cols-3">
        <Card
          icon={Bot}
          title="Chatbots"
          stat={`${v?.botCount ?? 0} live`}
          body={`${v?.botConvos ?? 0} conversations. Qualifies date, venue, and headcount before the AE picks up.`}
          href="/chatbot"
          action="Open flows"
        />
        <Card
          icon={MessageSquare}
          title="Live chat"
          stat={`${v?.chats ?? 0} threads`}
          body="Website widget, round-robin to New Business. Copilot can draft the first reply."
          href="/inbox"
          action="Open inbox"
        />
        <Card
          icon={FormInput}
          title="Web forms"
          stat={`${v?.formCount ?? 0} forms`}
          body={`${v?.forms ?? 0} submissions. Conditional logic, wizard steps, vendor assignment, file uploads, two-line embed.`}
          href="/forms"
          action="Open forms"
        />
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  stat,
  body,
  href,
  action,
}: {
  icon: typeof Bot;
  title: string;
  stat: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <article className="flex flex-col rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
      <Icon className="size-4 text-steel" />
      <h2 className="mt-4 text-sm font-medium">{title}</h2>
      <p className="mt-1 font-mono text-2xl tabular-nums">{stat}</p>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
      <Button asChild size="sm" variant="secondary" className="mt-5 w-fit">
        <Link to={href as "/"}>{action}</Link>
      </Button>
    </article>
  );
}
