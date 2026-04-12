import { GameIcon } from '@/components/GameIcon';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { useNpcMessageStore } from '@/store/useNpcMessageStore';

interface Props {
  name: string;
  image: string;
}
export const NpcGreeting = ({ image, name }: Props) => {
  const message = useNpcMessageStore((state) => state.message);
  return (
    <div className="flex gap-2">
      <GameIcon className="md:size-30 sm:size-25 size-20" image={image} />
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl capitalize">{name}</h2>
        <TypingAnimation typeSpeed={10} className="text-muted-foreground leading-6" cursorStyle="block">
          {message}
        </TypingAnimation>
      </div>
    </div>
  );
};
