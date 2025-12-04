import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { THEME_OPTIONS, THEMES } from "@/theme/themes";

export default function Layout({ children, theme, themeKey, setThemeKey }) {
  const t = theme || THEMES[themeKey];

  return (
    <div className={`${t.appBg} min-h-screen flex`}>
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col w-72 px-6 py-6 ${t.sidebarBg} ${t.sidebarText}`}
      >
        <Sidebar theme={t} />
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header
          className={`flex items-center justify-between px-8 py-4 shadow-md ${t.navBg} ${t.textInverse}`}
        >
          <div>
            <h1 className="text-xl font-semibold">SaffronHealth.AI</h1>
            <p className="text-xs opacity-80">Population Health Analytics</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="opacity-80">Theme:</span>
            <select
              value={themeKey}
              onChange={(e) => setThemeKey(e.target.value)}
              className="px-2 py-1 rounded-md bg-white/20 border border-white/30"
            >
              {THEME_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 px-10 py-8 ${t.contentBg}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
