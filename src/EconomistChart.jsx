import * as d3 from "d3";

export const EconomistChart = () => {

    const data = [
        { count: 6, name: "Hantavirus" },
        { count: 7, name: "Tularemia" },
        { count: 7, name: "Dengue" },
        { count: 9, name: "Ebola" },
        { count: 11, name: "E. coli" },
        { count: 15, name: "Tuberculosis" },
        { count: 17, name: "Salmonella" },
        { count: 18, name: "Vaccinia" },
        { count: 54, name: "Brucella" },
    ];



    const width = 900;
    const height = 600;
    const marginLeft = 120;
    const marginRight = 100;
    const marginTop = 120;
    const marginBottom = 100;

    const title = "Escape artists"
    const subtitle = "Number of laboratory-acquired infections 1970-2021"
    const footnote = "Sources: Laboratory-Acquired Infection Database; American Biological Safety Association"
    const source = "The Economist"

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleBand()
    .domain(d3.sort(data, d => -d.count).map(d => d.name))
        .rangeRound([marginTop, height - marginBottom])
        .padding(0.1);

    const breaks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

    return (
        
        <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            style={{ maxWidth: width }}
        >
            <rect 
                x={0}
                y={0}
                width={width}
                height={height}
                fill="white"
            />
            <rect 
                x={marginLeft}
                y={2}
                width={40}
                height={12}
                fill="rgb(229, 1, 28)"
            />
            <line
                x1={marginLeft}
                y1={2}
                x2={width - marginRight - 30}
                y2={2}
                stroke="rgb(229, 1, 28)"
                strokeWidth={2}
            />
            
            <text 
                x={marginLeft}
                y={marginTop - 80}
                fontSize={24}
                fontWeight="bold"
                textAnchor="start"
            >
                {title}
            </text>
            <text 
                x={marginLeft}
                y={marginTop - 50}
                fontSize={18}
                textAnchor="start"
            >
                {subtitle}
            </text>
            {breaks.map(b => (
                <g key={b}>
                    <text
                        x={x(b)}
                        y={marginTop -10}
                        fontSize={14}
                        fill= "grey"
                        textAnchor="middle"
                        dy="0.35em"
                    >
                        {b}
                    </text>
                    <line
                        x1={x(b)}
                        y1={marginTop}
                        x2={x(b)}
                        y2={height - marginBottom}
                        stroke={b === 0 ? "black" : "lightgrey"}
                        strokeWidth={1}
                    />
                </g>
            ))}


            {data.map(d => (
                <g key={d.name}>
                    <rect
                        x={marginLeft}
                        y={y(d.name)}
                        width={x(d.count) - marginLeft}
                        height={y.bandwidth()/1.3}
                        fill= "rgb(7, 111, 162)"
                    />
                </g>
            ))}

            {data.map(d => (
                <g key={d.name}>
                    <text
                        x = {d.count < 9 ? x(d.count) + 10 : marginLeft + 5}
                        y={y(d.name) + y.bandwidth() / 2}
                        dy="0.1em"
                        fill= {d.count < 9 ? "rgb(7, 111, 162)": "white"}
                        fontSize={14}
                    >
                        {d.name}
                    </text>
                </g>
            ))}
            <text 
                x={marginLeft}
                y={marginTop + 400}
                fontSize={14}
                fill="grey"
                textAnchor="start"
            >
                {footnote}
            </text>
            <text 
                x={marginLeft}
                y={marginTop + 420}
                fontSize={14}
                fill="grey"
                textAnchor="start"
            >
                {source}
            </text>
        </svg>
        
        
    );
}