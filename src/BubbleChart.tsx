import {scaleLinear, scaleSqrt, scaleOrdinal, max, min} from "d3";

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
        .domain(["Asia", "Europe", "Africa", "Americas", "Oceania", "Australia"])
        .range(["blue", "red", "green", "yellow", "black", "pink"])
    

    return  (

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
                <g key={value} transform={`translate(${scaleX(value)}, 0)`}>
                <line y1 = {boundsHeight} y2={boundsHeight +TICK_LENGTH} stroke="black"/>
                <text
                style={{
                    fontSize: "10px",
                    textAnchor: "middle",
                    transform: "translateY(620px)"
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
            style={{
                    fontSize: "14px",
                    textAnchor: "middle",
                    transform: "translateY(640px) translateX(540px)"
                }}>
                Gdp Per Capita
            </text>

            <text
            style={{
                    fontSize: "14px",
                    textAnchor: "middle",
                    transform: "translateY(0) translateX(0px)"
                }}>
                Life expectancy
            </text>
            
            </g>

        </svg>
)}