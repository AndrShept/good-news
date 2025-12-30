export const socketEvents = {
  selfData: () => `self:data`,
  selfMessage: () => 'self:message',
  groupInvite: () => 'group:invite',
  groupInvited: (toHeroId: string) => `group:invited-${toHeroId}`,
  groupUpdated: () => `group:updated`,
  groupSysMessages: () => `group:sys-messages`,
  joinRoom: () => `join:room`,
  leaveRoom: () => `leave:room`,
  mapUpdate: () => `update:map`,
  walkMap: () => `walk:map`,
  placeUpdate: () => `update:place`,
  queueCraft: () => 'queue:craft',
};
