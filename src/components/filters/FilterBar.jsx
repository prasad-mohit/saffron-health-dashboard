import React from "react";
import {
  Mars,
  Venus,
  Filter,
  Activity,
  Pizza,
  Car,
  Wallet,
} from "lucide-react";

export default function FilterBar({ filters, setFilters, theme }) {
  const toggle = (category, value) => {
    setFilters((prev) => {
      const arr = prev[category] || [];
      return arr.includes(value)
        ? { ...prev, [category]: arr.filter((v) => v !== value) }
        : { ...prev, [category]: [...arr, value] };
    });
  };

  const Chip = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 rounded-full text-xs font-medium transition-all border
        ${
          active
            ? "bg-[#5D4281] text-white border-[#7A3476]"
            : `${theme.panelBg} ${theme.textPrimary} border-gray-300 hover:bg-gray-100`
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <div
      className={`
        mt-10 p-5 rounded-2xl border shadow-sm
        ${theme.panelBg} ${theme.panelText} border-gray-200
      `}
    >
      <div className={`flex items-center gap-2 mb-4 ${theme.textPrimary}`}>
        <Filter size={16} />
        <p className="font-semibold">Filters</p>
      </div>

      {/* GENDER */}
      <div className="mb-3">
        <p className={`text-xs mb-2 ${theme.textPrimary}`}>Gender</p>
        <div className="flex gap-2">
          <Chip
            active={filters.gender.includes("Male")}
            onClick={() => toggle("gender", "Male")}
          >
            <Mars size={14} /> Male
          </Chip>

          <Chip
            active={filters.gender.includes("Female")}
            onClick={() => toggle("gender", "Female")}
          >
            <Venus size={14} /> Female
          </Chip>
        </div>
      </div>

      {/* AGE */}
      <div className="mb-3">
        <p className={`text-xs mb-2 ${theme.textPrimary}`}>Age Cohorts</p>
        <div className="flex gap-2 flex-wrap">
          {["18-34", "35-49", "50-64", "65+"].map((a) => (
            <Chip
              key={a}
              active={filters.age.includes(a)}
              onClick={() => toggle("age", a)}
            >
              {a}
            </Chip>
          ))}
        </div>
      </div>

      {/* RISK */}
      <div className="mb-3">
        <p className={`text-xs mb-2 ${theme.textPrimary}`}>Risk Segment</p>
        <div className="flex gap-2 flex-wrap">
          {["Very High", "High", "Medium", "Low"].map((r) => (
            <Chip
              key={r}
              active={filters.risk.includes(r)}
              onClick={() => toggle("risk", r)}
            >
              <Activity size={12} /> {r}
            </Chip>
          ))}
        </div>
      </div>

      {/* SDOH */}
      <div className="mb-3">
        <p className={`text-xs mb-2 ${theme.textPrimary}`}>SDoH Flags</p>
        <div className="flex gap-2 flex-wrap">
          <Chip
            active={filters.sdoh.includes("Food")}
            onClick={() => toggle("sdoh", "Food")}
          >
            <Pizza size={12} /> Food
          </Chip>

          <Chip
            active={filters.sdoh.includes("Transportation")}
            onClick={() => toggle("sdoh", "Transportation")}
          >
            <Car size={12} /> Transport
          </Chip>

          <Chip
            active={filters.sdoh.includes("Financial")}
            onClick={() => toggle("sdoh", "Financial")}
          >
            <Wallet size={12} /> Financial
          </Chip>
        </div>
      </div>
    </div>
  );
}
