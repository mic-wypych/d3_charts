import { scaleLinear, scaleBand, max, line as d3line } from "d3";
import { useMemo, useRef} from "react";
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


export const CountryLine = ({  yearRange, selectedTypes, selectedCountries}: { yearRange:[number,number]; selectedTypes:string[]; selectedCountries:string[] }) => {
 const chartRef = useRef(null);
 const chartSize = useDimensions(chartRef)

 return(
  <div ref={chartRef} style={{width: "100%", height: 400}}>
    {chartSize.width > 0 && chartSize.height > 0 && (
      <CountryLineMain
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

export function CountryLineMain({ yearRange, selectedTypes, selectedCountries, width }:
  { yearRange:[number,number]; selectedTypes:string[]; selectedCountries:string[]; width:number; height:number }) {
  const ML=90, MR=8, MT=8;
  const SW = width - ML - MR;
  const BAND_H = 150, AXIS_H = 16;
  const bH = Math.max(selectedCountries.length * BAND_H, 1);

  const countryRows = useMemo(() =>
    selectedCountries.map(country => ({
      country,
      rows: _data.filter(d => d.country===country && d.year>=yearRange[0] && d.year<=yearRange[1]),
    })), [yearRange, selectedCountries]);

  const scaleY = scaleBand().domain(selectedCountries).range([0, bH]).padding(0.15);
  const bw = scaleY.bandwidth();
  const scaleSparkX = scaleLinear().domain(yearRange).range([0, SW]);

    return (
      <svg viewBox={`0 0 ${SW + ML + MR} ${bH + MT}`} style={{width:"100%", overflow:"visible"}}>
        <g transform={`translate(${ML},${MT})`}>
          {countryRows.map(({ country, rows }) => {
            const maxVal = max(selectedTypes.flatMap(t => rows.map(d => d[t as keyof EnergyRow] as number))) ?? 1;
            const plotH = bw - AXIS_H;
            const scaleSparkY = scaleLinear().domain([0, maxVal*1.05]).range([plotH, 0]);
            return (
              <g key={country} transform={`translate(0,${scaleY(country) ?? 0})`}>
                <text x={-6} y={bw/2} textAnchor="end" dominantBaseline="middle" fontSize={10}>{country}</text>
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