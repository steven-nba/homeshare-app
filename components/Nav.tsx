"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Simple top nav shell. Swap "Homeshare" for the real group name once
// naming/branding is settled (see README "Open Items").
export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setSignedIn(!!user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const links = (
    <>
      <Link href="/" className="hover:text-olive-700">
        Homes
      </Link>
      <Link href="/messages" className="hover:text-olive-700">
        Messages
      </Link>
      <Link href="/my-homes" className="hover:text-olive-700">
        My Homes
      </Link>
      <Link href="/admin" className="hover:text-olive-700">
        Admin
      </Link>
      {signedIn ? (
        <button
          onClick={handleSignOut}
          className="rounded-xl border border-olive-700 px-4 py-2 text-center text-olive-700 hover:bg-olive-50"
        >
          Sign out
        </button>
      ) : (
        <Link
          href="/login"
          className="rounded-xl bg-olive-700 px-4 py-2 text-center text-stone-50 hover:bg-olive-600"
        >
          Sign in
        </Link>
      )}
    </>
  );

  return (
    <header className="border-b border-border bg-stone-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl text-ink">
          Homeshare <span className="text-olive-600">— Rev0</span>
        </Link>
        <nav className="hidden items-center gap-6 font-body text-sm text-ink sm:flex">
          {links}
        </nav>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="p-1 text-ink sm:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="flex flex-col gap-4 border-t border-border px-6 py-4 font-body text-sm text-ink sm:hidden">
          {links}
        </nav>
      )}
    </header>
  );
}
