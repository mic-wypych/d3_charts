import { scaleLinear, scaleBand, max } from "d3";
import { useMemo } from "react";
import { EnergyData } from "./EnergyData";

interface EnergyRow {
  country: string; year: number; primary_energy: number;
  coal: number; oil: number; gas: number; nuclear: number;
  hydro: number; solar: number; wind: number; biofuel: number;
  other_renewable: number;
}

const _data = EnergyData as EnergyRow[];
const M = { top: 24, right: 16, bottom: 36, left: 52 };
const TYPE_COLORS: Record<string,string> = {
  coal:"#4a4a4a", oil:"#8B4513", gas:"#FF8C00", nuclear:"#9B59B6",
  hydro:"#3498DB", solar:"#F1C40F", wind:"#2ECC71",
  biofuel:"#27AE60", other_renewable:"#1ABC9C",
};

export function GlobalTotalBar({ yearRange, selectedTypes }:
  { yearRange: [number,number]; selectedTypes: string[] }) {
  const W = 400, H = 260, bW = W - M.left - M.right, bH = H - M.top - M.bottom;
  const world = useMemo(() =>
    _data.filter(d => d.country === "World" && d.year >= yearRange[0] && d.year <= yearRange[1]),
    [yearRange]);
  const totals = useMemo(() =>
    selectedTypes.map(t => ({ type: t, value: world.reduce((s,d) => s+(d[t as keyof EnergyRow] as number), 0) })),
    [world, selectedTypes]);
  const scaleX = scaleBand().domain(selectedTypes).range([0, bW]).padding(0.2);
  const maxVal = max(totals, d => d.value) ?? 1;
  const scaleY = scaleLinear().domain([0, maxVal * 1.05]).range([bH, 0]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
      <g transform={`translate(${M.left},${M.top})`}>
        <line y2={bH} stroke="#aaa"/><line x2={bW} y1={bH} y2={bH} stroke="#aaa"/>
        {scaleY.ticks(5).map(t => (
          <g key={t} transform={`translate(0,${scaleY(t)})`}>
            <line x2={bW} stroke="#eee"/>
            <text x={-6} textAnchor="end" dominantBaseline="middle" fontSize={10}>{Math.round(t)}</text>
          </g>
        ))}
        {totals.map(({ type, value }) => (
          <g key={type} transform={`translate(${scaleX(type) ?? 0},0)`}>
            <rect y={scaleY(value)} width={scaleX.bandwidth()} height={bH - scaleY(value)} fill={TYPE_COLORS[type]} opacity={0.85}/>
            <text y={bH+16} x={scaleX.bandwidth()/2} textAnchor="middle" fontSize={9}>{type}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

