import { useState } from 'react';

export const useScaleMap = () => {
  const [scale, setScale] = useState(1);
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    setScale((prev) => {
      const newScale = prev - e.deltaY * 0.001;
      return Math.min(Math.max(newScale, 1), 3);
    });
  };

return {
    scale ,
    handleWheel
}
};


