import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
/* 
What do we want:
- make a flower with petals corresponding to some numbers?
We would need to 1. map the categories to radius
2. map the values to the length of the petal
3. make the petal shape with width proportional to the length

1. How to map petal to radius?

2. How to render bezier curves with end at proper point (length at given angle)
    and specify the right control points? -> we will need some matrix transform -> rotate a petal by angle?
    

*/


export const SimpleSvg = () => {
    const data = [
        { petal: "petal1", value: 10 },
        { petal: "petal2", value: 20 },
        { petal: "petal3", value: 15 },
        { petal: "petal4", value: 40 },
        { petal: "petal5", value: 25 },
        { petal: "petal6", value: 10 },
        { petal: "petal7", value: 40 },
        { petal: "petal8", value: 45 },
        { petal: "petal9", value: 30 },
    ]

    const width = 600;
    const height = 600;
    const cx = width / 2;
    const cy = height / 2;

    const scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([0, width / 2 - 20]);

    // Calculate angle for each petal
    const angleScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 2 * Math.PI]);

    // Function to create a petal path
    const createPetalPath = (length, angle) => {
        const path = d3.path();
        
        // Petal width (adjust to taste)
        const width = length * 0.3;
        
        // Start at center
        path.moveTo(0, 0);
        
        // First bezier: left side of petal
        // Control point 1: partway out, offset left
        // Control point 2: near tip, offset left
        // End point: at the tip
        path.bezierCurveTo(
            width * 0.6, length * 0.3,  // control point 1
            width * 0.4, length * 0.2,  // control point 2
            0, length                    // tip of petal
        );
        
        // Second bezier: right side back to center
        path.bezierCurveTo(
            -width * 0.7, length * 0.2, // control point 1
            -width * 0.5, length * 0.4, // control point 2
            0, 0                         // back to center
        );
        
        path.closePath();
        return path.toString();
    };

    return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }}>
            <g transform={`translate(${cx}, ${cy})`}>
                {data.map((d, i) => {
                    const angle = angleScale(i);
                    const length = scale(d.value);
                    const pathData = createPetalPath(length, angle);
                    const angleDeg = (angle * 180 / Math.PI) - 70; // -90 to start at top
                    
                    return (
                        <path
                            key={i}
                            d={pathData}
                            fill="steelblue"
                            fillOpacity={0.0}
                            stroke="steelblue"
                            strokeWidth={1}
                            transform={`rotate(${angleDeg})`}
                        />
                    );
                })}
            </g>
        </svg>
    );
};

