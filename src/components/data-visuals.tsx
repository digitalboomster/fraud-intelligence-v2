"use client";

import {
  Bar,
  BarChart,
  Cell,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type SignalBarItem = {
  label: string;
  value: number;
};

function SignalTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: SignalBarItem }>;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const point = payload[0]?.payload as SignalBarItem | undefined;
  if (!point) {
    return null;
  }

  return (
    <div className="signalTooltip">
      <strong>{point.label}</strong>
      <span>{point.value}% weighted signal</span>
    </div>
  );
}

export function SignalBarVisual({ items }: { items: SignalBarItem[] }) {
  return (
    <div className="signalBarVisual">
      <ResponsiveContainer width="100%" height={220} minWidth={220} minHeight={220}>
        <BarChart data={items} margin={{ top: 10, right: 0, left: 0, bottom: 20 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: "#bfbbb5", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            content={<SignalTooltip />}
          />
          <Bar dataKey="value" radius={[6, 6, 3, 3]} maxBarSize={44}>
            {items.map((item, index) => (
              <Cell
                key={`${item.label}-${index}`}
                fill={index % 2 === 1 ? "rgba(255, 179, 172, 0.55)" : "rgba(182, 196, 255, 0.52)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RadialRiskVisual({
  value,
  label,
  size = 170,
  accent = "#ffb3ac",
  decimals = 0,
}: {
  value: number;
  label: string;
  size?: number;
  accent?: string;
  decimals?: number;
}) {
  const normalized = Math.max(0, Math.min(100, value));
  const data = [{ name: label, value: normalized, fill: accent }];

  return (
    <div className="radialWrap" style={{ width: size, height: size }}>
      <RadialBarChart
        width={size}
        height={size}
        cx="50%"
        cy="50%"
        innerRadius="74%"
        outerRadius="100%"
        barSize={14}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <RadialBar background dataKey="value" cornerRadius={8} />
      </RadialBarChart>
      <div className="radialCenter">
        <strong>{normalized.toFixed(decimals)}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
