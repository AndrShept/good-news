import React from 'react';

import { TownBuilding } from './TownBuilding';

export const TownMap = () => {
  return (
    <section className="w-150 relative mx-auto overflow-hidden rounded border">
      <img src="/sprites/towns/solmere.png" className="size-full" />

      <TownBuilding buildingType="TOWN-HALL" className="top-41 w-37 left-58 absolute" />
      <TownBuilding buildingType="MAGIC-SHOP" className="top-103 w-34 left-60 absolute" />
    </section>
  );
};
