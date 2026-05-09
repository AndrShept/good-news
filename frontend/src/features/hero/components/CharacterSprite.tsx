interface Props {
  src: string;
  scale?: number;
}
export const CharacterSprite = ({ src, scale }: Props) => {
  return (
    <div className="my-auto flex size-40 overflow-hidden">
      <img
        draggable={false}
        className="m-auto size-full object-contain"
        src={src}
        alt="hero-image"
        style={{ imageRendering: 'pixelated', height: `${scale ? 160 * scale : undefined}px` }}
      />
    </div>
  );
};
