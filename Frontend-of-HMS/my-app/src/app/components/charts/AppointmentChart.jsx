"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
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

export default function AppointmentChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: "#6B8C84", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6B8C84", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(15,118,110,0.08)" }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#A8C5BE", paddingTop: 8 }} />
        <Bar dataKey="scheduled" name="Scheduled" fill="#0F766E" radius={[4, 4, 0, 0]} maxBarSize={24} />
        <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={24} />
        <Bar dataKey="cancelled" name="Cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
