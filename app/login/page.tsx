import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-6 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(52,211,153,0.10),transparent_55%),radial-gradient(circle_at_85%_90%,rgba(52,211,153,0.06),transparent_55%)]"
      />
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-400">
          Front Window · Private
        </p>
      </div>
      <h1 className="mt-4 font-serif text-[44px] leading-[0.95] tracking-tight text-zinc-50">
        Client
        <br />
        <span className="italic text-emerald-300">tracker.</span>
      </h1>
      <p className="mt-4 max-w-[34ch] text-sm leading-6 text-zinc-400">
        Nick&rsquo;s pipeline for Hartford shops. Potential, Pending, Paid,
        Lost. Sign in with the shared password.
      </p>

      <LoginForm error={params.error === "1"} />

      <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-zinc-900 pt-5 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
        <div>
          <dt className="text-zinc-600">Care</dt>
          <dd className="mt-1 font-semibold text-zinc-300">$35/mo</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Statuses</dt>
          <dd className="mt-1 font-semibold text-zinc-300">4</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Access</dt>
          <dd className="mt-1 font-semibold text-zinc-300">Solo</dd>
        </div>
      </dl>

      <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-zinc-600">
        Farmington, CT · No index
      </p>
    </main>
  );
}
