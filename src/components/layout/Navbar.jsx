import React from "react";
import { Button } from "@/components/ui/button";

export default function Navbar({ theme }) {
  return (
    <nav
      className={`w-full flex items-center justify-between px-6 py-3 ${theme.navBg} ${theme.textInverse}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">SaffronHealth</span>
        <span className="text-lg font-semibold text-amber-400">.AI</span>
      </div>

      <div>
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/20"
        >
          Login
        </Button>
      </div>
    </nav>
  );
}
