import React, { useState } from "react";
import Layout from "@/components/layout/Layout";

import KPICard from "@/components/cards/KPICard";
import KPIDrilldown from "@/components/cards/KPIDrilldown";
import MembersTable from "@/components/members/MembersTable";
import MemberDetailPanel from "@/components/members/MemberDetailPanel";
import FilterBar from "@/components/filters/FilterBar";

import usePatients from "@/lib/usePatients";

import { Users, Flame, TrendingUp, UserRound } from "lucide-react";
import { THEMES, DEFAULT_THEME_KEY } from "@/theme/themes";

// ----------- util functions -----------

function getAgeBucket(age) {
  if (!age && age !== 0) return "Unknown";
  if (age < 35) return "18-34";
  if (age < 50) return "35-49";
  if (age < 65) return "50-64";
  return "65+";
}

function applyFilters(patients, filters) {
  return patients.filter((p) => {
    if (filters.gender.length && !filters.gender.includes(p.gender)) return false;

    const bucket = getAgeBucket(p.age);
    if (filters.age.length && !filters.age.includes(bucket)) return false;

    if (filters.risk.length && !filters.risk.includes(p.rriskSegment)) return false;

    const sdoh = p.sdohFlags || [];
    if (filters.sdoh.length && !sdoh.some((f) => filters.sdoh.includes(f)))
      return false;

    const prim = (p.primaryConditions || []).map((c) => c.toLowerCase());
    if (
      filters.conditions.length &&
      !filters.conditions.some((cond) =>
        prim.some((pc) => pc.includes(cond.toLowerCase()))
      )
    ) {
      return false;
    }

    return true;
  });
}

// ---------------- MAIN APP ----------------

export default function App() {
  const { patients, loading, error } = usePatients("patient.json");

  const [activeKPI, setActiveKPI] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const [filters, setFilters] = useState({
    gender: [],
    age: [],
    risk: [],
    sdoh: [],
    conditions: [],
  });

  const [themeKey, setThemeKey] = useState(DEFAULT_THEME_KEY);
  const theme = THEMES[themeKey];

  const clickKPI = (kpi) => {
    setActiveKPI((prev) => (prev === kpi ? null : kpi));
  };

  if (loading) {
    return (
      <Layout theme={theme} themeKey={themeKey} setThemeKey={setThemeKey}>
        <p className={`${theme.textPrimary} text-lg`}>Loading patient data...</p>
      </Layout>
    );
  }

  if (error || !patients) {
    return (
      <Layout theme={theme} themeKey={themeKey} setThemeKey={setThemeKey}>
        <p className="text-red-500 text-lg">
          Error loading data: {error}
        </p>
      </Layout>
    );
  }

  const totalMembers = patients.length;
  const highRisk = patients.filter((p) => p.riskSegment === "Very High").length;
  const risingRisk = patients.filter((p) => p.riskSegment === "High").length;

  const avgAge = Math.round(
    patients.reduce((sum, p) => sum + (p.age || 0), 0) /
      (patients.length || 1)
  );

  const filteredPatients = applyFilters(patients, filters);

  return (
    <Layout theme={theme} themeKey={themeKey} setThemeKey={setThemeKey}>
      <h1 className={`text-3xl font-bold mb-6 ${theme.textPrimary}`}>
        Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Members"
          value={totalMembers}
          icon={Users}
          theme={theme}
          kpiTheme={theme.kpi.total}
          onClick={() => clickKPI("totalMembers")}
        />

        <KPICard
          title="High-Risk Members (Very High)"
          value={highRisk}
          icon={Flame}
          theme={theme}
          kpiTheme={theme.kpi.high}
          onClick={() => clickKPI("highRisk")}
        />

        <KPICard
          title="Rising Risk (High)"
          value={risingRisk}
          icon={TrendingUp}
          theme={theme}
          kpiTheme={theme.kpi.rising}
          onClick={() => clickKPI("risingRisk")}
        />

        <KPICard
          title="Average Age"
          value={avgAge}
          icon={UserRound}
          theme={theme}
          kpiTheme={theme.kpi.age}
          onClick={() => clickKPI("avgAge")}
        />
      </div>

      {/* KPI Drilldown */}
      {activeKPI && (
        <KPIDrilldown type={activeKPI} patients={patients} theme={theme} />
      )}

      {/* Filter Bar */}
      <FilterBar filters={filters} setFilters={setFilters} theme={theme} />

      {/* Member Table */}
      <MembersTable
        patients={filteredPatients}
        onSelect={setSelectedMember}
        theme={theme}
      />

      {/* Detail Panel */}
      {selectedMember && (
        <MemberDetailPanel
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          theme={theme}
        />
      )}
    </Layout>
  );
}
