import { imageConfig } from '@/shared/config/image-config';


export const Temple = () => {
  return (
    <section className="flex flex-col items-center gap-2">
      <div className="relative aspect-video max-w-[850px] overflow-hidden rounded-2xl border">
        <img className="size-full object-cover" src={imageConfig.bg.shrine} alt="" />
      </div>
    </section>
  );
};
