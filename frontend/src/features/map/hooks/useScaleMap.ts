import { useCallback, useRef, useState } from 'react';

export const useScaleMap = () => {
  const [scale, setScale] = useState(1.5);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastWheelRef = useRef(0);

  const callbackRef = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;

    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const now = Date.now();
      if (now - lastWheelRef.current < 10) return; // throttle 50ms
      lastWheelRef.current = now;

      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(1, Math.min(2, prev + delta)));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return { scale, containerRef, callbackRef };
};
