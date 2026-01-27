import { cn } from '@/lib/utils';
import React, { ComponentProps, ReactNode, RefObject, createContext, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: ReactNode;
}

interface IContext {
  handleMouseMove: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  onShow: (x: number, y: number) => void;
  onHide: () => void;
  tooltipPos: { x: number; y: number };
  showTooltip: boolean;
  tooltipRef: RefObject<HTMLDivElement | null>;
}

interface TooltipContentProps extends ComponentProps<'div'> {
  children: ReactNode;
}

const TooltipContext = createContext<IContext | null>(null);

const useCustomTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip context not initialized');
  }
  return context;
};

export const CustomTooltip = ({ children }: Props) => {
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = (x: number, y: number) => {
    const offset = 15;
    const tooltipWidth = tooltipRef.current?.offsetWidth || 200;
    const fitsRight = x + offset + tooltipWidth < window.innerWidth;

    setTooltipPos({
      x: fitsRight ? x + offset : x - tooltipWidth - 5,
      y: y + offset,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    calculatePosition(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    longPressTimerRef.current = setTimeout(() => {
      calculatePosition(touch.clientX, touch.clientY);
      setShowTooltip(true);
    }, 300); // 300ms для long press
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setShowTooltip(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Скасувати long press при русі пальцем
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Оновити позицію якщо tooltip вже показаний
    if (showTooltip) {
      const touch = e.touches[0];
      calculatePosition(touch.clientX, touch.clientY);
    }
  };

  const onShow = (x: number, y: number) => {
    calculatePosition(x, y);
    setShowTooltip(true);
  };

  const onHide = () => {
    setShowTooltip(false);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div>
      <TooltipContext.Provider
        value={{
          handleMouseMove,
          handleTouchStart,
          handleTouchEnd,
          handleTouchMove,
          onHide,
          onShow,
          showTooltip,
          tooltipPos,
          tooltipRef,
        }}
      >
        {children}
      </TooltipContext.Provider>
    </div>
  );
};

const TooltipTrigger = ({ children }: { children: ReactNode }) => {
  const { handleMouseMove, handleTouchStart, handleTouchEnd, handleTouchMove, onHide, onShow } = useCustomTooltip();

  const handleMouseEnter = (e: React.MouseEvent) => {
    onShow(e.clientX, e.clientY);
  };

  return (
    <div
       style={{ touchAction: 'manipulation' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHide}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  );
};

const TooltipContent = ({ children, className, ...props }: TooltipContentProps) => {
  const { tooltipPos, showTooltip, tooltipRef } = useCustomTooltip();
  if (!showTooltip) return null;
  return createPortal(
    <div
      {...props}
      ref={tooltipRef}
      className={cn('bg-background/80 text-primary pointer-events-none fixed z-50 text-sm shadow backdrop-blur-lg', className)}
      style={{ top: tooltipPos.y, left: tooltipPos.x }}
    >
      {children}
    </div>,
    document.body,
  );
};

CustomTooltip.Trigger = TooltipTrigger;
CustomTooltip.Content = TooltipContent;
