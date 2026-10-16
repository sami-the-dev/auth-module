import {
  CheckCircle2,
  KeyRound,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/auth-context";
import { Button } from "@/components/ui/button";

const BRUTAL = "border-2 border-brutal shadow-[5px_5px_0_0_var(--brutal)]";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function initials(name?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "?")
    .concat(parts.length > 1 ? parts[parts.length - 1][0] : "")
    .toUpperCase();
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 bg-card p-3 ${BRUTAL} shadow-[3px_3px_0_0_var(--brutal)]`}
    >
      <div className="flex size-10 shrink-0 items-center justify-center border-2 border-brutal bg-secondary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="truncate text-sm font-semibold">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/signin", { replace: true });
  };

  const firstName = user?.name?.trim().split(/\s+/)[0];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--brutal)_1px,transparent_1px),linear-gradient(90deg,var(--brutal)_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.12]"
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute top-[10%] left-[7%] size-24 animate-bounce rounded-full bg-secondary [animation-duration:3s] ${BRUTAL}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute right-[9%] bottom-[12%] size-20 rotate-12 bg-accent ${BRUTAL}`}
      />

      <section className="relative z-10 w-full max-w-lg animate-in space-y-5 duration-500 fade-in slide-in-from-bottom-4">
        <div className={`flex items-center gap-4 bg-card p-5 ${BRUTAL}`}>
          <div
            className={`flex size-20 shrink-0 -rotate-3 items-center justify-center bg-primary text-3xl font-black text-primary-foreground ${BRUTAL}`}
            aria-hidden
          >
            {initials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              <Sparkles className="size-3.5" /> {greeting()}
            </p>
            <h1 className="truncate text-3xl font-black tracking-tight">
              {firstName ?? "friend"}
            </h1>
            <span className="mt-1 inline-flex items-center gap-1 border-2 border-brutal bg-secondary px-2 py-0.5 text-xs font-bold uppercase">
              <CheckCircle2 className="size-3.5" /> You're all set!
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          <Detail
            icon={<UserIcon className="size-5" />}
            label="Name"
            value={user?.name}
          />
          <Detail
            icon={<Mail className="size-5" />}
            label="Email"
            value={user?.email}
          />
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full bg-card font-bold uppercase"
          onClick={handleLogout}
        >
          <LogOut className="size-4" /> Log out
        </Button>
      </section>
    </main>
  );
}
