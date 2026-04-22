import { scaleLinear, scaleBand, max, line as d3line } from "d3";
import { useMemo } from "react";
import { EnergyData } from "./EnergyData";

interface EnergyRow {
  country: string; year: number; primary_energy: number;
  coal: number; oil: number; gas: number; nuclear: number;
  hydro: number; solar: number; wind: number; biofuel: number;
  other_renewable: number;
}

const _data = EnergyData as EnergyRow[];
const TYPE_COLORS: Record<string,string> = {
  coal:"#4a4a4a", oil:"#8B4513", gas:"#FF8C00", nuclear:"#9B59B6",
  hydro:"#3498DB", solar:"#F1C40F", wind:"#2ECC71",
  biofuel:"#27AE60", other_renewable:"#1ABC9C",
};

export function CountryPanel({ yearRange, selectedTypes, selectedCountries }:
  { yearRange:[number,number]; selectedTypes:string[]; selectedCountries:string[] }) {
  const ML=90, MR=8, MT=8, BAR_W=360, SPARK_W=300, GAP=20;
  const BW = BAR_W-ML-MR, SW = SPARK_W-MR;
  const BAND_H = 58, AXIS_H = 16;
  const bH = Math.max(selectedCountries.length * BAND_H, 1);
  const TOTAL_W = ML + BW + MR + GAP + SW + MR;

  const countryTotals = useMemo(() =>
    selectedCountries.map(country => {
      const rows = _data.filter(d => d.country===country && d.year>=yearRange[0] && d.year<=yearRange[1]);
      const totals: Record<string,number> = {};
      for (const t of selectedTypes) totals[t] = rows.reduce((s,d) => s+(d[t as keyof EnergyRow] as number), 0);
      return { country, totals, total: selectedTypes.reduce((s,t) => s+(totals[t]||0), 0) };
    }), [yearRange, selectedTypes, selectedCountries]);

  const countryRows = useMemo(() =>
    selectedCountries.map(country => ({
      country,
      rows: _data.filter(d => d.country===country && d.year>=yearRange[0] && d.year<=yearRange[1]),
    })), [yearRange, selectedCountries]);

  const maxTotal = max(countryTotals, d => d.total) ?? 1;
  const scaleX = scaleLinear().domain([0, maxTotal]).range([0, BW]);
  const scaleY = scaleBand().domain(selectedCountries).range([0, bH]).padding(0.15);
  const bw = scaleY.bandwidth();
  const scaleSparkX = scaleLinear().domain(yearRange).range([0, SW]);

  if (!selectedCountries.length)
    return <p style={{color:"#888",margin:"1rem 0"}}>Select countries above to see country breakdown.</p>;

  return (
    <svg viewBox={`0 0 ${TOTAL_W} ${bH + MT}`} style={{width:"100%", overflow:"visible"}}>
      <g transform={`translate(${ML},${MT})`}>
        {countryTotals.map(({ country, totals }) => {
          let xOff = 0;
          return (
            <g key={country} transform={`translate(0,${scaleY(country) ?? 0})`}>
              <text x={-6} y={bw/2} textAnchor="end" dominantBaseline="middle" fontSize={10}>{country}</text>
              {selectedTypes.map(t => {
                const w = scaleX(totals[t]||0);
                const seg = <rect key={t} x={xOff} width={w} height={bw} fill={TYPE_COLORS[t]} opacity={0.85}/>;
                xOff += w;
                return seg;
              })}
            </g>
          );
        })}
      </g>
      <g transform={`translate(${ML+BW+MR+GAP},${MT})`}>
        {countryRows.map(({ country, rows }) => {
          const maxVal = max(selectedTypes.flatMap(t => rows.map(d => d[t as keyof EnergyRow] as number))) ?? 1;
          const plotH = bw - AXIS_H;
          const scaleSparkY = scaleLinear().domain([0, maxVal*1.05]).range([plotH, 0]);
          return (
            <g key={country} transform={`translate(0,${scaleY(country) ?? 0})`}>
              <rect width={SW} height={bw} fill="#f5f5f5" rx={2}/>
              {selectedTypes.map(t => {
                const pathD = d3line<EnergyRow>()
                  .x(d => scaleSparkX(d.year))
                  .y(d => scaleSparkY(d[t as keyof EnergyRow] as number))(rows);
                return <path key={t} d={pathD??""} fill="none" stroke={TYPE_COLORS[t]} strokeWidth={1.5}/>;
              })}
              {scaleSparkX.ticks(4).map(yr => (
                <g key={yr} transform={`translate(${scaleSparkX(yr)},${plotH})`}>
                  <line y2={4} stroke="#aaa"/>
                  <text y={13} textAnchor="middle" fontSize={8} fill="#666">{yr}</text>
                </g>
              ))}
              <line x2={SW} y1={plotH} y2={plotH} stroke="#aaa"/>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

