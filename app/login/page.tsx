import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col justify-center px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
        Front Window
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
        Client tracker
      </h1>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        Private pipeline for Nick Sousa. Sign in with the shared password.
      </p>
      <LoginForm error={params.error === "1"} />
    </main>
  );
}
