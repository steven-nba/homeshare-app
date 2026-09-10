// TODO: on load, look up the invite by `params.token` in Supabase.
// If missing/expired, show a friendly "this link is no longer valid" state
// instead of a generic 404 — the person receiving it is a real member.

export default function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl text-ink">
        Set up your account
      </h1>
      <p className="mt-2 font-body text-sm text-ink-muted">
        You've been invited to join the group. This link is just for you —
        create your account below.
      </p>

      <form className="mt-6 space-y-4">
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Your name
          </label>
          <input
            type="text"
            required
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Short bio
          </label>
          <textarea
            rows={2}
            placeholder="A line or two other members will see"
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Password
          </label>
          <input
            type="password"
            required
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-olive-700 px-4 py-2 font-body text-sm text-stone-50 hover:bg-olive-600"
        >
          Create my account
        </button>
      </form>

      <p className="mt-4 font-body text-xs text-ink-muted">
        Invite token: {params.token}
      </p>
    </div>
  );
}
