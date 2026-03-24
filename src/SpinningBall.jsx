import { useState, useEffect, useRef } from "react";

const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Ease in to midpoint, pause, ease out to end
const easeWithPause = (t) => {
    const moveIn = 0.4, pause = 0.2, moveOut = 0.4;
    if (t < moveIn)               return 0.5 * easeInOutQuad(t / moveIn);
    if (t < moveIn + pause)       return 0.5;
    return 0.5 + 0.5 * easeInOutQuad((t - moveIn - pause) / moveOut);
};

const bezierPoint = (t, p0, p1, p2, p3) => {
    const m = 1 - t;
    return {
        x: m**3*p0.x + 3*m**2*t*p1.x + 3*m*t**2*p2.x + t**3*p3.x,
        y: m**3*p0.y + 3*m**2*t*p1.y + 3*m*t**2*p2.y + t**3*p3.y,
    };
};

export const SpinningBall = () => {
    const width = 600;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2;
    const R = 160;
    const N = 11; // number of ellipses (latitude rings)

    const [elapsed, setElapsed] = useState(0);
    const rafRef = useRef();
    const startRef = useRef(null);
    // Per-ring config: fixed on mount
    const ringConfigs = useRef(
        Array.from({ length: N }, () => {
            // Random starting position for the whole ring
            const ringPhase = Math.random() * 2 * Math.PI;

            // Random number of points: 3 to 5
            const count = 5 + Math.floor(Math.random() * 3);

            // Generate unequal gaps that sum to 2π:
            // draw random weights, then normalize to 2π
            const weights = Array.from({ length: count }, () => 0.5 + Math.random());
            const total = weights.reduce((s, w) => s + w, 0);
            const intraOffsets = weights.reduce((acc, w) => {
                acc.push((acc.at(-1) ?? 0) + (w / total) * 2 * Math.PI);
                return acc;
            }, []);

            const colors = intraOffsets.map(() =>
                Math.random() < 0.25 ? "firebrick" : "steelblue"
            );

            return { ringPhase, intraOffsets, colors };
        })
    );

    useEffect(() => {
        const animate = (timestamp) => {
            if (startRef.current === null) startRef.current = timestamp;
            setElapsed(timestamp - startRef.current);
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const angle = (elapsed * 0.0002) % (2 * Math.PI);

    // Build one entry per point across all rings
    const points = [];
    for (let i = 0; i < N; i++) {
        const phi = Math.PI * (i + 1) / (N + 1);
        const rx = R * Math.sin(phi);
        const ry = rx * 0.28;
        const ringCy = cy - R * Math.cos(phi);
        const { ringPhase, intraOffsets, colors } = ringConfigs.current[i];

        for (let j = 0; j < intraOffsets.length; j++) {
            const offset = intraOffsets[j];
            const pointAngle = angle + ringPhase + offset;
            const px = cx + rx * Math.cos(pointAngle);
            const py = ringCy - ry * Math.sin(pointAngle);
            const depth = (Math.sin(pointAngle) + 1) / 2;
            const pointR = (2 + 7 * Math.sin(phi)) * (0.15 + 0.85 * depth);
            const opacity = 0.2 + 0.8 * depth;
            points.push({ px, py, pointR, opacity, depth, color: colors[j] });
        }
    }

    // Draw back points first so front points render on top
    const sorted = [...points].sort((a, b) => a.depth - b.depth);

    const r = R - 10;
    const curveCount = 5;
    const spanTop = 20;
    const spanBottom = height - 20;
    const curveHeights = Array.from({ length: curveCount }, (_, i) =>
        spanTop + (i / (curveCount - 1)) * (spanBottom - spanTop)
    );

    const leftEnd  = { x: cx - r, y: cy };
    const rightEnd = { x: cx + r, y: cy };

    // Flow points travelling along each bezier curve
    const flowSpeed = 1 / 6000;  // one full cycle per 6 s
    const stagger   = 0.14;      // each curve starts 14% of cycle later
    const active    = 0.72;      // fraction of cycle the point is visible

    const flowPoints = [];
    curveHeights.forEach((h, i) => {
        const phase = (((elapsed * flowSpeed) - i * stagger) % 1 + 1) % 1;
        if (phase >= active) return; // in the reset gap — invisible

        const t = easeWithPause(phase / active);

        // Left: travels from left edge → circle
        const lp = bezierPoint(t,
            { x: 0,          y: h  },
            { x: cx * 0.5,   y: h  },
            { x: leftEnd.x - 40, y: cy },
            leftEnd
        );
        flowPoints.push({ ...lp, key: `l${i}` });

        // Right: travels from circle → right edge (reversed control points)
        const rp = bezierPoint(t,
            rightEnd,
            { x: rightEnd.x + 40,   y: cy },
            { x: width - cx * 0.5,  y: h  },
            { x: width,             y: h  }
        );
        flowPoints.push({ ...rp, key: `r${i}` });
    });

    const leftLabels  = ["data", "context", "business needs", "stack", "code"];
    const rightLabels = ["visualizations", "reports", "dashboards", "applications", "articles"];

    return (
        <svg width={width} height={height} overflow="visible">
            {curveHeights.map((h, i) => (
                <g key={i}>
                    <path
                        d={`M 0 ${h} C ${cx * 0.5} ${h}, ${leftEnd.x - 40} ${cy}, ${leftEnd.x} ${cy}`}
                        fill="none"
                        stroke="rgba(100, 120, 220, 0.25)"
                        strokeWidth={1}
                    />
                    <text
                        x={-8}
                        y={h}
                        dy="0.35em"
                        fontSize={11}
                        fill="rgba(100, 120, 220, 0.7)"
                        textAnchor="end"
                    >
                        {leftLabels[i]}
                    </text>
                    <path
                        d={`M ${width} ${h} C ${width - cx * 0.5} ${h}, ${rightEnd.x + 40} ${cy}, ${rightEnd.x} ${cy}`}
                        fill="none"
                        stroke="rgba(100, 120, 220, 0.25)"
                        strokeWidth={1}
                    />
                    <text
                        x={width + 8}
                        y={h}
                        dy="0.35em"
                        fontSize={11}
                        fill="rgba(100, 120, 220, 0.7)"
                        textAnchor="start"
                    >
                        {rightLabels[i]}
                    </text>
                </g>
            ))}
            <circle
                cx={cx}
                cy={cy}
                r={R-10}
                fill="none"
                stroke="rgba(100, 120, 220, 0.2)"
                strokeWidth={1}
            />
            {flowPoints.map(pt => (
                <circle
                    key={pt.key}
                    cx={pt.x}
                    cy={pt.y}
                    r={3}
                    fill="steelblue"
                    opacity={0.7}
                />
            ))}
            {sorted.map((pt, i) => (
                <circle
                    key={i}
                    cx={pt.px}
                    cy={pt.py}
                    r={pt.pointR}
                    fill={pt.color}
                    opacity={pt.opacity}
                />
            ))}
        </svg>
    );
};

