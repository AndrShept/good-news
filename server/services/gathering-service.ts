import { gatheringConfig } from '@/shared/config/gathering-config';
import { type GatheringCategorySkillKey, skillTemplateByKey } from '@/shared/templates/skill-template';
import { toolsTemplate } from '@/shared/templates/tool-template';
import type { TileType } from '@/shared/types';
import { getMapLayerNameAtHeroPos } from '@/shared/utils';
import { HTTPException } from 'hono/http-exception';

import { heroService } from './hero-service';

export const gatheringService = {
  canStartGathering(heroId: string, skillKey: GatheringCategorySkillKey) {
    const skillTemplate = skillTemplateByKey[skillKey];
    const hero = heroService.getHero(heroId);
    const tool = toolsTemplate.find((t) => t.toolInfo.skillTemplateId === skillTemplate.id);
    if (!tool) throw new HTTPException(404, { message: 'tool not found' });
    if (!hero.location.mapId) throw new HTTPException(400, { message: 'You must be on a map to start gathering.' });
    const equipTool = hero.equipments.find((e) => e.itemTemplateId === tool.id);
    if (!equipTool)
      throw new HTTPException(400, { message: `You must equip ${tool.name} to start ${skillTemplate.name}.}`, cause: { canShow: true } });

    const pos = { x: hero.location.x, y: hero.location.y };
    const tilesAroundHero = getMapLayerNameAtHeroPos(hero.location.mapId, pos);
    let existTile: TileType | null = null;
    for (const tile of tilesAroundHero) {
      if (gatheringConfig[tile as Exclude<TileType, 'GROUND' | 'OBJECT'>].skillKey === skillKey) {
        existTile = tile;
      }
    }
    if (!existTile) {
      throw new HTTPException(400, { message: `There is nothing to gather here.` });
    }
    console.log(tilesAroundHero);
  },
};
