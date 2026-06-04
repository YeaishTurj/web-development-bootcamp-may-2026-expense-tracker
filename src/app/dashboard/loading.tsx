export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-3 rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm backdrop-blur">
        <div className="h-4 w-28 rounded-full bg-muted" />
        <div className="h-8 w-72 rounded-full bg-muted" />
        <div className="h-4 w-full max-w-2xl rounded-full bg-muted" />

        <div className="grid gap-3 pt-4 sm:grid-cols-3">
          <div className="h-24 rounded-2xl bg-muted" />
          <div className="h-24 rounded-2xl bg-muted" />
          <div className="h-24 rounded-2xl bg-muted" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-3xl border border-border/70 bg-background/80 shadow-sm backdrop-blur" />
        <div className="h-72 rounded-3xl border border-border/70 bg-background/80 shadow-sm backdrop-blur" />
      </div>

      <div className="space-y-3">
        <div className="h-4 w-40 rounded-full bg-muted" />
        <div className="space-y-3">
          <div className="h-20 rounded-2xl border border-border/70 bg-background/80" />
          <div className="h-20 rounded-2xl border border-border/70 bg-background/80" />
        </div>
      </div>
    </div>
  );
}
