import { NPC } from '@/shared/types';
import { useNpcStore } from '@/store/useNpcStore';
import { useEffect } from 'react';

interface Props {
  npc: NPC;
}
export const NpcQuest = ({ npc }: Props) => {
  const { setNpcActiveTab, getEmptyMessage } = useNpcStore();
  useEffect(() => {
    setNpcActiveTab(null);
    getEmptyMessage({ npcType: npc.type, npcTab: 'QUEST' });
  }, [getEmptyMessage, npc.type, setNpcActiveTab]);
  return <div>NpcQuest</div>;
};
