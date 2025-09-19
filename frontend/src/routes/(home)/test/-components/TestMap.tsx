import { useRef, useState } from 'react';

const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;

export default function GameMap() {
  const [grid, setGrid] = useState<(null | string)[]>(Array(MAP_WIDTH * MAP_HEIGHT).fill(null));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  const [scale, setScale] = useState(1);

  const toggleTile = (x: number, y: number) => {
    const index = y * MAP_WIDTH + x;
    setGrid((prev) => {
      const copy = [...prev];
      copy[index] = copy[index] ? null : 'tree';
      return copy;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    if (isDragging && start) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;

      containerRef.current.scrollLeft -= dx;
      containerRef.current.scrollTop -= dy;

      setStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    // враховуємо зум (scale)
    const relativeX = (e.clientX - rect.left + containerRef.current.scrollLeft) / scale;
    const relativeY = (e.clientY - rect.top + containerRef.current.scrollTop) / scale;

    const x = Math.floor(relativeX / TILE_SIZE);
    const y = Math.floor(relativeY / TILE_SIZE);

    if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
      setHoverIndex(y * MAP_WIDTH + x);
    } else {
      setHoverIndex(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStart(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    setScale((prev) => {
      const newScale = prev - e.deltaY * 0.001;
      return Math.min(Math.max(newScale, 1), 3);
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-video h-[500px] overflow-hidden border"
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={() => {
        if (hoverIndex !== null && !isDragging) {
          const x = hoverIndex % MAP_WIDTH;
          const y = Math.floor(hoverIndex / MAP_WIDTH);
          toggleTile(x, y);
        }
      }}
    >
      <div
        className="relative origin-top-left"
        style={{
          imageRendering: 'pixelated',
          width: MAP_WIDTH * TILE_SIZE,
          height: MAP_HEIGHT * TILE_SIZE,
          backgroundImage: "url('/sprites/map/solmer.png')",
          backgroundSize: 'cover',
          transform: `scale(${scale})`,
        }}
      >
        {grid.map((tile, index) => {
          if (!tile) return null;

          const x = index % MAP_WIDTH;
          const y = Math.floor(index / MAP_WIDTH);

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: x * TILE_SIZE,
                top: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundImage: "url('/tree.png')",
                backgroundSize: 'contain',
              }}
            />
          );
        })}

        {hoverIndex !== null && !isDragging && (
          <div
            style={{
              position: 'absolute',
              left: (hoverIndex % MAP_WIDTH) * TILE_SIZE,
              top: Math.floor(hoverIndex / MAP_WIDTH) * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              backgroundColor: 'rgba(0, 255, 0, 0.3)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}
