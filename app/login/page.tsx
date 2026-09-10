// TODO: wire up Supabase auth (email + password, or magic link).
// There is deliberately no "sign up" link here — accounts only come
// from an invite (see app/invite/[token]/page.tsx).

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-2xl text-ink">Sign in</h1>
      <form className="mt-6 space-y-4">
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Email
          </label>
          <input
            type="email"
            required
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
          Sign in
        </button>
      </form>
      <p className="mt-4 font-body text-xs text-ink-muted">
        New to the group? You'll need an invite link from an admin —
        accounts aren't self-serve.
      </p>
    </div>
  );
}
