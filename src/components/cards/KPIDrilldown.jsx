import React from "react";
import {
  Mars,
  Venus,
  AlertTriangle,
  Activity,
  MapPin,
} from "lucide-react";

function getAgeBucket(age) {
  if (age == null) return "Unknown";
  if (age < 35) return "18–34";
  if (age < 50) return "35–49";
  if (age < 65) return "50–64";
  return "65+";
}

export default function KPIDrilldown({ type, patients, theme }) {
  if (!type || !patients || patients.length === 0) return null;

  const total = patients.length;

  const male = patients.filter((p) => p.gender === "Male").length;
  const female = patients.filter((p) => p.gender === "Female").length;

  const ageBuckets = patients.reduce((acc, p) => {
    const b = getAgeBucket(p.age);
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});

  const anySdoh = patients.filter((p) => (p.sdohFlags || []).length > 0).length;

  return (
    <div
      className={`
        mt-6 p-6 rounded-2xl shadow-lg
        ${theme.panelBg} ${theme.panelText}
        border border-black/10
      `}
    >
      {type === "totalMembers" && (
        <>
          <h3 className={`text-xl font-semibold mb-4 ${theme.textPrimary}`}>
            Population Breakdown
          </h3>

          {/* Gender */}
          <div>
            <p className={`text-sm mb-2 ${theme.textPrimary}`}>Gender</p>
            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: "#E1E8F5" }}
              >
                <Mars className="w-6 h-6 text-blue-700" />
                <p className="text-xl font-bold mt-1">{male}</p>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: "#F2DDE3" }}
              >
                <Venus className="w-6 h-6 text-pink-700" />
                <p className="text-xl font-bold mt-1">{female}</p>
              </div>
            </div>
          </div>

          {/* Age cohorts */}
          <div className="mt-6">
            <p className={`text-sm mb-2 ${theme.textPrimary}`}>Age Cohorts</p>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ageBuckets).map(([bucket, count]) => (
                <div
                  key={bucket}
                  className="flex justify-between px-3 py-2 rounded-lg bg-gray-100 border border-gray-200"
                >
                  <span className={theme.textPrimary}>{bucket}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SDoH */}
          <div className="mt-6">
            <p className={`text-sm mb-1 ${theme.textPrimary}`}>SDoH Flags</p>
            <p className="font-semibold">
              {anySdoh} / {total}
            </p>
          </div>
        </>
      )}

      {/* NOTE: other KPI types can be added back similarly */}
    </div>
  );
}
