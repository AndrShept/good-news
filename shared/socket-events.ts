export const socketEvents = {
  groupInvite: () => 'group:invite',
  groupInvited: (toHeroId: string) => `group:invited-${toHeroId}`,
  joinRoom: () => `join:room`,
  leaveRoom: () => `leave:room`,
  groupSysMessages: () => `group:sys-messages`,
  groupUpdated: () => `group:updated`,
  actionWalkTownComplete: () => `action:walk-town-complete`,
  actionWalkMapComplete: () => `action:walk-map-complete`,
};
