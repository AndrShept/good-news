import type { OmitModifier } from '@/shared/types';
import { eq } from 'drizzle-orm';

import type { TDataBase, TTransaction } from '../db/db';
import { buffTable, equipmentTable, heroTable } from '../db/schema';
import { craftItemService } from '../services/craft-item-service';
import { newCombineModifier } from './utils';

export const getHeroStatsWithModifiers = async (db: TTransaction | TDataBase, heroId: string) => {
  const [buffs, equipments, hero] = await Promise.all([
    db.query.buffTable.findMany({ where: eq(buffTable.heroId, heroId), columns: { modifier: true } }),
    db.query.equipmentTable.findMany({
      where: eq(equipmentTable.heroId, heroId),
      with: {
        gameItem: { with: { accessory: true, armor: true, weapon: true, shield: true } },
      },
    }),
    db.query.heroTable.findFirst({
      where: eq(heroTable.id, heroId),
      columns: { currentMana: true, currentHealth: true, stat: true },
    }),
  ]);
  const coreMaterialModifiers: Partial<OmitModifier>[] = [];

  for (const item of equipments) {
    const coreMaterialModifier = craftItemService(db).getMaterialModifier(item.gameItem, item.gameItem.coreMaterial);
    if (coreMaterialModifier) {
      coreMaterialModifiers.push(coreMaterialModifier);
    }
  }

  const modifiers = [
    ...buffs.map((b) => b.modifier),
    ...equipments.map((e) => e.gameItem.armor ?? e.gameItem.accessory ?? e.gameItem.weapon ?? e.gameItem.shield),
    ...coreMaterialModifiers,
  ];

  const newModifier = newCombineModifier(...modifiers);
  const sumStatAndModifier = newCombineModifier(newModifier, hero?.stat);

  return {
    newModifier,
    sumStatAndModifier,
  };
};
