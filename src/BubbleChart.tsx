import {scaleLinear, scaleSqrt, scaleOrdinal, max, min} from "d3";
import {Badge} from "@/components/ui/badge"

interface DataItem {
    country: string;
    continent: string;
    lifeExp: number;
    pop: number;
    gdpPercap: number;
}



export const BubbleChart = ({ data }: { data: DataItem[] }) => {

    /*
    What I need is:
    - margins
    - bounds
    - scales mapping
    - axes
    */

    const MARGIN = {
        left: 100,
        right: 100,
        top: 100,
        bottom: 100,
    } 

    const width = 800
    const height = 800

    const BUBBLE_MIN_SIZE = 2;
    const BUBBLE_MAX_SIZE = 20;

    /*bounds*/
    const boundsWidth = width - MARGIN.right - MARGIN.left;

    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const TICK_LENGTH = 10


    /*scales*/

   const COLOR_MAP: Record<string, string> = {
        Asia:     "#073b4c",
        Europe:   "#118ab2",
        Africa:   "#ef476f",
        Americas: "#ffd166",
        Oceania:  "#f78c6b",
        Australia: "#06d6a0"
        };

            
    ["Asia", "Europe", "Africa", "Americas", "Oceania", "Australia"]

    const scaleX = scaleLinear()
        .domain([0, max(data, (d: DataItem) => d.gdpPercap)])
        .range([0, boundsWidth])

    const scaleY = scaleLinear()
        .domain([1.05*max(data, (d: DataItem) => d.lifeExp), 0.8*min(data, (d: DataItem) => d.lifeExp)])
        .range([0, boundsHeight])

    const scaleSize = scaleSqrt()
        .domain([4, max(data, (d: DataItem) => d.pop)])
        .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE])
    
    const scaleColor = scaleOrdinal<string>()
        .domain(Object.keys(COLOR_MAP) )
        .range(Object.values(COLOR_MAP))
    

    return  (
        <>
        <p style={{ fontSize: "20px", marginBottom: "8px" }}>
            Relation between GDP per capita and life expectancy across countries
        </p>
        
        <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
               {Object.entries(COLOR_MAP).map(([continent, color]) => (
            <Badge key={continent} variant="outline" style={{ display: "inline-flex", gap: "4px", alignItems: "center", transform: "translateY(40px)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color, display: "inline-block" }} />
                {continent}
            </Badge>
        ))}

        </div>
     



        <svg width={width} height={height}>
            


            <g
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
            >
                
            <line y1 = {boundsHeight}
                  y2 = {boundsHeight}
                  x1 = {0}
                  x2 = {boundsWidth}
                  stroke ="black"/>

             <line y1 = {0}
                  y2 = {boundsHeight}
                  x1 = {0}
                  x2 = {0}
                  stroke ="black"/>
            {scaleX.ticks(10).map((value) => (
                <g key={value} transform={`translate(${scaleX(value)}, ${boundsHeight})`}>
                <line y2={TICK_LENGTH} stroke="black"/>
                <text
                style={{
                    fontSize: "10px",
                    textAnchor: "middle",
                    transform: "translateY(20px)"
                }}>
                    {value}
                </text>
                </g>
            ))}

            {scaleY.ticks(10).map((value) => (
                <g key={value} transform={`translate(0, ${scaleY(value)})`}>
                <line x2={-TICK_LENGTH} stroke="black"/>
                <text
                style={{
                    fontSize: "10px",
                    textAnchor: "middle",
                    transform: "translateX(-20px)"
                }}>
                    {value}
                </text>
                </g>
            ))}

            {data.map((d, i) => (
                <circle
                key={i}
                cx={scaleX(d.gdpPercap)}
                cy={scaleY(d.lifeExp)}
                r={scaleSize(d.pop)} 
                fill={scaleColor(d.continent)}
                opacity={0.5}/>
            ))}
            <text
                fontSize="14"
                textAnchor="middle"
                transform={`translate(${boundsWidth / 2}, ${boundsHeight + 40})`}
            >
                Gdp Per Capita
            </text>

            <text
                fontSize="14"
                textAnchor="middle"
                transform={`translate(-40, ${boundsHeight / 2}) rotate(-90)`}
            >
                Life expectancy
            </text>
            
            </g>

        </svg>
        </>
)}