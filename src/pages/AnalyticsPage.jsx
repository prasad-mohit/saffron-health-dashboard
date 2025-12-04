// src/pages/AnalyticsPage.jsx
import React, { useMemo, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import usePatients from "@/lib/usePatients";
import MemberDetailPanel from "@/components/members/MemberDetailPanel";
import { motion } from "framer-motion";
import { THEME_OPTIONS, THEMES } from "@/theme/themes";
import { PlusCircle, Save } from "lucide-react";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* -------------------------
   Utility helpers
   ------------------------- */
const ageBucket = (age) => {
  if (age == null) return "Unknown";
  if (age < 35) return "18-34";
  if (age < 50) return "35-49";
  if (age < 65) return "50-64";
  return "65+";
};

const countBy = (arr = [], keyFn) => {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
};

const avg = (arr = []) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0);

const sum = (arr = []) => arr.reduce((s, v) => s + v, 0);

/* pivot engine: rowsKeyFn, colsKeyFn, measureFn (returns numeric) */
function pivotMatrix(items, rowFn, colFn, measureFn, aggregator = "sum") {
  const matrix = {};
  const rowKeys = new Set();
  const colKeys = new Set();

  items.forEach((it) => {
    const r = rowFn(it);
    const c = colFn(it);
    rowKeys.add(r);
    colKeys.add(c);

    matrix[r] = matrix[r] || {};
    matrix[r][c] = matrix[r][c] || [];

    matrix[r][c].push(measureFn(it));
  });

  // aggregate
  const rows = Array.from(rowKeys).sort();
  const cols = Array.from(colKeys).sort();

  const values = rows.map((r) =>
    cols.map((c) => {
      const arr = (matrix[r] && matrix[r][c]) || [];
      if (aggregator === "avg") return arr.length ? avg(arr) : 0;
      if (aggregator === "count") return arr.length;
      return sum(arr);
    })
  );

  return { rows, cols, values };
}

/* bucketize numeric cost into ranges */
const costBucket = (v) => {
  if (v == null || isNaN(v)) return "Unknown";
  if (v <= 10000) return "0-10k";
  if (v <= 50000) return "10k-50k";
  return ">50k";
};

/* -------------------------
   Small subcomponents: KPI bar, Filters, Cohort list
   ------------------------- */

function KPIBar({ theme, metrics }) {
  // metrics: [{label, value, subtitle}]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`p-4 rounded-xl border ${theme.panelBg} ${theme.panelText} border-gray-200`}
        >
          <div className="text-xs opacity-70">{m.label}</div>
          <div className={`text-2xl font-bold mt-2 ${theme.textPrimary}`}>{m.value}</div>
          {m.subtitle && <div className="text-xs opacity-70 mt-1">{m.subtitle}</div>}
        </div>
      ))}
    </div>
  );
}

function FiltersPanel({ filters, setFilters, patients, theme }) {
  const allLocations = useMemo(
    () => Array.from(new Set(patients.map((p) => p.location).filter(Boolean))).sort(),
    [patients]
  );
  const allConditions = useMemo(
    () =>
      Array.from(
        new Set((patients.flatMap((p) => p.primaryConditions || []) || []).filter(Boolean))
      ).sort(),
    [patients]
  );

  const toggle = (key, v) =>
    setFilters((prev) => ({ ...prev, [key]: prev[key].includes(v) ? prev[key].filter((x) => x !== v) : [...prev[key], v] }));

  return (
    <div className={`p-4 rounded-xl ${theme.panelBg} ${theme.panelText} border border-gray-200`}>
      <h3 className={`font-semibold mb-3 ${theme.textPrimary}`}>Slicers</h3>

      <div className="mb-3">
        <div className={`text-xs mb-2 ${theme.textPrimary}`}>Age buckets</div>
        <div className="flex gap-2 flex-wrap">
          {["18-34", "35-49", "50-64", "65+"].map((b) => (
            <button
              key={b}
              onClick={() => toggle("ageBuckets", b)}
              className={`px-3 py-1 rounded-full text-xs ${filters.ageBuckets.includes(b) ? "bg-[#5D4281] text-white" : "bg-white/5"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className={`text-xs mb-2 ${theme.textPrimary}`}>Gender</div>
        <div className="flex gap-2">
          {["Male", "Female"].map((g) => (
            <button
              key={g}
              onClick={() => toggle("gender", g)}
              className={`px-3 py-1 rounded-full text-xs ${filters.gender.includes(g) ? "bg-[#5D4281] text-white" : "bg-white/5"}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className={`text-xs mb-2 ${theme.textPrimary}`}>Risk segment</div>
        <div className="flex gap-2 flex-wrap">
          {["Very High", "High", "Medium", "Low"].map((r) => (
            <button
              key={r}
              onClick={() => toggle("risk", r)}
              className={`px-3 py-1 rounded-full text-xs ${filters.risk.includes(r) ? "bg-[#BB4272] text-white" : "bg-white/5"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className={`text-xs mb-2 ${theme.textPrimary}`}>Conditions</div>
        <div className="flex gap-2 flex-wrap max-h-28 overflow-auto p-1">
          {allConditions.map((c) => (
            <button
              key={c}
              onClick={() => toggle("conditions", c)}
              className={`px-3 py-1 rounded-full text-xs ${filters.conditions.includes(c) ? "bg-[#7A3476] text-white" : "bg-white/5"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className={`text-xs mb-2 ${theme.textPrimary}`}>Location</div>
        <select
          value={filters.location}
          onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
          className="w-full px-2 py-1 rounded-md bg-white/5"
        >
          <option value="">All</option>
          {allLocations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() =>
            setFilters({
              ageBuckets: [],
              gender: [],
              risk: [],
              conditions: [],
              location: "",
              costBucket: [],
            })
          }
          className="px-3 py-1 rounded-md bg-white/5 text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

/* -------------------------
   Main Analytics Page
   ------------------------- */

export default function AnalyticsPage({ themeKey = "saffronPurple", setPageTheme }) {
  const theme = THEMES[themeKey] || THEMES.saffronPurple;
  const { patients = [], loading } = usePatients("patient.json");

  const [filters, setFilters] = useState({
    ageBuckets: [],
    gender: [],
    risk: [],
    conditions: [],
    location: "",
    costBucket: [],
  });

  const [selectedMember, setSelectedMember] = useState(null);
  const [savedCohorts, setSavedCohorts] = useState([]);
  const [pivotConfig, setPivotConfig] = useState({
    rows: "primaryCondition", // choices: primaryCondition / ageBucket / riskSegment / location / sdoh
    cols: "riskSegment",
    measure: "count", // count | avgCost | sumCost | avgRisk
    aggregator: "count",
  });

  // apply filters
  const filtered = useMemo(() => {
    if (!patients) return [];
    return patients.filter((p) => {
      if (filters.location && p.location !== filters.location) return false;
      if (filters.gender.length && !filters.gender.includes(p.gender)) return false;
      if (filters.risk.length && !filters.risk.includes(p.riskSegment)) return false;
      if (filters.ageBuckets.length && !filters.ageBuckets.includes(ageBucket(p.age))) return false;
      if (filters.conditions.length) {
        const has = (p.primaryConditions || []).some((c) => filters.conditions.includes(c));
        if (!has) return false;
      }
      return true;
    });
  }, [patients, filters]);

  // KPI metrics
  const metrics = useMemo(() => {
    const total = filtered.length;
    const veryHigh = filtered.filter((p) => p.riskSegment === "Very High").length;
    const avgRisk = (filtered.length && (filtered.reduce((s, p) => s + (p.riskScore || 0), 0) / filtered.length).toFixed(2)) || 0;
    const avg12m = Math.round((filtered.length && avg(filtered.map((p) => p.future12mCost || 0))) || 0);
    const sdohPct =
      filtered.length && Math.round((filtered.filter((p) => (p.sdohFlags || []).length > 0).length / filtered.length) * 100);
    return [
      { label: "Total Members", value: total },
      { label: "Very High Risk", value: veryHigh },
      { label: "Avg Risk Score", value: avgRisk },
      { label: "Avg 12m Cost", value: `$${avg12m.toLocaleString()}` },
      { label: "% with SDoH", value: sdohPct + "%" },
    ];
  }, [filtered]);

  // charts: risk distribution
  const riskCounts = useMemo(() => countBy(filtered, (p) => p.riskSegment || "Unknown"), [filtered]);
  const riskPieData = useMemo(() => {
    const labels = Object.keys(riskCounts);
    const data = labels.map((l) => riskCounts[l]);
    return {
      labels,
      datasets: [{ data, backgroundColor: ["#BB4272", "#F29934", "#5D4281", "#9CA3AF"] }],
    };
  }, [riskCounts]);

  // cost histogram buckets
  const costCounts = useMemo(() => countBy(filtered, (p) => costBucket(p.future12mCost || 0)), [filtered]);
  const costBarData = useMemo(() => {
    const labels = ["0-10k", "10k-50k", ">50k", "Unknown"];
    const data = labels.map((l) => costCounts[l] || 0);
    return {
      labels,
      datasets: [{ label: "Members", data, backgroundColor: "#7A3476" }],
    };
  }, [costCounts]);

  // condition prevalence
  const condCounts = useMemo(() => {
    const flat = filtered.flatMap((p) => p.primaryConditions || []);
    return countBy(flat, (c) => c || "Unknown");
  }, [filtered]);
  const condBarData = useMemo(() => {
    const labels = Object.keys(condCounts).slice(0, 8);
    const data = labels.map((l) => condCounts[l]);
    return { labels, datasets: [{ label: "Members", data, backgroundColor: "#5D4281" }] };
  }, [condCounts]);

  // age x risk heatmap via matrix values (counts)
  const ageRiskPivot = useMemo(() => {
    const items = filtered;
    const { rows, cols, values } = pivotMatrix(
      items,
      (p) => ageBucket(p.age),
      (p) => p.riskSegment || "Unknown",
      () => 1,
      "count"
    );
    return { rows, cols, values };
  }, [filtered]);

  // Pivot explorer engine
  const pivotResult = useMemo(() => {
    const rowFn = (p) => {
      if (pivotConfig.rows === "ageBucket") return ageBucket(p.age);
      if (pivotConfig.rows === "riskSegment") return p.riskSegment || "Unknown";
      if (pivotConfig.rows === "location") return p.location || "Unknown";
      if (pivotConfig.rows === "primaryCondition") return (p.primaryConditions?.[0]) || "None";
      return "Unknown";
    };
    const colFn = (p) => {
      if (pivotConfig.cols === "ageBucket") return ageBucket(p.age);
      if (pivotConfig.cols === "riskSegment") return p.riskSegment || "Unknown";
      if (pivotConfig.cols === "location") return p.location || "Unknown";
      if (pivotConfig.cols === "primaryCondition") return (p.primaryConditions?.[0]) || "None";
      return "Unknown";
    };

    const measureFn = (p) => {
      if (pivotConfig.measure === "count") return 1;
      if (pivotConfig.measure === "sumCost") return p.future12mCost || 0;
      if (pivotConfig.measure === "avgCost") return p.future12mCost || 0;
      if (pivotConfig.measure === "avgRisk") return p.riskScore || 0;
      return 1;
    };

    const aggregator = pivotConfig.measure === "avgCost" || pivotConfig.measure === "avgRisk" ? "avg" : pivotConfig.measure === "count" ? "count" : "sum";

    return pivotMatrix(filtered, rowFn, colFn, measureFn, aggregator);
  }, [filtered, pivotConfig, ageBucket]);

  // cohort builder
  const createCohort = (name) => {
    const snapshot = { name, filters: { ...filters }, count: filtered.length, createdAt: new Date().toISOString() };
    setSavedCohorts((s) => [snapshot, ...s]);
  };

  if (loading) return <div className={`p-6 ${theme.panelText}`}>Loading...</div>;

  return (
    <div className={`flex gap-6 p-6`}>
      {/* Left: Filters */}
      <div style={{ width: 320 }}>
        <FiltersPanel filters={filters} setFilters={setFilters} patients={patients} theme={theme} />

        {/* Cohorts */}
        <div className={`mt-6 p-4 rounded-xl ${theme.panelBg} ${theme.panelText} border border-gray-200`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`${theme.textPrimary} font-semibold`}>Cohorts</div>
            <button
              onClick={() => createCohort(`Cohort ${savedCohorts.length + 1}`)}
              className="text-xs px-2 py-1 rounded-md bg-white/5 flex items-center gap-2"
            >
              <PlusCircle size={14} /> Save
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-auto">
            {savedCohorts.length === 0 && <div className="text-xs opacity-70">No saved cohorts</div>}
            {savedCohorts.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-white/5">
                <div>
                  <div className={`${theme.textPrimary} font-medium`}>{c.name}</div>
                  <div className="text-xs opacity-70">{c.count} members</div>
                </div>
                <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Analytics */}
      <div className="flex-1">
        {/* Theme selector row (optional) */}
        <div className="flex items-center justify-between mb-4">
          <div className={`text-lg font-semibold ${theme.textPrimary}`}>Analytics Studio</div>

          <div className="flex items-center gap-2">
            <select
              value={themeKey}
              onChange={(e) => {
                const key = e.target.value;
                if (setPageTheme) setPageTheme(key);
              }}
              className="px-2 py-1 rounded-md bg-white/5"
            >
              {THEME_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Bar */}
        <KPIBar theme={theme} metrics={metrics} />

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className={`col-span-1 p-4 rounded-xl ${theme.panelBg} ${theme.panelText} border border-gray-200`}>
            <div className={`text-sm font-semibold mb-2 ${theme.textPrimary}`}>Risk Distribution</div>
            <Pie data={riskPieData} />
          </div>

          <div className={`col-span-1 p-4 rounded-xl ${theme.panelBg} ${theme.panelText} border border-gray-200`}>
            <div className={`text-sm font-semibold mb-2 ${theme.textPrimary}`}>12m Cost Buckets</div>
            <Bar data={costBarData} />
          </div>

          <div className={`col-span-1 p-4 rounded-xl ${theme.panelBg} ${theme.panelText} border border-gray-200`}>
            <div className={`text-sm font-semibold mb-2 ${theme.textPrimary}`}>Top Conditions</div>
            <Bar data={condBarData} />
          </div>
        </div>

        {/* Heatmap (Age x Risk) */}
        <div className={`mb-6 p-4 rounded-xl ${theme.panelBg} ${theme.panelText} border border-gray-200`}>
          <div className={`text-sm font-semibold mb-3 ${theme.textPrimary}`}>Age × Risk (counts)</div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-2"></th>
                  {ageRiskPivot.cols.map((c) => (
                    <th key={c} className="py-2 px-3 text-xs">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ageRiskPivot.rows.map((r, i) => (
                  <tr key={r}>
                    <td className="py-2 px-2 font-medium">{r}</td>
                    {ageRiskPivot.cols.map((c, j) => {
                      const v = ageRiskPivot.values[i]?.[j] || 0;
                      const intensity = Math.min(0.85, 0.08 + (v / (filtered.length || 1)) * 6);
                      return (
                        <td key={c} className="py-2 px-3">
                          <div style={{ background: `rgba(93,66,129,${intensity})`, padding: "8px", borderRadius: 6 }}>
                            <div className="text-xs font-semibold" style={{ color: intensity > 0.25 ? "#fff" : "#000" }}>{v}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pivot Explorer */}
        <div className={`p-4 rounded-xl ${theme.panelBg} ${theme.panelText} border border-gray-200 mb-6`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`font-semibold ${theme.textPrimary}`}>Pivot Explorer</div>
            <div className="flex items-center gap-2">
              <select
                value={pivotConfig.rows}
                onChange={(e) => setPivotConfig((p) => ({ ...p, rows: e.target.value }))}
                className="px-2 py-1 rounded-md bg-white/5"
              >
                <option value="primaryCondition">Primary Condition</option>
                <option value="ageBucket">Age Bucket</option>
                <option value="riskSegment">Risk Segment</option>
                <option value="location">Location</option>
              </select>

              <select
                value={pivotConfig.cols}
                onChange={(e) => setPivotConfig((p) => ({ ...p, cols: e.target.value }))}
                className="px-2 py-1 rounded-md bg-white/5"
              >
                <option value="riskSegment">Risk Segment</option>
                <option value="ageBucket">Age Bucket</option>
                <option value="location">Location</option>
                <option value="primaryCondition">Primary Condition</option>
              </select>

              <select
                value={pivotConfig.measure}
                onChange={(e) => setPivotConfig((p) => ({ ...p, measure: e.target.value }))}
                className="px-2 py-1 rounded-md bg-white/5"
              >
                <option value="count">Count</option>
                <option value="sumCost">Sum 12m Cost</option>
                <option value="avgCost">Avg 12m Cost</option>
                <option value="avgRisk">Avg Risk Score</option>
              </select>
            </div>
          </div>

          {/* Pivot Table rendering from pivotResult */}
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-2"></th>
                  {pivotResult.cols.map((c) => (
                    <th key={c} className="py-2 px-3">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pivotResult.rows.map((r, i) => (
                  <tr key={r}>
                    <td className="py-2 px-2 font-medium">{r}</td>
                    {pivotResult.cols.map((c, j) => (
                      <td key={c} className="py-2 px-3">
                        {Math.round(pivotResult.values[i]?.[j] ?? 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drillthrough: filtered member list */}
        <div className={`p-4 rounded-xl ${theme.panelBg} ${theme.panelText} border border-gray-200`}>
          <div className={`text-sm font-semibold mb-3 ${theme.textPrimary}`}>Drillthrough — members</div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left opacity-70">
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Age</th>
                  <th className="py-2 px-2">Risk</th>
                  <th className="py-2 px-2">12m Cost</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((p) => (
                  <tr key={p.id} onClick={() => setSelectedMember(p)} className="cursor-pointer hover:bg-white/5">
                    <td className="py-2 px-2">{p.name}</td>
                    <td className="py-2 px-2">{p.age}</td>
                    <td className="py-2 px-2">{p.riskSegment}</td>
                    <td className="py-2 px-2">${Number(p.future12mCost || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Member detail drawer */}
      {selectedMember && <MemberDetailPanel member={selectedMember} onClose={() => setSelectedMember(null)} theme={theme} />}
    </div>
  );
}
