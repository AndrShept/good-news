import { cn } from '@/lib/utils';
import React, { ComponentProps, ReactNode, RefObject, createContext, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: ReactNode;
}

interface IContext {
  updatePosition: (x: number, y: number) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  onShow: (x: number, y: number) => void;
  onHide: () => void;
  showTooltip: boolean;
  tooltipRef: RefObject<HTMLDivElement | null>;
}

interface TooltipContentProps extends ComponentProps<'div'> {
  children: ReactNode;
}

const TooltipContext = createContext<IContext | null>(null);

const useCustomTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error('Tooltip context not initialized');
  return context;
};

export const CustomTooltip = ({ children }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = (x: number, y: number) => {
    const tooltipEl = tooltipRef.current;
    if (!tooltipEl) return;

    const offset = 15;
    const tooltipWidth = tooltipEl.offsetWidth || 200;
    const tooltipHeight = tooltipEl.offsetHeight || 50;

    const newX = x + offset + tooltipWidth < window.innerWidth ? x + offset : x - tooltipWidth - 5;
    const newY = y + offset + tooltipHeight < window.innerHeight ? y + offset : y - tooltipHeight - 5;

    tooltipEl.style.transform = `translate(${newX}px, ${newY}px)`;
    tooltipEl.style.opacity = '1';
  };

  const onShow = (x: number, y: number) => {
    setShowTooltip(true);

  };

  const onHide = () => {
    setShowTooltip(false);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    longPressTimerRef.current = setTimeout(() => {
      onShow(touch.clientX, touch.clientY);
    }, 300);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setShowTooltip(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (showTooltip) {
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    }
  };

  return (
    <TooltipContext.Provider
      value={{
        updatePosition,
        handleTouchStart,
        handleTouchEnd,
        handleTouchMove,
        onShow,
        onHide,
        showTooltip,
        tooltipRef,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = ({ children }: { children: ReactNode }) => {
  const { updatePosition, onShow, onHide, handleTouchStart, handleTouchEnd, handleTouchMove } = useCustomTooltip();

  return (
    <div
      style={{ touchAction: 'manipulation' }}
      onMouseMove={(e) => updatePosition(e.clientX, e.clientY)}
      onMouseEnter={(e) => onShow(e.clientX, e.clientY)}
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
  const { showTooltip, tooltipRef } = useCustomTooltip();

  if (!showTooltip) return null;

  return createPortal(
    <div
      {...props}
      ref={tooltipRef}
      className={cn(
        'bg-muted/80 pointer-events-none fixed left-0 top-0 z-50 flex max-w-[280px] flex-col items-center justify-center truncate rounded-sm border px-3 py-1.5 text-sm shadow backdrop-blur-lg',
        className,
      )}
      style={{
        opacity: 0,
        transform: 'translate(-9999px, -9999px)',
      }}
    >
      {children}
    </div>,
    document.body,
  );
};

CustomTooltip.Trigger = TooltipTrigger;
CustomTooltip.Content = TooltipContent;