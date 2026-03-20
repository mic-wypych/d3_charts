import { useState } from "react";
import * as d3 from "d3";

export const Barplot = ({ data }) => {
    const [hovered, setHovered] = useState(null);
    /*What we need to do for the basics:
    - map country names to y axis
    - map number of students to x axis */
    const width = 800;
    const height = 600;
    const marginLeft = 100;
    const marginRight = 100;
    const marginTop = 100;
    const marginBottom = 100;

    

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.students)])
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleBand()
        .domain(d3.sort(data, d => -d.students).map(d => d.country))
        .rangeRound([marginTop, height - marginBottom])
        .padding(0.1);

    return (
        <svg width={width} height={height}>
            <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="firebrick" stopOpacity={0} />
                    <stop offset="100%" stopColor="firebrick" stopOpacity={1} />
                </linearGradient>
            </defs>
            {data.map(d => (
                <g key={d.country}
                    onMouseEnter={() => setHovered(d)}
                    onMouseLeave={() => setHovered(null)}
                >
                    <rect
                        x={marginLeft}
                        y={y(d.country)}
                        width={x(d.students) - marginLeft}
                        height={y.bandwidth()}
                        fill="url(#barGradient)"
                        rx={4}
                    />
                    <text
                        x={marginLeft - 6}
                        y={y(d.country) + y.bandwidth() / 2}
                        dy="0.35em"
                        textAnchor="end"
                        fontSize={12}
                    >
                        {d.country}
                    </text>
                </g>
            ))}
            {hovered && (
                <text
                    x={x(hovered.students) + 8}
                    y={y(hovered.country) + y.bandwidth() / 2}
                    dy="0.35em"
                    fontSize={12}
                    fontWeight="bold"
                    fill="firebrick"
                >
                    {hovered.students}
                </text>
            )}
        </svg>
    );
}