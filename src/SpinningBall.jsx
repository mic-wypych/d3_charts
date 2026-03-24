import { useState, useEffect, useRef } from "react";

export const SpinningBall = () => {
    const width = 400;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2;
    const R = 160;
    const N = 11; // number of ellipses (latitude rings)

    const [angle, setAngle] = useState(0);
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
        const speed = 0.0002; // radians per ms

        const animate = (timestamp) => {
            if (startRef.current === null) startRef.current = timestamp;
            const elapsed = timestamp - startRef.current;
            setAngle((elapsed * speed) % (2 * Math.PI));
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

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

    return (
        <svg width={width} height={height}>
            <circle
                cx={cx}
                cy={cy}
                r={R}
                fill="none"
                stroke="rgba(100, 120, 220, 0.2)"
                strokeWidth={1}
            />
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

