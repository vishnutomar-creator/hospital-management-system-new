"use client";

import {
  AreaChart,
  Area,
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
            {entry.name}:{" "}
            <span>₹{Number(entry.value).toLocaleString("en-IN")}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "#A8C5BE", paddingTop: 8 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#0F766E"
          strokeWidth={2.5}
          fill="url(#revGrad)"
          dot={false}
          activeDot={{ r: 5, fill: "#0F766E" }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          name="Expenses"
          stroke="#7C3AED"
          strokeWidth={2.5}
          fill="url(#expGrad)"
          dot={false}
          activeDot={{ r: 5, fill: "#7C3AED" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
