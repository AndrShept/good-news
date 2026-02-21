import { client } from '@/lib/utils';
import { GatheringCategorySkillKey } from '@/shared/templates/skill-template';
import { ErrorResponse } from '@/shared/types';

export const gatherResource = async ({ heroId, gatherSkill }: { heroId: string; gatherSkill: GatheringCategorySkillKey }) => {
  const res = await client.hero[':id'].action.gather[':gatherSkill'].$post({
    param: {
      id: heroId,
      gatherSkill,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};
