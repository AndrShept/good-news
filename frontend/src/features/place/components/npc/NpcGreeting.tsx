import { GameIcon } from '@/components/GameIcon';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { NPCType } from '@/shared/types';
import { useNpcStore } from '@/store/useNpcStore';

interface Props {
  name: string;
  image: string;
  type: NPCType;
}
export const NpcGreeting = ({ image, name, type }: Props) => {
  const message = useNpcStore((state) => state.message);
  return (
    <div className="flex gap-2">
      <GameIcon className="md:size-30 sm:size-25 size-20" image={image} />
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl capitalize">{name}</h2>
        <p className="text-orange-400">{type}</p>
        <TypingAnimation typeSpeed={10} className="text-muted-foreground leading-6" cursorStyle="block">
          {message}
        </TypingAnimation>
      </div>
    </div>
  );
};
