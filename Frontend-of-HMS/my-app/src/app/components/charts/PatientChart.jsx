"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0F1C19]/90 p-3 shadow-2xl backdrop-blur-sm">
        <p className="mb-1 text-xs font-semibold text-[#A8C5BE]">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: <span>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PatientChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="month"
          tick={{ fill: "#6B8C84", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6B8C84", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#A8C5BE", paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="newPatients"
          name="New Patients"
          stroke="#0F766E"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#0F766E", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="discharged"
          name="Discharged"
          stroke="#F59E0B"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#F59E0B", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
