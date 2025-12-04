import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function MembersTable({ patients = [], onSelect, theme }) {
  const [sortKey, setSortKey] = useState("riskScore");
  const [sortDir, setSortDir] = useState("desc");

  const sortData = (data) =>
    [...data].sort((a, b) => {
      const v1 = a[sortKey] ?? 0;
      const v2 = b[sortKey] ?? 0;
      if (sortDir === "asc") return v1 > v2 ? 1 : -1;
      return v1 < v2 ? 1 : -1;
    });

  const sorted = sortData(patients);

  const headers = [
    ["name", "Name"],
    ["age", "Age"],
    ["gender", "Sex"],
    ["location", "Location"],
    ["riskSegment", "Risk Group"],
    ["riskScore", "Risk Score"],
    ["future12mCost", "12m Cost"],
  ];

  return (
    <div
      className={`
        mt-10 rounded-2xl p-6 border shadow-sm
        ${theme.panelBg} ${theme.panelText} border-gray-200
      `}
    >
      <h2 className={`text-xl font-bold mb-4 ${theme.textPrimary}`}>
        Members
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b border-gray-200 ${theme.textPrimary}`}>
              {headers.map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => {
                    if (sortKey === key)
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    else {
                      setSortKey(key);
                      setSortDir("desc");
                    }
                  }}
                  className="py-2 px-3 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortKey === key &&
                      (sortDir === "asc" ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={theme.textPrimary}>
            {sorted.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelect(p)}
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition"
              >
                <td className="py-2 px-3">{p.name}</td>
                <td className="py-2 px-3">{p.age}</td>
                <td className="py-2 px-3">{p.gender}</td>
                <td className="py-2 px-3">{p.location}</td>
                <td className="py-2 px-3">{p.riskSegment}</td>
                <td className="py-2 px-3 font-semibold">
                  {(p.riskScore || 0).toFixed(2)}
                </td>
                <td className="py-2 px-3 font-semibold text-emerald-600">
                  ${Number(p.future12mCost || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
