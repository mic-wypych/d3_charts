import { scaleLinear, max, line as d3line } from "d3";
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

export function GlobalLinePlot({ yearRange, selectedTypes }:
  { yearRange: [number,number]; selectedTypes: string[] }) {
  const W = 460, H = 260, bW = W - M.left - M.right, bH = H - M.top - M.bottom;
  const world = useMemo(() =>
    _data.filter(d => d.country === "World" && d.year >= yearRange[0] && d.year <= yearRange[1]),
    [yearRange]);
  const scaleX = scaleLinear().domain(yearRange).range([0, bW]);
  const maxVal = max(selectedTypes.flatMap(t => world.map(d => d[t as keyof EnergyRow] as number))) ?? 0;
  const scaleY = scaleLinear().domain([0, maxVal * 1.05]).range([bH, 0]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
      <g transform={`translate(${M.left},${M.top})`}>
        <line y2={bH} stroke="#aaa"/><line x2={bW} y1={bH} y2={bH} stroke="#aaa"/>
        {scaleX.ticks(6).map(t => (
          <g key={t} transform={`translate(${scaleX(t)},0)`}>
            <line y1={0} y2={bH} stroke="#eee"/>
            <text y={bH+16} textAnchor="middle" fontSize={10}>{t}</text>
          </g>
        ))}
        {scaleY.ticks(5).map(t => (
          <g key={t} transform={`translate(0,${scaleY(t)})`}>
            <line x2={bW} stroke="#eee"/>
            <text x={-6} textAnchor="end" dominantBaseline="middle" fontSize={10}>{Math.round(t)}</text>
          </g>
        ))}
        {selectedTypes.map(t => {
          const pathD = d3line<EnergyRow>().x(d => scaleX(d.year)).y(d => scaleY(d[t as keyof EnergyRow] as number))(world);
          return <path key={t} d={pathD ?? ""} fill="none" stroke={TYPE_COLORS[t]} strokeWidth={2}/>;
        })}
      </g>
    </svg>
  );
}

