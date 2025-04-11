export const parentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.3, staggerDirection: -1 } },
};
export const childrenVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 2 },
};
