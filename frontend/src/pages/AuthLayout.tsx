import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--brutal)_1px,transparent_1px),linear-gradient(90deg,var(--brutal)_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.12]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[12%] left-[8%] size-24 rounded-full border-2 border-brutal bg-secondary shadow-[5px_5px_0_0_var(--brutal)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] bottom-[14%] size-20 rotate-12 border-2 border-brutal bg-accent shadow-[5px_5px_0_0_var(--brutal)]"
      />
      <div className="flex w-full max-w-md animate-in flex-col items-center gap-4 duration-300 zoom-in-95 fade-in">
        <div className="flex size-14 -rotate-3 items-center justify-center border-2 border-brutal bg-card text-foreground shadow-[4px_4px_0_0_var(--brutal)]">
          <ShieldCheck className="size-7" strokeWidth={2.5} />
        </div>
        <h1 className="border-2 border-brutal bg-card px-3 py-1 text-2xl font-black tracking-tight uppercase shadow-[4px_4px_0_0_var(--brutal)] [text-shadow:2px_2px_0_var(--secondary)]"></h1>
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
