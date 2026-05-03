/* remaking the responsive dahsboard */

/* imports */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuCheckboxItem, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { useState, useRef } from "react";
import { EnergyData } from "./EnergyData";
import { GlobalLinePlot } from "./GlobalLinePLot";
import { GlobalTotalBar } from "./GlobalTotalBar";
import { CountryPanel } from "./CountryPanel";

/* rebuilding :
- rebuild axes to a separate module (with titles?)
- rebuild responsiveness with the ref and usedimensions hook
- rebuild country panel
- fix axis text on total bar plot
*/


/* constants, data etc */

interface EnergyRow {
  country: string; year: number; primary_energy: number;
  coal: number; oil: number; gas: number; nuclear: number;
  hydro: number; solar: number; wind: number; biofuel: number;
  other_renewable: number;
}

const ALL_TYPES = ["coal","oil","gas","nuclear","hydro","solar","wind","biofuel","other_renewable"];
const TYPE_COLORS: Record<string,string> = {
  coal:"#4a4a4a", oil:"#8B4513", gas:"#FF8C00", nuclear:"#9B59B6",
  hydro:"#3498DB", solar:"#c29d07ff", wind:"#2ECC71",
  biofuel:"#275faeff", other_renewable:"#1ABC9C",
};


const _data = EnergyData as EnergyRow[];
const ALL_COUNTRIES = [...new Set(_data.map(d => d.country))].filter(c => c !== "World").sort();

/* TODO: change to read from data */
const MIN_YEAR = 1965
const MAX_YEAR =2024

/* dashboard */

export function Dashboardenergy() {

/* intro: a few words of explanation + main inputs
    any additional constants?
*/

const [yearRange, setYearRange] = useState<[number,number]>([2000, MAX_YEAR]);
const [selectedTypes, setSelectedTypes] = useState<string[]>(["oil","gas","coal","wind","solar"]);
const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
const [activeTab, setActiveTab] = useState("overview");

const toggleType = (t: string) =>
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x!==t) : [...prev, t]);
const toggleCountry = (c: string) =>
setSelectedCountries(prev => prev.includes(c) ? prev.filter(x => x!==c) : [...prev, c]);

 return(
    <div style={{width: "100vw"}}>
        <h1>Global Energy</h1>
        <div>
            Energy mix varies across countries and time. This dashboard allows you to explore those differences and trends in a few interactive plots
        </div>

    
    <div style={{maxWidth: 2000, display: "flex", justifyContent: "space-between"}}>
    <div style={{marginBottom: 10, width: "48%"}}>
    <p style={{fontSize:"1.1em", marginBottom:6, fontWeight:600}}>Year range: {yearRange[0]} – {yearRange[1]}</p>
    <Slider min={MIN_YEAR} max={MAX_YEAR} value={yearRange} onValueChange={v => setYearRange(v as [number,number])}/>
   </div>

   <div style={{display:"flex", gap:6, flexWrap:"wrap", width: "48%"}}>
               {ALL_TYPES.map(t => (
                 <Badge key={t}
                   variant={selectedTypes.includes(t) ? "default" : "ghost"}
                   onClick={() => toggleType(t)}
                   style={{cursor:"pointer", ...(selectedTypes.includes(t)
                     ? {backgroundColor:TYPE_COLORS[t], borderColor:TYPE_COLORS[t], color:"#fff"}
                     : {borderColor:TYPE_COLORS[t]})}}>
                   {t}
                 </Badge>
               ))}
             </div>
   
   </div>

    <div>
     <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="countries">Countries</TabsTrigger>
    </TabsList>
    </Tabs>

    </div>

    {activeTab === "overview" && (

    <>
    

        
    <div style={{display: "flex", width: "100%"}}>
        <div style={{width: "100%"}}>
        <GlobalLinePlot yearRange={yearRange} selectedTypes={selectedTypes}/>
        </div>

        <div style={{width: "100%"}}>
            <GlobalTotalBar yearRange={yearRange} selectedTypes={selectedTypes}/>
        </div>

    </div>
    </>
    )}

   {activeTab === "countries" && (
    <>
    
    
    <p>Countries</p>
    <div style={{marginBottom:"1rem", display: "flex", justifyContent: "flex-start"}}>
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
       <div>
        <p style={{fontSize:12, fontWeight:600, marginBottom:4}}>Country breakdown — stacked totals (left) &amp; trends (right)</p>
        <CountryPanel yearRange={yearRange} selectedTypes={selectedTypes} selectedCountries={selectedCountries}/>
      </div>
    </>)}
    </div>
 )
    

}