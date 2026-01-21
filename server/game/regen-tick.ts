import { serverState } from "./state/server-state"

export const regenTick = (now: number) => {
  for (const [heroId, hero] of serverState.hero.entries()) {
    const delta = now - hero.regen.lastUpdate
    if (delta <= 0 || hero.state === 'BATTLE') continue
    console.log('healthTimeMs', hero.regen.healthTimeMs)
    if (hero.currentHealth < hero.maxHealth) {
      hero.regen.healthAcc += delta / hero.regen.healthTimeMs

      const gain = Math.floor(hero.regen.healthAcc)
      if (gain > 0) {
        hero.currentHealth = Math.min(
          hero.currentHealth + gain,
          hero.maxHealth
        )
        hero.regen.healthAcc -= gain
      }
    }

    hero.regen.lastUpdate = now
    console.log(hero.currentHealth)
    console.log(hero.regen.healthAcc)
    console.log('delta', delta)
  }
}
