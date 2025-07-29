import { cn } from '@/lib/utils';
import React, { ComponentProps, ReactNode, RefObject, createContext, useContext, useRef, useState } from 'react';

interface Props {
  children: ReactNode;
}
interface IContext {
  handleMouseMove: (e: React.MouseEvent) => void;
  onShow: () => void;
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

  const handleMouseMove = (e: React.MouseEvent) => {
    const offset = 15;
    const tooltipWidth = tooltipRef.current?.offsetWidth || 200;
    const fitsRight = e.clientX + offset + tooltipWidth < window.innerWidth;

    setTooltipPos({
      x: fitsRight ? e.clientX + offset : e.clientX - tooltipWidth - 5,
      y: e.clientY + offset,
    });
  };
  const onShow = () => {
    setShowTooltip(true);
  };
  const onHide = () => {
    setShowTooltip(false);
  };
  return (
    <div>
      <TooltipContext.Provider value={{ handleMouseMove, onHide, onShow, showTooltip, tooltipPos, tooltipRef }}>
        {' '}
        {children}
      </TooltipContext.Provider>
    </div>
  );
};

const TooltipTrigger = ({ children }: { children: ReactNode }) => {
  const { handleMouseMove, onHide, onShow } = useCustomTooltip();
  return (
    <div onMouseMove={handleMouseMove} onMouseEnter={onShow} onMouseLeave={onHide}>
      {children}
    </div>
  );
};

const TooltipContent = ({ children, className, ...props }: TooltipContentProps) => {
  const { tooltipPos, showTooltip, tooltipRef } = useCustomTooltip();
  if (!showTooltip) return null;
  return (
    <div
      {...props}
      ref={tooltipRef}
      className={cn('bg-background/80 text-primary pointer-events-none fixed z-50 text-sm shadow backdrop-blur-lg', className)}
      style={{ top: tooltipPos.y, left: tooltipPos.x }}
    >
      {children}
    </div>
  );
};

CustomTooltip.Trigger = TooltipTrigger;
CustomTooltip.Content = TooltipContent;
