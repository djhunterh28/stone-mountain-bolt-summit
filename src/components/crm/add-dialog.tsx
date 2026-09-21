import { useState, type FormEvent, type ComponentProps } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUi } from "@/lib/crm/store";
import { createActivity, createDeal, createLead, createOrg, createPerson, getBootstrap } from "@/lib/crm/server";

const KINDS = ["deal", "lead", "person", "org", "activity"] as const;

export function AddDialog() {
  const { addOpen, addKind, setAddOpen, memberId } = useUi();
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const pipeline = boot.data?.pipelines[0];
  const [kind, setKind] = useState<(typeof KINDS)[number]>(addKind);
  const [pending, setPending] = useState(false);
  const [source, setSource] = useState("Web form");
  const [actType, setActType] = useState("site-survey");

  const onOpen = (open: boolean) => {
    if (open) setKind(addKind);
    setAddOpen(open, addKind);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      if (kind === "deal") {
        await createDeal({
          data: {
            title: String(fd.get("title") || "Untitled show"),
            value: Number(fd.get("value") || 0),
            pipelineId: pipeline?.id ?? 1,
            stageId: pipeline?.stages[0]?.id ?? 1,
            ownerId: memberId,
            venue: String(fd.get("venue") || "") || undefined,
            eventDate: String(fd.get("eventDate") || "") || null,
            source: "Manual",
          },
        });
        toast.success("Deal created");
        qc.invalidateQueries({ queryKey: ["deals"] });
      } else if (kind === "lead") {
        await createLead({
          data: {
            title: String(fd.get("title") || "New lead"),
            source: source,
            ownerId: memberId,
            notes: String(fd.get("notes") || "") || undefined,
          },
        });
        toast.success("Lead captured");
        qc.invalidateQueries({ queryKey: ["leads"] });
      } else if (kind === "person") {
        await createPerson({
          data: {
            name: String(fd.get("name") || "New contact"),
            email: String(fd.get("email") || "") || undefined,
            phone: String(fd.get("phone") || "") || undefined,
            title: String(fd.get("title") || "") || undefined,
            ownerId: memberId,
          },
        });
        toast.success("Person added");
        qc.invalidateQueries({ queryKey: ["people"] });
      } else if (kind === "org") {
        await createOrg({
          data: {
            name: String(fd.get("name") || "New organization"),
            industry: String(fd.get("industry") || "") || undefined,
            website: String(fd.get("website") || "") || undefined,
            ownerId: memberId,
          },
        });
        toast.success("Organization added");
        qc.invalidateQueries({ queryKey: ["orgs"] });
      } else {
        await createActivity({
          data: {
            type: actType,
            subject: String(fd.get("subject") || "Follow up"),
            ownerId: memberId,
            dueAt: String(fd.get("dueAt") || "") || null,
            location: String(fd.get("location") || "") || undefined,
          },
        });
        toast.success("Activity scheduled");
        qc.invalidateQueries({ queryKey: ["activities"] });
      }
      setAddOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={addOpen} onOpenChange={onOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick add</DialogTitle>
          <DialogDescription>Create a deal, lead, contact, or activity.</DialogDescription>
        </DialogHeader>
        <Tabs value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
          <TabsList className="mb-4 w-full">
            {KINDS.map((k) => (
              <TabsTrigger key={k} value={k} className="flex-1 capitalize">
                {k === "org" ? "Org" : k}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <form onSubmit={onSubmit} className="space-y-3">
          {kind === "deal" && (
            <>
              <Field name="title" label="Show / deal" placeholder="Pier 17 rooftop keynote" />
              <div className="grid grid-cols-2 gap-3">
                <Field name="value" label="Value (USD)" type="number" placeholder="85000" />
                <Field name="venue" label="Venue" placeholder="Cipriani 42nd" />
              </div>
              <Field name="eventDate" label="Event date" type="date" />
            </>
          )}
          {kind === "lead" && (
            <>
              <Field name="title" label="Lead" placeholder="Warehouse rave — Bushwick" />
              <div className="space-y-1">
                <Label htmlFor="source">Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger id="source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Web form", "Chatbot", "Live chat", "Prospector", "Referral", "Email"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={3} />
              </div>
            </>
          )}
          {kind === "person" && (
            <>
              <Field name="name" label="Name" placeholder="Elena Voss" />
              <div className="grid grid-cols-2 gap-3">
                <Field name="email" label="Email" type="email" />
                <Field name="phone" label="Phone" />
              </div>
              <Field name="title" label="Title" placeholder="Head of Events" />
            </>
          )}
          {kind === "org" && (
            <>
              <Field name="name" label="Organization" placeholder="The Shed" />
              <div className="grid grid-cols-2 gap-3">
                <Field name="industry" label="Industry" placeholder="Culture" />
                <Field name="website" label="Website" placeholder="theshed.org" />
              </div>
            </>
          )}
          {kind === "activity" && (
            <>
              <Field name="subject" label="Subject" placeholder="Site walk — Cipriani" />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="type">Type</Label>
                  <Select value={actType} onValueChange={setActType}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["call", "meeting", "site-survey", "task", "deadline", "lunch", "email"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Field name="dueAt" label="Due" type="datetime-local" />
              </div>
              <Field name="location" label="Location" placeholder="Venue or video" />
            </>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  name,
  label,
  ...props
}: { name: string; label: string } & ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
