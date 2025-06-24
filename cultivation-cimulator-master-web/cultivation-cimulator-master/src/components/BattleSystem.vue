<template>
  <div class="battle-container">
    <h1>修真回合制战斗系统</h1>

    <h2 v-if="isBattle">{{ isPlayerTurn ? '你的回合' : `${enemy.name}的回合` }}</h2>
    <h2 v-else>战斗结束</h2>

    <div class="battle-field">
      <div class="player-panel">
        <h3>{{ player.name }}</h3>
        <p>HP: {{ player.hp }}</p>
        <p>ATK: {{ player.atk }}</p>
        <p>DEF: {{ player.def + player.TemDef }}</p>
        <p>等级: {{ player.cultivation }}</p>

        <div class="player-actions" v-if="isPlayerTurn && player.hp > 0 && isBattle">
          <button @click="playerAttack" :disabled="isActionDisabled">攻击</button>
          <button @click="playerDefend" :disabled="isActionDisabled">防御</button>
        </div>
      </div>

      <div class="enemy-panel">
        <h3>{{ enemy.name }}</h3>
        <p>HP: {{ enemy.hp }}</p>
        <p>ATK: {{ enemy.atk }}</p>
        <p>DEF: {{ enemy.def + enemy.TemDef }}</p>
        <p>等级: {{ enemy.cultivation }}</p>
      </div>
    </div>

    <div class="battle-log">
      <h3>战斗日志</h3>
      <ul>
        <li v-for="(log, index) in battleLog" :key="index">{{ log }}</li>
      </ul>
    </div>

    <button v-if="!isBattle" @click="restartBattle">重新开始战斗</button>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  setup() {
    const store = useStore()

    const player = computed(() => store.state.player)
    const enemy = computed(() => store.state.enemy)
    const isBattle = computed(() => store.state.isBattle)
    const battleLog = computed(() => store.state.battleLog)
    const isPlayerTurn = computed(() => store.state.isPlayerTurn)
    const isActionDisabled = computed(() => store.state.isActionDisabled)

    const playerAttack = () => {
      store.dispatch('playerAttack')
    }

    const playerDefend = () => {
      store.dispatch('playerDefend')
    }

    const restartBattle = () => {
      store.commit('player', {
        id: 8,
        name: "昂羽道徒",
        hp: 100,
        def: 10,
        atk: 10,
        cultivation: 1,
        exp: 100,
        life_span: 100,
        TemDef: 0
      })

      store.commit('enemy', {
        id: 1,
        name: "羽翔大帝",
        hp: 2105,
        def: 215,
        atk: 215,
        cultivation: 2,
        exp: 1014,
        life_span: 1000,
        TemDef: 0
      })

      store.commit('isBattle', true)
      store.commit('battleLog', ["战斗开始!"])
      store.commit('isPlayerTurn', true)
      store.commit('isActionDisabled', false)
    }

    return {
      player,
      enemy,
      isBattle,
      battleLog,
      isPlayerTurn,
      isActionDisabled,
      playerAttack,
      playerDefend,
      restartBattle
    }
  }
}
</script>

<style scoped>
.battle-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.battle-field {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.player-panel, .enemy-panel {
  flex: 1;
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
}
.player-panel {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}
.enemy-panel {
  background-color: #fff2e8;
  border: 1px solid #ffa891;
}
.player-actions {
  margin-top: 15px;
}
button {
  padding: 8px 16px;
  margin-right: 10px;
  background-color: #4096ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.battle-log {
  margin: 20px;
  padding: 15px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #f9f9f9;
}
</style>