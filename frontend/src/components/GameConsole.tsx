import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BattleLogList } from '@/features/battle/components/BattleLogList';
import { useBattleListener } from '@/features/battle/hooks/useBattleListener';
import { useGroupListener } from '@/features/group/hooks/useGroupListener';
import { useBuffListener } from '@/features/hero/hooks/useBuffListener';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroListener } from '@/features/hero/hooks/useHeroListener';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { useSelfMessage } from '@/features/hero/hooks/useSelfMessage';
import { useMapListener } from '@/features/map/hooks/useMapListener';
import { usePlaceListener } from '@/features/place/hooks/usePlaceListener';
import { useQueueCraftListener } from '@/features/queue/hooks/useQueueCraftListener';
import { ConsoleActiveTab, useGameUIStore } from '@/store/useGameUIStore';

import { GameMessageList } from './GameMessageList';

export const GameConsole = () => {
  useBuffListener();
  useGroupListener();
  useMapListener();
  usePlaceListener();
  useRegeneration();
  useSelfMessage();
  useHeroListener();
  useQueueCraftListener();
  useBattleListener();

  const { consoleActiveTab, setConsoleActiveTab } = useGameUIStore();
  const battleId = useHero((state) => state?.battleId ?? '');
  return (
    <Tabs
      onValueChange={(e) => {
        setConsoleActiveTab(e as ConsoleActiveTab);
      }}
      defaultValue={consoleActiveTab}
      className="bg-background/80 backdrop-blur-xs h-[250px] gap-1"
    >
      <TabsList className="rounded-none">
        <TabsTrigger value="CHAT">chat</TabsTrigger>
        <TabsTrigger value="SYS">sys</TabsTrigger>
        <TabsTrigger disabled={!battleId} value="LOG">
          log
        </TabsTrigger>
      </TabsList>
      <ScrollArea className="h-full min-h-0">
        <TabsContent value="CHAT">Make changes to your account here.</TabsContent>
        <TabsContent value="SYS">
          <GameMessageList />
        </TabsContent>
        <TabsContent value="LOG">
          <BattleLogList />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};
