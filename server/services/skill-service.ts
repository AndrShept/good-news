import { HTTPException } from "hono/http-exception"
import { serverState } from "../game/state/server-state"
import { heroService } from "./hero-service"
import { skillTemplateByKey, type SkillKey } from "@/shared/templates/skill-template"
import { skillExpConfig } from "../lib/config/skill-exp-config"
import type { SkillUpData } from "@/shared/socket-data-types"
import { io } from ".."
import { socketEvents } from "@/shared/socket-events"


export const skillService = {

  getSkillById(heroId: string, skillId: string) {

    const skills = serverState.skill.get(heroId)
    const skill = skills?.find(s => s.id === skillId)
    if (!skill) throw new HTTPException(404, { message: 'skill not found!' })
    return skill

  },
  getSkillByKey(heroId: string, key: SkillKey) {
    const skillTemplate = skillTemplateByKey[key]
    const skills = serverState.skill.get(heroId)
    const skill = skills?.find(s => s.skillTemplateId === skillTemplate.id)
    if (!skill) throw new HTTPException(404, { message: 'skill not found!' })
    return skill

  },

  getExpSkillToNextLevel(skillKey: SkillKey, skillLevel: number) {
    return Math.floor(100 * Math.pow(skillLevel, skillExpConfig[skillKey].difficultyMultiplier));
  },

  setSkillExp(heroId: string, skillKey: SkillKey, amount: number) {
    const skill = this.getSkillByKey(heroId, skillKey)
    const expToLevel = this.getExpSkillToNextLevel(skillKey, skill.level)
    skill.currentExperience += amount

    const result = {
      message: `Your gain skill ${skillKey.toLowerCase()}  ${amount} EXP`,
      isLevelUp: false
    }

    if (skill.currentExperience >= expToLevel) {
      skill.level++
      skill.currentExperience = 0
      skill.expToLvl = this.getExpSkillToNextLevel(skillKey, skill.level)
      result.message = `Congtatulation! your  skill ${skillKey.toLowerCase()} up to level ${skill.level} 🔥`
      result.isLevelUp = true
    }
    if (result.isLevelUp) {
      const socketData: SkillUpData = {
        type: 'SKILL_UP',
        payload: { skillInstanceId: skill.id, message: result.message }
      }
      io.to(heroId).emit(socketEvents.selfData(), socketData)

    }


  },

  checkSkillRequirement() { },

}
