import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Activity,
  PieChart,
  Settings,
} from "lucide-react";

export default function Sidebar({ theme }) {
  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },
    { name: "Members", icon: <Users size={18} />, path: "/members" },
    { name: "Risk Segments", icon: <Activity size={18} />, path: "/risk" },
    { name: "Analytics", icon: <PieChart size={18} />, path: "/analytics" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <img src="/saffron-logo-purple.png" alt="logo" className="h-10 w-auto" />
        <div>
          <h1 className={`font-semibold text-lg ${theme.sidebarText}`}>SaffronHealth.AI</h1>
          <p className={`text-xs ${theme.sidebarText} opacity-70`}>Analytics</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg transition-all
              ${theme.sidebarText}
              hover:bg-white/10 hover:translate-x-1
            `}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <p className={`text-xs opacity-60 ${theme.sidebarText}`}>© 2025 SaffronHealth</p>
      </div>
    </div>
  );
}
