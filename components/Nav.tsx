import Link from "next/link";

// Simple top nav shell. Swap "Homeshare" for the real group name once
// naming/branding is settled (see README "Open Items").
export default function Nav() {
  return (
    <header className="border-b border-border bg-stone-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl text-ink">
          Homeshare <span className="text-olive-600">— Rev0</span>
        </Link>
        <nav className="flex items-center gap-6 font-body text-sm text-ink">
          <Link href="/" className="hover:text-olive-700">
            Homes
          </Link>
          <Link href="/messages" className="hover:text-olive-700">
            Messages
          </Link>
          <Link href="/admin" className="hover:text-olive-700">
            Admin
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-olive-700 px-4 py-2 text-stone-50 hover:bg-olive-600"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
