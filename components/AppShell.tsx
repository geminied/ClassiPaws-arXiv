"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Sparkles,
  BarChart3,
  Trophy,
  Brain,
  BookOpen,
  Settings,
  Menu,
  X,
  PawPrint,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    href: "/",
    label: "Home",
    emoji: "🏠",
    icon: Home,
  },
  {
    href: "/search",
    label: "Search Papers",
    emoji: "🔎",
    icon: Search,
  },
  {
    href: "/predict",
    label: "Predict",
    emoji: "🐱",
    icon: Sparkles,
  },
  {
    href: "/performance",
    label: "Performance",
    emoji: "📊",
    icon: BarChart3,
  },
  {
    href: "/models",
    label: "Top Models",
    emoji: "🏆",
    icon: Trophy,
  },
  {
    href: "/ensemble",
    label: "Ensemble",
    emoji: "🧠",
    icon: Brain,
  },
  {
    href: "/about",
    label: "About",
    emoji: "📖",
    icon: BookOpen,
  },
  {
    href: "/settings",
    label: "Settings",
    emoji: "⚙️",
    icon: Settings,
  },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-cat">🐱</div>

          <div>
            <div className="brand-name">
              Classi<span>Paws</span>
            </div>

            <div className="brand-subtitle">
              arXiv explorer ✨
            </div>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="paw-divider">
          🐾 ───────── 🐾
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">
            EXPLORE
          </div>

          {navigation.slice(0, 6).map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-item ${active ? "active" : ""}`}
              >
                <span className="nav-emoji">
                  {item.emoji}
                </span>

                <Icon size={17} />

                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="nav-label secondary-label">
            MORE
          </div>

          {navigation.slice(6).map((item) => {
            const Icon = item.icon;

            const active =
              pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-item ${active ? "active" : ""}`}
              >
                <span className="nav-emoji">
                  {item.emoji}
                </span>

                <Icon size={17} />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="mini-mascot">
            🐾
          </div>

          <div>
            <strong>Happy researching!</strong>
            <small>
              One paper at a time ✨
            </small>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-content">
        <button
          className="mobile-menu"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="content-inner">
          {children}
        </div>
      </main>
    </div>
  );
}