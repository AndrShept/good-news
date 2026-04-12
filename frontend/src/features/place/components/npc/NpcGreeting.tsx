import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { parentVariants } from '@/lib/config';
import { NPC } from '@/shared/types';


interface Props {
  npc: NPC;
}
export const NpcGreeting = ({ npc }: Props) => {
  const radomIndex = Math.floor(Math.random() * npc.greetings.length);
  return (
    <div className="flex gap-2">
      <GameIcon className="md:size-30 sm:size-25 size-20" image={npc.image} />
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl capitalize">{npc.name}</h2>
        <TypingAnimation typeSpeed={10} className="text-muted-foreground leading-6" cursorStyle="block">
          {npc.greetings[radomIndex]}
        </TypingAnimation>
      </div>
     
    </div>
  );
};
