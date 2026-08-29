"use client";

import Link from "next/link";
import {
  Home,
  Search,
  Brain,
  BarChart3,
  Layers3,
  Info,
} from "lucide-react";

const navigation = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Search Papers",
    href: "/search",
    icon: Search,
  },
  {
    label: "Predict Paper",
    href: "/predict",
    icon: Brain,
  },
  {
    label: "Performance",
    href: "/performance",
    icon: BarChart3,
  },
  {
    label: "Models",
    href: "/models",
    icon: Layers3,
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
  },
];

export default function Navbar() {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-purple-100 bg-white/90 p-5 backdrop-blur-xl">
      
      <Link
        href="/"
        className="mb-10 flex items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-xl">
          🪐
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            arXiv Explorer
          </h1>

          <p className="text-xs text-slate-500">
            Research made simple
          </p>
        </div>
      </Link>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-purple-50 hover:text-purple-700"
            >
              <Icon size={18} />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-purple-50 p-4 text-center">
        <p className="text-sm font-semibold text-purple-900">
          Happy Researching! 💜
        </p>

        <p className="mt-1 text-xs text-purple-600">
          Explore. Classify. Discover.
        </p>
      </div>
    </aside>
  );
}