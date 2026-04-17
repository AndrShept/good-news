import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buildingTemplateById } from '@/shared/templates/building-template';
import { npcTemplateById } from '@/shared/templates/npc-template';
import { useSelectPlaceEntitiesStore } from '@/store/useSelectPlaceEntitiesStore';
import { ComponentProps, memo } from 'react';

interface Props extends Omit<ComponentProps<'button'>, 'id' | 'name' | 'type'> {
  id?: string;
  type?: 'NPC' | 'BUILDING';
  image?: string;
  name?: string;
  isActive: boolean;
  isMobile: boolean;
  disabled: boolean;
}

export const PlaceSidebarButton = memo(({ id, type, name, image, disabled, isActive, isMobile, className, ...props }: Props) => {
  const setSelectedPlaceEntities = useSelectPlaceEntitiesStore((state) => state.setSelectedPlaceEntities);
  const npc = id ? npcTemplateById[id] : undefined;
  const building = id ? buildingTemplateById[id] : undefined;
  const btnName = name ?? npc?.name ?? building?.name;
  const btnImage = image ?? npc?.image ?? building?.image;
  const handleClick = () => {
    if (!id || !type) return;

    switch (type) {
      case 'NPC':
        setSelectedPlaceEntities({ type: 'NPC', payload: npc! });

        break;
      case 'BUILDING':
        setSelectedPlaceEntities({ type: 'BUILDING', payload: building! });

        break;
    }
  };
  return (
    <Button
      onClick={handleClick}
      {...props}
      disabled={disabled}
      className={cn('h-8.5 w-full gap-0.5  text-[13px] ', className, {
        'justify-start': isMobile,
        'size-12': !isMobile,
      })}
      variant={isActive ? 'secondary' : 'ghost'}
      size={isMobile ? 'icon' : 'default'}
    >
      <GameIcon
        className={cn('size-7.5', {
          'size-8.5': !isMobile,
        })}
        image={btnImage}
      />
      {isMobile ? btnName : ''}
    </Button>
  );
});
