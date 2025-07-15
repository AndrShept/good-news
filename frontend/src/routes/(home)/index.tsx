import { RainbowButton } from '@/components/magicui/rainbow-button';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { TextEffect } from '@/components/ui/text-effect';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as m from 'motion/react-m';

export const Route = createFileRoute('/(home)/')({
  component: RouteComponent,

});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <section className="flex-co flex flex-1">
      <m.div
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex w-full max-w-[500px] flex-col items-center justify-center gap-14"
      >
        <SparklesText sparklesCount={2} className="scroll-m-20 text-balance text-center text-6xl font-extrabold tracking-tight">
          MAGIC WORLD
          <TextEffect className="text-muted-foreground" delay={1} speedReveal={0.4} per="word" as="h3" preset="blur">
            BEST GAME EVER
          </TextEffect>
        </SparklesText>
        <m.div
          transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.5 }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full max-w-[160px] flex-col items-center justify-center gap-6"
        >
          <RainbowButton onClick={() => navigate({ to: '/game' })} className="h-12 w-full">
            PLAY
          </RainbowButton>
          {/* <RainbowButton variant={'outline'} className="w-full">
            REGISTER
          </RainbowButton> */}
        </m.div>
      </m.div>
    </section>
  );
}
