import { RefObject, useEffect, useState } from 'react';

export const useScaleMap = (containerRef: RefObject<HTMLDivElement | null>) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault(); // блок скролу
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(1, Math.min(2, prev + delta)));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef.current]); 

  return { scale };
};
