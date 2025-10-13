import React from 'react';
import { BackToTownEntryButton } from '../BackToTownEntryButton';


export const Temple = () => {
  return (
    <section className="flex flex-col items-center gap-2">
      <BackToTownEntryButton />
      <div className="relative aspect-video max-w-[850px] overflow-hidden rounded-2xl border">
        <img className="size-full object-cover" src="/sprites/buildings/temple-bg.png" alt="" />
      </div>
    </section>
  );
};
