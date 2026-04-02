import Link from "next/link";
import {
  Compass,
  Home,
  MessageCircle,
  Settings,
  Users,
  Bookmark,
  Flame,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/feed", icon: Home, active: true },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Messages", href: "/messages", icon: MessageCircle },
  { label: "Groups", href: "/groups", icon: Users },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "Trending", href: "/trending", icon: Flame },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Buddy Script
              </h3>
              <p className="text-xs text-slate-500">Social feed dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    item.active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">
            Trending topics
          </h4>
          <div className="space-y-2">
            {["#react", "#nextjs", "#tailwind", "#supabase"].map((tag) => (
              <div
                key={tag}
                className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}