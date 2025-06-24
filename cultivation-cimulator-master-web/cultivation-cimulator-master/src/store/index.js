// src/store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    player: {
      id: 8,
      name: "昂羽道徒",
      hp: 100,
      def: 10,
      atk: 10,
      cultivation: 1,
      exp: 100,
      life_span: 100,
      TemDef: 0  // 临时防御
    },
    enemy: {
      id: 1,
      name: "小怪",
      hp: 2105,
      def: 215,
      atk: 215,
      cultivation: 2,
      exp: 1014,
      life_span: 1000,
      TemDef: 0  // 临时防御
    },
    isBattle: true,
    battleLog: ["战斗开始!"],
    isPlayerTurn: true,
    isActionDisabled: false
  },
  mutations: {
    // 玩家攻击
    PLAYER_ATTACK(state) {
      const damage = Math.max(1,
          state.player.atk - state.enemy.def - (state.enemy.TemDef || 0)
      )
      state.enemy.hp -= damage
      state.battleLog.push(`${state.player.name} 攻击 ${state.enemy.name}，造成 ${damage} 点伤害！`)
    },
    // 玩家防御
    PLAYER_DEFEND(state) {
      state.player.TemDef = 10
      state.battleLog.push(`${state.player.name} 进入防御状态，临时防御+10！`)
    },
    // 敌人攻击
    ENEMY_ATTACK(state) {
      const damage = Math.max(1,
          state.enemy.atk - state.player.def - (state.player.TemDef || 0)
      )
      state.player.hp -= damage
      state.battleLog.push(`${state.enemy.name} 攻击 ${state.player.name}，造成 ${damage} 点伤害！`)
    },
    // 重置临时防御
    RESET_TEMP_DEF(state) {
      state.player.TemDef = 0
      state.enemy.TemDef = 0
    },
    // 切换回合
    SWITCH_TURN(state) {
      state.isPlayerTurn = !state.isPlayerTurn
    },
    // 检查战斗结束
    CHECK_BATTLE_END(state) {
      if (state.player.hp <= 0) {
        state.battleLog.push(`${state.player.name} 战败！`)
        state.isBattle = false
      } else if (state.enemy.hp <= 0) {
        state.battleLog.push(`${state.enemy.name} 被击败！`)
        state.isBattle = false
      }
    },
    // 更新操作禁用状态
    SET_ACTION_DISABLED(state, isDisabled) {
      state.isActionDisabled = isDisabled
    }
  },
  actions: {
    playerAttack({ commit, state }) {  // 解构出 state
      if (!state.isPlayerTurn || !state.isBattle) return

      commit('PLAYER_ATTACK')
      commit('CHECK_BATTLE_END')
      commit('SWITCH_TURN')
      commit('SET_ACTION_DISABLED', true)  // 使用正确的 mutation

      setTimeout(() => {
        commit('SET_ACTION_DISABLED', false)
        if (state.isBattle) {  // 从参数中获取 state
          commit('ENEMY_ATTACK')
          commit('CHECK_BATTLE_END')
          commit('RESET_TEMP_DEF')
          commit('SWITCH_TURN')
        }
      }, 1000)
    },

    playerDefend({ commit, state }) {  // 解构出 state
      if (!state.isPlayerTurn || !state.isBattle) return

      commit('PLAYER_DEFEND')
      commit('CHECK_BATTLE_END')
      commit('SWITCH_TURN')
      commit('SET_ACTION_DISABLED', true)  // 使用正确的 mutation

      setTimeout(() => {
        commit('SET_ACTION_DISABLED', false)
        if (state.isBattle) {  // 从参数中获取 state
          commit('ENEMY_ATTACK')
          commit('CHECK_BATTLE_END')
          commit('RESET_TEMP_DEF')
          commit('SWITCH_TURN')
        }
      }, 1000)
    }
  }
})