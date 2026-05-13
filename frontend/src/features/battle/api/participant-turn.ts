import { client } from '@/lib/utils';
import { ErrorResponse,  endTurnSchema } from '@/shared/types';
import { z } from 'zod';

export const participantTurn = async ({
  attackingZone,
  defenseZone,
  targetId,
  heroId,
}: z.infer<typeof endTurnSchema> & { heroId: string }) => {
  const res = await client.hero[':id'].battle.turn.$post({
    param: {
      id: heroId,
    },
    json: {
      attackingZone,
      defenseZone,
      targetId,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return res.json();
};
