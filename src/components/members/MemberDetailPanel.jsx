import React from "react";
import { X, MapPin, AlertTriangle, DollarSign } from "lucide-react";

export default function MemberDetailPanel({ member, onClose, theme }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
      <div
        className={`
          w-[420px] h-full overflow-y-auto p-6 shadow-2xl
          ${theme.panelBg} ${theme.panelText}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>
            {member.name}
          </h2>
          <button onClick={onClose}>
            <X className={`${theme.textPrimary} w-5 h-5`} />
          </button>
        </div>

        {/* Demographics */}
        <div
          className={`
            rounded-xl p-4 mb-6 border
            ${theme.panelBg} ${theme.panelText} border-gray-300
          `}
        >
          <p className="text-xs opacity-70">Age</p>
          <p className={`text-xl font-semibold ${theme.textPrimary}`}>
            {member.age}
          </p>

          <p className="text-xs opacity-70 mt-3">Location</p>
          <p className={`flex items-center gap-1 ${theme.textPrimary}`}>
            <MapPin size={14} />
            {member.location}
          </p>
        </div>

        {/* Risk Info */}
        <div
          className={`
            rounded-xl p-4 mb-6 border
            ${theme.panelBg} ${theme.panelText} border-gray-300
          `}
        >
          <p className="text-xs opacity-70">Risk Level</p>

          <p className="text-lg font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle />
            {member.riskSegment} ({(member.riskScore || 0).toFixed(2)})
          </p>
        </div>

        {/* Primary Conditions */}
        <div
          className={`
            rounded-xl p-4 mb-6 border
            ${theme.panelBg} ${theme.panelText} border-gray-300
          `}
        >
          <p className="text-sm font-semibold mb-2">Primary Conditions</p>
          <ul className="list-disc ml-5 space-y-1">
            {member.primaryConditions?.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        {/* SDoH */}
        <div
          className={`
            rounded-xl p-4 mb-6 border
            ${theme.panelBg} ${theme.panelText} border-gray-300
          `}
        >
          <p className="text-sm font-semibold mb-2">SDoH Flags</p>

          {member.sdohFlags?.length ? (
            <div className="flex gap-2 flex-wrap">
              {member.sdohFlags.map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-[#5D4281]/20 text-xs"
                >
                  {f}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs opacity-70">None</p>
          )}
        </div>

        {/* Costs */}
        <div
          className={`
            rounded-xl p-4 border
            ${theme.panelBg} ${theme.panelText} border-gray-300
          `}
        >
          <p className="text-sm font-semibold mb-2">Cost Breakdown</p>

          <ul className="space-y-1">
            <li>
              ED Cost:{" "}
              <span className="font-semibold text-emerald-600">
                ${member.predictedEdCost?.toLocaleString()}
              </span>
            </li>
            <li>
              IP Cost:{" "}
              <span className="font-semibold text-emerald-600">
                ${member.predictedInpatientCost?.toLocaleString()}
              </span>
            </li>
            <li>
              Surgery Cost:{" "}
              <span className="font-semibold text-emerald-600">
                ${member.predictedSurgeryCost?.toLocaleString()}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
