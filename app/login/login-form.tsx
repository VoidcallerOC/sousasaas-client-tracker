"use client";

import { useFormStatus } from "react-dom";
import { loginAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-emerald-400 text-base font-semibold text-zinc-950 active:scale-[0.99] disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm({ error }: { error: boolean }) {
  return (
    <form action={loginAction} className="mt-8">
      <label
        htmlFor="password"
        className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500"
      >
        Shared password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className="mt-3 h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 text-base text-zinc-50 outline-none ring-emerald-400/40 placeholder:text-zinc-700 focus:border-emerald-400/60 focus:ring-2"
        placeholder="••••••••"
      />
      {error ? (
        <p className="mt-3 text-sm text-rose-400">Wrong password. Try again.</p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
