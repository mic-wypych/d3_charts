import { scaleLinear, scaleBand, max, line as d3line } from "d3";
import { useMemo, useRef } from "react";
import { EnergyData } from "./EnergyData";
import { useDimensions } from "./hooks/useDimensions";


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


export const CountryPanel = ({  yearRange, selectedTypes, selectedCountries}: { yearRange:[number,number]; selectedTypes:string[]; selectedCountries:string[] }) => {
 const chartRef = useRef(null);
 const chartSize = useDimensions(chartRef)

 return(
  <div ref={chartRef} style={{width: "100%", height: 400}}>
    {chartSize.width > 0 && chartSize.height > 0 && (
      <CountryPanelMain
        height={chartSize.height}
        width={chartSize.width}
        yearRange={yearRange}
        selectedTypes={selectedTypes}
        selectedCountries={selectedCountries}
      />
    )}
  </div>
 )
}

export function CountryPanelMain({ yearRange, selectedTypes, selectedCountries, width }:
  { yearRange:[number,number]; selectedTypes:string[]; selectedCountries:string[]; width:number; height:number }) {
  const ML=90, MR=8, MT=8;
  const BW = width - ML - MR;
  const BAND_H = 58;
  const bH = Math.max(selectedCountries.length * BAND_H, 1);
  const TOTAL_W = ML + BW + MR;

  const countryTotals = useMemo(() =>
    selectedCountries.map(country => {
      const rows = _data.filter(d => d.country===country && d.year>=yearRange[0] && d.year<=yearRange[1]);
      const totals: Record<string,number> = {};
      for (const t of selectedTypes) totals[t] = rows.reduce((s,d) => s+(d[t as keyof EnergyRow] as number), 0);
      return { country, totals, total: selectedTypes.reduce((s,t) => s+(totals[t]||0), 0) };
    }), [yearRange, selectedTypes, selectedCountries]);

  const maxTotal = max(countryTotals, d => d.total) ?? 1;
  const scaleX = scaleLinear().domain([0, maxTotal]).range([0, BW]);
  const scaleY = scaleBand().domain(selectedCountries).range([0, bH]).padding(0.15);
  const bw = scaleY.bandwidth();

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
    </svg>
  );
}

