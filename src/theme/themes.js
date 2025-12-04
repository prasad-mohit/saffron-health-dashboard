export const THEMES = {
  saffronPurple: {
    key: "saffronPurple",
    label: "Saffron Purple",

    // Backgrounds
    appBg: "bg-[#F7F4FB]",
    contentBg: "bg-white",
    navBg: "bg-[#5D4281]",
    sidebarBg: "bg-[#7A3476]",

    // Text colors
    textPrimary: "text-[#2A1A34]",
    textInverse: "text-white",
    sidebarText: "text-white",
    panelText: "text-[#2A1A34]",
    panelBg: "bg-white",

    // Sidebar active
    sidebarActiveBg: "bg-[#5D4281]/70",

    // KPI
    kpi: {
      total: { icon: "text-white", bg: "from-[#5D4281] to-[#382845]", glow: "shadow-[#5D4281]/40" },
      high: { icon: "text-white", bg: "from-[#BB4272] to-[#7A3476]", glow: "shadow-[#BB4272]/40" },
      rising: { icon: "text-white", bg: "from-[#F29934] to-[#E7B339]", glow: "shadow-[#F29934]/40" },
      age:   { icon: "text-white", bg: "from-[#7A3476] to-[#5D4281]", glow: "shadow-[#7A3476]/40" },
    },
  },

  saffronGold: {
    key: "saffronGold",
    label: "Saffron Gold",

    appBg: "bg-[#FFF8E8]",
    contentBg: "bg-white",
    navBg: "bg-[#E7B339]",
    sidebarBg: "bg-[#F29934]",

    textPrimary: "text-black",
    textInverse: "text-black",
    sidebarText: "text-[#42234E]",
    panelText: "text-black",
    panelBg: "bg-white",

    sidebarActiveBg: "bg-[#E7B339]/70",

    kpi: {
      total:  { icon: "text-black", bg: "from-[#E7B339] to-[#F29934]", glow: "shadow-[#E7B339]/40" },
      high:   { icon: "text-white", bg: "from-[#BB4272] to-[#F06161]", glow: "shadow-[#F06161]/40" },
      rising: { icon: "text-black", bg: "from-[#FF8A69] to-[#E5B07C]", glow: "shadow-[#FF8A69]/40" },
      age:    { icon: "text-white", bg: "from-[#7A3476] to-[#E7B339]", glow: "shadow-[#7A3476]/40" },
    },
  },

  saffronRose: {
    key: "saffronRose",
    label: "Saffron Rose",

    appBg: "bg-[#FFF0F3]",
    contentBg: "bg-white",
    navBg: "bg-[#BB4272]",
    sidebarBg: "bg-[#F06161]",

    textPrimary: "text-[#2A1A34]",
    textInverse: "text-white",
    sidebarText: "text-[#42234E]",
    panelText: "text-[#2A1A34]",
    panelBg: "bg-white",

    sidebarActiveBg: "bg-[#BB4272]/70",

    kpi: {
      total:  { icon: "text-white", bg: "from-[#BB4272] to-[#F06161]", glow: "shadow-[#BB4272]/40" },
      high:   { icon: "text-white", bg: "from-[#F06161] to-[#FF8A69]", glow: "shadow-[#F06161]/40" },
      rising: { icon: "text-white", bg: "from-[#E5B07C] to-[#F29934]", glow: "shadow-[#E5B07C]/40" },
      age:    { icon: "text-white", bg: "from-[#7A3476] to-[#BB4272]", glow: "shadow-[#7A3476]/40" },
    },
  },

  light: {
    key: "light",
    label: "Light",

    appBg: "bg-gray-100",
    contentBg: "bg-white",
    navBg: "bg-white",
    sidebarBg: "bg-gray-200",

    textPrimary: "text-gray-900",
    textInverse: "text-white",
    sidebarText: "text-gray-900",
    panelText: "text-gray-900",
    panelBg: "bg-white",

    sidebarActiveBg: "bg-gray-300",

    kpi: {
      total:  { icon: "text-blue-700", bg: "from-blue-400 to-blue-600", glow: "shadow-blue-500/40" },
      high:   { icon: "text-red-700", bg: "from-red-400 to-red-600", glow: "shadow-red-500/40" },
      rising: { icon: "text-yellow-700", bg: "from-yellow-400 to-yellow-600", glow: "shadow-yellow-500/40" },
      age:    { icon: "text-purple-700", bg: "from-purple-400 to-purple-600", glow: "shadow-purple-500/40" },
    },
  },

  dark: {
    key: "dark",
    label: "Dark",

    appBg: "bg-slate-950",
    contentBg: "bg-slate-900",
    navBg: "bg-slate-900",
    sidebarBg: "bg-slate-900",

    textPrimary: "text-white",
    textInverse: "text-white",
    sidebarText: "text-white",
    panelText: "text-white",
    panelBg: "bg-slate-800",

    sidebarActiveBg: "bg-slate-700",

    kpi: {
      total:  { icon: "text-blue-300", bg: "from-blue-700 to-blue-900", glow: "shadow-blue-400/40" },
      high:   { icon: "text-red-300", bg: "from-red-700 to-red-900", glow: "shadow-red-400/40" },
      rising: { icon: "text-yellow-300", bg: "from-yellow-700 to-yellow-900", glow: "shadow-yellow-400/40" },
      age:    { icon: "text-purple-300", bg: "from-purple-700 to-purple-900", glow: "shadow-purple-400/40" },
    },
  },
};

export const THEME_OPTIONS = Object.values(THEMES).map((t) => ({
  key: t.key,
  label: t.label,
}));

export const DEFAULT_THEME_KEY = "saffronPurple";
