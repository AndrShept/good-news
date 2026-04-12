import { NPC } from '@/shared/types';
import { useNpcActiveTabStore } from '@/store/useNpcActiveTabStore';
import { useNpcMessageStore } from '@/store/useNpcMessageStore';
import { useEffect } from 'react';

interface Props {
  npc: NPC;
}
export const NpcQuest = ({ npc }: Props) => {
  const { setNpcActiveTab } = useNpcActiveTabStore();
  const getEmptyMessage = useNpcMessageStore((state) => state.getEmptyMessage);
  useEffect(() => {
    setNpcActiveTab(null);
    getEmptyMessage({ npcType: npc.type, npcTab: 'QUEST' });
  }, [getEmptyMessage, npc.type, setNpcActiveTab]);
  return <div>NpcQuest</div>;
};
