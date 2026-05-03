import { useEffect, useState } from "react";

/**
 * Observes the width of a ref'd container and returns it.
 * Usage:
 *   const chartRef = useRef(null);
 *   const width = useContainerWidth(chartRef);
 *   <div ref={chartRef}>...</div>
 */
export function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setWidth(el.getBoundingClientRect().width);

    const observer = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref]);

  return width;
}

