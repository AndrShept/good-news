export const socketEvents = {
  groupInvite: () => 'group:invite',
  groupInvited: (toHeroId: string) => `group:invited-${toHeroId}`,

};
