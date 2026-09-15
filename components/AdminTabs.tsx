import Link from "next/link";

const tabs = [
  { href: "/admin", label: "Listings", key: "listings" },
  { href: "/admin/members", label: "Members", key: "members" },
] as const;

export default function AdminTabs({
  active,
}: {
  active: (typeof tabs)[number]["key"];
}) {
  return (
    <div className="mb-6 flex gap-6 border-b border-border font-body text-sm">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`-mb-px border-b-2 px-1 pb-3 ${
            active === tab.key
              ? "border-olive-700 text-olive-700"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
