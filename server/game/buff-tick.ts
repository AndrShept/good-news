import type { RemoveBuffData } from "@/shared/socket-data-types"
import { serverState } from "./state/server-state"
import { io } from ".."
import { socketEvents } from "@/shared/socket-events"
import { heroService } from "../services/hero-service"


export const buffTick = (now: number) => {

  for (let [heroId, buffs] of serverState.buff.entries()) {
    for (let i = buffs.length - 1; i >= 0; i--) {
      const buff = buffs[i]
      if (buff.expiresAt <= now) {
        const socketData: RemoveBuffData = {
          type: 'REMOVE_BUFF',
          payload: { buffInstanceId: buff.id }
        }
        buffs.splice(i, 1)
        io.to(heroId).emit(socketEvents.selfData(), socketData)
        heroService.updateModifier(heroId)

      }
    }

  }

}
