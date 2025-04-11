import { SortByFilter } from '@/components/SortByFilter';
import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useState } from 'react';

import { SearchSchema } from '.';

export const Route = createFileRoute('/(home)/about')({
  component: About,
  validateSearch: zodValidator(SearchSchema),
});

function About() {
  const { sortBy, order } = Route.useSearch();
  const x = useMotionValue(0);
  const { scrollYProgress, scrollY } = useScroll();
  const bColor = useTransform(x, [0, 100], ['#ff0000', '#00ff00']);
  const bg = useTransform(scrollYProgress, [0, 100], ['#ff0000', '#00ff00']);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const boolean = useTransform(scrollY, [0, 1], [false, true]);
  const [isBorderShow, setIsBorderShow] = useState(false);
  useMotionValueEvent(boolean, 'change', (prev) => {
    console.log(prev);
    setIsBorderShow(prev);
  });

  return (
    <div>
      <m.div
        className={cn('sticky top-14 h-10 w-full', {
          border: isBorderShow,
        })}
        style={{ borderRadius: radius }}
      >
        <m.div className="size-full" style={{ scaleX: scrollYProgress, backgroundColor: bg, originX: 0, borderRadius: radius }} />
      </m.div>
      Hello "/about"!
      <div className="h-screen" />
      <div className="h-screen" />
      <motion.div
        className="flex size-20 cursor-grab items-center justify-center rounded"
        style={{
          backgroundColor: bColor,
          x,
        }}
        drag
        dragConstraints={{
          left: -200,
          right: 200,
          top: -100,
          bottom: 100,
        }}
      >
        <span>drag me</span>
      </motion.div>
      <m.div className="my-3 size-20 border" style={{ backgroundColor: bColor }}></m.div>
      <SortByFilter order={order} sortBy={sortBy} />
    </div>
  );
}
