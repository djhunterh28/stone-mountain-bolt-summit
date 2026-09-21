import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getBoardPublic, type BoardJob, type BoardLane } from "@/lib/crm/boards";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/board/$token")({ component: KioskBoard });

const LANES: { id: BoardLane; label: string; hint: string }[] = [
  { id: "going_out", label: "Going out", hint: "Shop pull · trucks · pickups" },
  { id: "on_site", label: "On site", hint: "Load-in passed · live" },
  { id: "returning", label: "Returning", hint: "Strike · inbound" },
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const tz = "America/New_York";
  const time = now.toLocaleTimeString("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const date = now
    .toLocaleDateString("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
  return { time, date };
}

function KioskBoard() {
  const { token } = Route.useParams();
  const { time, date } = useClock();
  const q = useQuery({
    queryKey: ["board", token],
    queryFn: () => getBoardPublic({ data: { token } }),
    refetchInterval: 20_000,
    retry: 1,
  });

  useEffect(() => {
    document.documentElement.classList.add("nl-kiosk-root");
    let lock: WakeLockSentinel | undefined;
    void navigator.wakeLock
      ?.request("screen")
      .then((s) => {
        lock = s;
      })
      .catch(() => undefined);
    return () => {
      document.documentElement.classList.remove("nl-kiosk-root");
      void lock?.release();
    };
  }, []);

  const view = q.data;
  const jobs = view?.jobs ?? [];
  const grouped = useMemo(() => {
    const map: Record<BoardLane, BoardJob[]> = { going_out: [], on_site: [], returning: [] };
    for (const job of jobs) map[job.lane].push(job);
    return map;
  }, [jobs]);

  if (q.isLoading && !view) {
    return (
      <main className="nl-kiosk grid min-h-dvh place-items-center px-8">
        <p className="font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">Opening the board</p>
      </main>
    );
  }

  if (q.isFetched && !view) {
    return (
      <main className="nl-kiosk grid min-h-dvh place-items-center px-8 text-center">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Northline board</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">This board is offline</h1>
          <p className="mt-2 text-sm text-muted-foreground">Token not recognized. Ask operations for a new kiosk link.</p>
        </div>
      </main>
    );
  }

  const kind = view?.board.kind ?? "warehouse";

  return (
    <main
      className="nl-kiosk flex min-h-dvh cursor-none flex-col select-none"
      onDoubleClick={() => {
        if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.();
        else void document.exitFullscreen?.();
      }}
    >
      <header className="flex shrink-0 items-end justify-between gap-6 px-[4vw] pt-[3vh] pb-4">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 24 24" className="size-9 text-primary" aria-hidden>
            <rect x="4" y="5" width="3.2" height="14" rx="0.6" fill="currentColor" opacity="0.95" />
            <rect x="9.4" y="8" width="3.2" height="11" rx="0.6" fill="currentColor" opacity="0.7" />
            <rect x="14.8" y="3" width="3.2" height="16" rx="0.6" fill="currentColor" />
          </svg>
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Northline · display</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{view?.board.name ?? "Board"}</h1>
            <p className="text-sm text-muted-foreground">{view?.board.location}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-5xl font-medium tabular-nums tracking-tight sm:text-6xl md:text-7xl">{time}</div>
          <p className="mt-1 font-mono text-sm tracking-[0.16em] text-muted-foreground">{date}</p>
        </div>
      </header>

      {kind === "office" && <OfficeStrip jobs={jobs} />}

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 px-[4vw] pb-4 lg:grid-cols-3">
        {LANES.map((lane) => (
          <article key={lane.id} className="flex min-h-0 flex-col rounded-2xl bg-card px-5 py-4">
            <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{lane.label}</h2>
                <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">{lane.hint}</p>
              </div>
              <span className="font-mono text-2xl tabular-nums text-primary">{grouped[lane.id].length}</span>
            </div>
            <ul className="flex-1 space-y-3 overflow-y-auto scrollbar-thin">
              {grouped[lane.id].length === 0 && <li className="py-10 text-center text-sm text-muted-foreground">Quiet.</li>}
              {grouped[lane.id].map((job) => (
                <JobRow key={job.id} job={job} kind={kind} />
              ))}
            </ul>
          </article>
        ))}
      </section>

      <footer className="flex shrink-0 items-center justify-between px-[4vw] pb-[2.4vh] font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
        <span>Read-only · no account</span>
        <span>{jobs.length} jobs in the window</span>
        <span>Refreshes every 20s · double-tap fullscreen</span>
      </footer>
    </main>
  );
}

function JobRow({ job, kind }: { job: BoardJob; kind: "warehouse" | "office" }) {
  const meta: string[] = [];
  if (job.venue) meta.push(job.venue);
  if (job.orgName && job.orgName !== job.venue) meta.push(job.orgName);
  if (kind === "warehouse") {
    if (job.trucks) meta.push(job.trucks === 1 ? "1 truck" : `${Math.round(job.trucks)} trucks`);
    if (job.crew) meta.push(`${Math.round(job.crew)} crew`);
    if (job.indoor === false) meta.push("outdoor");
  } else {
    if (job.ownerName) meta.push(job.ownerName);
    if (job.stageName) meta.push(job.stageName);
    if (job.guestCount) meta.push(`${job.guestCount} pax`);
  }

  return (
    <li className="rounded-xl bg-muted px-4 py-3">
      <div className="flex items-start gap-4">
        <div className="w-16 shrink-0">
          <div className="font-mono text-2xl font-medium tabular-nums">{job.loadIn ?? "—"}</div>
          {job.dayLabel !== "today" && (
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-warn uppercase">{job.dayLabel}</p>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-medium leading-tight">{job.title}</h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{meta.join(" · ") || "No venue"}</p>
          {kind === "warehouse" && job.gear.length > 0 && (
            <p className="mt-2 truncate font-mono text-[11px] tracking-wide text-primary">{job.gear.join("  ·  ")}</p>
          )}
          {kind === "office" && job.notes && <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{job.notes}</p>}
        </div>
      </div>
    </li>
  );
}

function OfficeStrip({ jobs }: { jobs: BoardJob[] }) {
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const nowH = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "America/New_York", hour: "2-digit", hour12: false }).format(new Date()),
  );
  return (
    <div className="mb-3 px-[4vw]">
      <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
        {hours.map((h) => {
          const count = jobs.filter((j) => {
            if (!j.loadIn) return false;
            const hh = Number(j.loadIn.split(":")[0]);
            return hh === h && j.dayLabel === "today";
          }).length;
          const current = h === nowH;
          return (
            <div
              key={h}
              className={cn(
                "rounded-md px-1 py-2 text-center",
                current ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
              )}
            >
              <div className="font-mono text-[11px] tabular-nums">{String(h).padStart(2, "0")}</div>
              <div className={cn("mt-1 font-mono text-sm tabular-nums", count && !current && "text-foreground")}>
                {count || "·"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
