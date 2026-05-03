import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuCheckboxItem, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState, useRef } from "react";
import { useContainerWidth } from "@/hooks/useContainerWidth";
import { EnergyData } from "./EnergyData";
import { GlobalLinePlot } from "./GlobalLinePLot";
import { GlobalTotalBar } from "./GlobalTotalBar";
import { CountryPanel } from "./CountryPanel";

interface EnergyRow {
  country: string; year: number; primary_energy: number;
  coal: number; oil: number; gas: number; nuclear: number;
  hydro: number; solar: number; wind: number; biofuel: number;
  other_renewable: number;
}

const ALL_TYPES = ["coal","oil","gas","nuclear","hydro","solar","wind","biofuel","other_renewable"];
const TYPE_COLORS: Record<string,string> = {
  coal:"#4a4a4a", oil:"#8B4513", gas:"#FF8C00", nuclear:"#9B59B6",
  hydro:"#3498DB", solar:"#F1C40F", wind:"#2ECC71",
  biofuel:"#27AE60", other_renewable:"#1ABC9C",
};
const MIN_YEAR = 1965;
const MAX_YEAR = 2024;
const _data = EnergyData as EnergyRow[];
const ALL_COUNTRIES = [...new Set(_data.map(d => d.country))].filter(c => c !== "World").sort();
// ── Main dashboard ────────────────────────────────────────────────
export function EnergyDashboard() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const containerWidth = useContainerWidth(chartRef);
  const isMobile = containerWidth > 0 && containerWidth < 640;

  const [yearRange, setYearRange] = useState<[number,number]>([2000, MAX_YEAR]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["oil","gas","coal","wind","solar"]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const toggleType = (t: string) =>
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x!==t) : [...prev, t]);
  const toggleCountry = (c: string) =>
    setSelectedCountries(prev => prev.includes(c) ? prev.filter(x => x!==c) : [...prev, c]);

  return (
    <div ref={chartRef} style={{padding:"1.5rem", maxWidth:1400, margin:"0 auto", width:"100%", alignSelf:"stretch"}}>
      <h2 style={{marginBottom:"1.2rem"}}>Global Energy Dashboard</h2>

      {/* ── Year + energy type controls ── */}
      <div style={{display:"flex", gap:"2rem", alignItems:"flex-start", flexWrap:"wrap", marginBottom:"1.5rem"}}>
        <div style={{minWidth:220, flex:1}}>
          <p style={{fontSize:12, marginBottom:6, fontWeight:600}}>Year range: {yearRange[0]} – {yearRange[1]}</p>
          <Slider min={MIN_YEAR} max={MAX_YEAR} value={yearRange} onValueChange={v => setYearRange(v as [number,number])}/>
        </div>
        <div style={{flex:2}}>
          <p style={{fontSize:12, marginBottom:6, fontWeight:600}}>Energy types</p>
          <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
            {ALL_TYPES.map(t => (
              <Badge key={t}
                variant={selectedTypes.includes(t) ? "default" : "outline"}
                onClick={() => toggleType(t)}
                style={{cursor:"pointer", ...(selectedTypes.includes(t)
                  ? {backgroundColor:TYPE_COLORS[t], borderColor:TYPE_COLORS[t], color:"#fff"}
                  : {borderColor:TYPE_COLORS[t]})}}>
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top two charts ── */}
      <div style={{display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"1rem", marginBottom:"2rem"}}>
        <div>
          <p style={{fontSize:12, fontWeight:600, marginBottom:4}}>Energy mix over time (World)</p>
          <GlobalLinePlot yearRange={yearRange} selectedTypes={selectedTypes}/>
        </div>
        <div>
          <p style={{fontSize:12, fontWeight:600, marginBottom:4}}>Total by type — selected period</p>
          <GlobalTotalBar yearRange={yearRange} selectedTypes={selectedTypes}/>
        </div>
      </div>

      {/* ── Country selector ── */}
      <div style={{marginBottom:"1rem"}}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedCountries.length
                ? `${selectedCountries.length} countr${selectedCountries.length===1?"y":"ies"} selected`
                : "Select countries ▾"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Countries</DropdownMenuLabel>
            {ALL_COUNTRIES.map(c => (
              <DropdownMenuCheckboxItem key={c} checked={selectedCountries.includes(c)} onCheckedChange={() => toggleCountry(c)}>
                {c}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedCountries.length > 0 && (
          <div style={{display:"flex", gap:4, flexWrap:"wrap", marginTop:8}}>
            {selectedCountries.map(c => (
              <Badge key={c} variant="secondary" onClick={() => toggleCountry(c)} style={{cursor:"pointer"}}>{c} ×</Badge>
            ))}
          </div>
        )}
      </div>

      {/* ── Country charts ── */}
      <div>
        <p style={{fontSize:12, fontWeight:600, marginBottom:4}}>Country breakdown — stacked totals (left) &amp; trends (right)</p>
        <CountryPanel yearRange={yearRange} selectedTypes={selectedTypes} selectedCountries={selectedCountries}/>
      </div>
    </div>
  );
}
