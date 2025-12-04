import React from "react";
import { motion } from "framer-motion";

export default function KPICard({
  title,
  value,
  icon: Icon,
  theme,
  kpiTheme,
  onClick,
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 240, damping: 16 }}
      className={`
        p-5 rounded-2xl cursor-pointer
        bg-gradient-to-br ${kpiTheme.bg}
        ${kpiTheme.glow}
        border border-white/10
        shadow-xl
      `}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/10">
          <Icon className={`w-8 h-8 ${kpiTheme.icon}`} />
        </div>

        <div>
          <p className={`text-sm ${theme.textInverse} opacity-90`}>{title}</p>
          <h3 className={`text-3xl font-bold ${theme.textInverse}`}>
            {value}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
