export const socketEvents = {
  groupInvite: () => 'group:invite',
  groupInvited: (toHeroId: string) => `group:invited-${toHeroId}`,
  groupUpdated: () => `group:updated`,
  groupSysMessages: () => `group:sys-messages`,
  joinRoom: () => `join:room`,
  leaveRoom: () => `leave:room`,
  actionWalkTownComplete: () => `action:walk-town-complete`,
  actionWalkMapComplete: () => `action:walk-map-complete`,
  mapUpdate: () => `update:map`,
  townUpdate: () => `update:town`,
};
