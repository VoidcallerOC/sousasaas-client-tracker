import { logoutAction } from "@/app/login/actions";
import { Tracker } from "@/components/tracker";
import { SyncButton } from "@/components/sync-button";
import { readClients } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const clients = await readClients();
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[390px] px-4 pb-28 pt-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f4b41a]">
            SousaSaaS
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Care plan $35/mo · Potential / Pending / Paid
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <form action={logoutAction}>
            <button
              type="submit"
              className="h-12 rounded-xl border border-zinc-800 px-3 text-sm text-zinc-400"
            >
              Log out
            </button>
          </form>
          <SyncButton />
        </div>
      </header>
      <Tracker clients={clients} />
    </main>
  );
}
