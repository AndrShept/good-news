import { imageConfig } from '@/shared/config/image-config';
import { ComponentProps } from 'react';

import { GameIcon } from './GameIcon';
import { Button } from './ui/button';

type Props = ComponentProps<'button'> & {};
export const BackButton = ({ ...props }: Props) => {
  return (
    <Button {...props}>
      {/* <GameIcon className="size-4.5" image={imageConfig.icon.ui.back} /> */}
      {'<'} Back
    </Button>
  );
};
