import { BattleParticipant, BattleParticipantDto } from '@/shared/types';

interface Props {
  attackers: BattleParticipantDto[] | undefined;
  defenders: BattleParticipantDto[] | undefined;
}

export const BattleParticipantList = ({ attackers, defenders }: Props) => {
  return (
    <div className="mt-auto flex gap-1">
      <ul className="text-muted-foreground">
        {attackers?.map((a) => <li key={a.id}>{`${a.name} [${a.currentHealth}/${a.maxHealth}]`}</li>)}
      </ul>
      <p className="text-red-500">vs</p>
      <ul className="text-muted-foreground">
        {defenders?.map((a) => <li key={a.id}>{`${a.name} [${a.currentHealth}/${a.maxHealth}]`}</li>)}
      </ul>
    </div>
  );
};
