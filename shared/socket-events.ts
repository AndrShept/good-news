export const socketEvents = {
  partyInvite: () => 'party:invite',
  partyInvited: (toHeroId: string) => `party:invited-${toHeroId}`,
};
