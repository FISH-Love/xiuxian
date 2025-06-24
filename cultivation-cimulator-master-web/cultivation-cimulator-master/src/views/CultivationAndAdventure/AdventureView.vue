<template>
  <div class="battle-container">
    <!-- 战斗背景 -->
    <div class="battle-bg" :style="{ backgroundImage: `url(${bgImageUrl})` }"></div>

    <!-- 战斗遮罩层 -->
    <div class="battle-overlay"></div>

    <!-- 顶部标题 -->
    <div class="battle-header">
      <h1>遇袭</h1>
      <div class="battle-info">
        <div class="battle-timer">00:30</div>
        <div class="battle-round">回合: {{ round }}</div>
      </div>
    </div>

    <!-- 战斗区域 -->
    <div class="battle-area">
      <!-- 敌人信息 -->
      <div class="enemy-container">
        <div class="enemy-info">
          <div class="enemy-name">火焰兽</div>
          <div class="enemy-hp">
            <div ref="enemyHpBar" class="hp-bar" :class="enemyHpClass" :style="{ width: enemyPercentHp + '%' }">
              <div class="hp-text">{{ enemyCurrentHP }}/{{ enemyMaxHP }}</div>
            </div>
          </div>
          <div class="enemy-level">Lv.{{ enemyLevel }}</div>
        </div>
        <div class="enemy-sprite">
          <img src="@/assets/enemy.jpg" alt="火焰兽" class="enemy-image" />
        </div>
      </div>

      <!-- 战斗效果区域 -->
      <div class="battle-effects">
        <div v-if="showDamageText" class="damage-text">{{ damageValue }}</div>
      </div>

      <!-- 角色信息 -->
      <div class="player-container">
        <div class="player-sprite">
          <img src="@/assets/player.jpg" alt="玩家角色" class="player-image" />
        </div>
        <div class="player-info">
          <div class="player-name">{{ userRole?.name || '洛克' }}</div>
          <div class="player-hp">
            <div ref="playerHpBar" class="hp-bar" :class="playerHpClass" :style="{ width: playerPercentHp + '%' }">
              <div class="hp-text">{{ playerCurrentHP }}/{{ playerMaxHP }}</div>
            </div>
          </div>
          <div class="player-level">Lv.{{ userRole?.level || '10' }}</div>
        </div>
      </div>
    </div>

    <!-- 技能栏 -->
    <div class="skill-bar">
      <div class="skill-btn" @click="useSkill(1)" :disabled="!isPlayerTurn || isSkillDisabled">
        <div class="skill-icon"><i class="fa fa-hand-rock-o"></i></div>
        <div class="skill-name">普攻</div>
      </div>
      <div class="skill-btn" @click="useSkill(2)" :disabled="!isPlayerTurn || isSkillDisabled">
        <div class="skill-icon"><i class="fa fa-bolt"></i></div>
        <div class="skill-name">元素战技</div>
      </div>
      <div class="skill-btn" @click="useSkill(3)" :disabled="!isPlayerTurn || isSkillDisabled">
        <div class="skill-icon"><i class="fa fa-fire"></i></div>
        <div class="skill-name">元素爆发</div>
      </div>
      <div class="skill-btn" @click="escapeBattle" :disabled="!isPlayerTurn || isSkillDisabled">
        <div class="skill-icon"><i class="fa fa-sign-out"></i></div>
        <div class="skill-name">逃跑</div>
      </div>
    </div>

    <!-- 战斗日志 -->
    <div class="battle-log">
      <h3>战斗日志</h3>
      <div class="log-messages">
        <p v-for="(message, index) in battleMessages" :key="index">{{ message }}</p>
      </div>
    </div>

    <!-- 大招台词显示 -->
    <div v-if="showUltimateLine" class="ultimate-line">
      <div class="line-content">{{ ultimateLine }}</div>
    </div>

    <!-- 战斗结果弹窗 -->
    <div v-if="battleResult" class="result-modal">
      <div class="result-content">
        <h2>{{ battleResult === 'win' ? '胜利！' : '失败！' }}</h2>
        <p>{{ battleResult === 'win' ? '你击败了火焰兽！' : '你被火焰兽击败了...' }}</p>
        <button @click="closeResultModal">返回</button>
      </div>
    </div>

    <!-- 回合提示 -->
    <div v-if="isPlayerTurn && !battleResult" class="turn-indicator player-turn">
      <div class="turn-text">你的回合</div>
    </div>
    <div v-else-if="!isPlayerTurn && !battleResult" class="turn-indicator enemy-turn">
      <div class="turn-text">敌人回合</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: null,
      bgImageUrl: require('@/assets/bg-battle.webp'),
      enemyCurrentHP: 100,
      playerCurrentHP: 100,
      enemyMaxHP: 100,
      playerMaxHP: 100,
      enemyLevel: 15,
      showDamageText: false,
      damageValue: '',
      battleMessages: [],
      showUltimateLine: false,
      ultimateLine: '',
      skills: [
        { id: 1, name: '普攻', damage: 20, mpCost: 0, type: 1 },
        { id: 2, name: '元素战技', damage: 50, mpCost: 15, type: 2 },
        { id: 3, name: '元素爆发', damage: 100, mpCost: 30, type: 3 }
      ],
      battleResult: null,
      mp: 100,
      isSkillDisabled: false,
      isPlayerTurn: true,
      isBattlePaused: false,
      round: 1,
      playerActionDone: false,
      enemyActionDone: false
    }
  },
  created() {
    try {
      const userRoleStr = this.$route.query.userRole;
      if (userRoleStr) {
        this.userRole = JSON.parse(userRoleStr);
        this.playerMaxHP = this.userRole.hp || 100;
        this.playerCurrentHP = this.playerMaxHP;
      } else {
        console.error('未传递角色数据');
      }
      this.initBattle();
    } catch (error) {
      console.error('解析角色数据失败:', error);
      this.initBattle();
    }
  },
  computed: {
    enemyPercentHp() {
      if (this.enemyMaxHP <= 0) return 0;
      return Math.round((this.enemyCurrentHP / this.enemyMaxHP) * 100);
    },
    playerPercentHp() {
      if (this.playerMaxHP <= 0) return 0;
      return Math.round((this.playerCurrentHP / this.playerMaxHP) * 100);
    },
    enemyHpClass() {
      const percent = this.enemyPercentHp;
      return percent > 70 ? 'high' : percent > 30 ? 'medium' : 'low';
    },
    playerHpClass() {
      const percent = this.playerPercentHp;
      return percent > 70 ? 'high' : percent > 30 ? 'medium' : 'low';
    }
  },
  methods: {
    initBattle() {
      this.isPlayerTurn = true;
      this.round = 1;
      this.playerActionDone = false;
      this.enemyActionDone = false;
      this.battleMessages = [`第 ${this.round} 回合开始！\n你遇到了火焰兽！准备战斗！`];
    },

    useSkill(skillId) {
      if (!this.isPlayerTurn || this.isBattlePaused || this.battleResult) return;

      const skill = this.skills.find(s => s.id === skillId);
      if (!skill) return;

      if (this.mp < skill.mpCost) {
        this.battleMessages.push(`魔法值不足，无法使用 ${skill.name}！`);
        return;
      }

      this.mp = Math.max(0, this.mp - skill.mpCost);
      this.battleMessages.push(`你使用了 ${skill.name}！`);

      const damage = Math.floor(Math.random() * 10) + skill.damage;
      this.enemyCurrentHP = Math.max(0, this.enemyCurrentHP - damage);
      this.addHpAnimation('enemy');

      this.showDamageText = true;
      this.damageValue = `-${damage}`;
      this.playerActionDone = true;
      this.isSkillDisabled = true;

      if (this.enemyCurrentHP <= 0) {
        this.battleMessages.push('你击败了火焰兽！');
        this.battleResult = 'win';
        return;
      }

      if (skill.type === 3) {
        this.showUltimateLine = true;
        this.ultimateLine = '感受元素的怒火吧！';
        setTimeout(() => this.showUltimateLine = false, 3000);
      }

      setTimeout(() => {
        this.showDamageText = false;
        this.processEnemyTurn();
      }, 1000);
    },

    processEnemyTurn() {
      if (this.battleResult) return;

      this.isPlayerTurn = false;
      this.isBattlePaused = true;

      setTimeout(() => {
        const damage = Math.floor(Math.random() * 15) + 20;
        this.playerCurrentHP = Math.max(0, this.playerCurrentHP - damage);
        this.addHpAnimation('player');

        this.battleMessages.push(`火焰兽对你造成了 ${damage} 点伤害！`);
        this.showDamageText = true;
        this.damageValue = `-${damage}`;
        this.enemyActionDone = true;

        if (this.playerCurrentHP <= 0) {
          this.battleMessages.push('你被火焰兽击败了...');
          this.battleResult = 'lose';
          this.showDamageText = false;
          return;
        }

        setTimeout(() => {
          this.showDamageText = false;
          this.endCurrentRound();
        }, 1000);
      }, 1000);
    },

    endCurrentRound() {
      if (this.battleResult) return;

      this.round++;
      this.battleMessages.push(`第 ${this.round} 回合开始！`);

      this.isPlayerTurn = true;
      this.playerActionDone = false;
      this.enemyActionDone = false;
      this.isBattlePaused = false;
      this.isSkillDisabled = false;
    },

    escapeBattle() {
      if (!this.isPlayerTurn || this.isBattlePaused) return;

      this.battleMessages.push('你尝试逃跑...');
      const success = Math.random() > 0.5;

      setTimeout(() => {
        if (success) {
          this.battleMessages.push('你成功逃离了战斗！');
          // 跳转到逃跑界面
          this.$router.push('/escape');
        } else {
          this.battleMessages.push('逃跑失败！');
          this.processEnemyTurn();
        }
      }, 2000);
    },

    closeResultModal() {
      this.$router.back();
    },

    addHpAnimation(type) {
      this.$nextTick(() => {
        const hpBar = this.$refs[type === 'player' ? 'playerHpBar' : 'enemyHpBar'];
        if (hpBar) {
          hpBar.classList.add('decreasing');
          setTimeout(() => hpBar.classList.remove('decreasing'), 500);
        }
      });
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.battle-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

/* 战斗背景图样式 */
.battle-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: -2;
}

/* 战斗遮罩层 */
.battle-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

/* 战斗标题 */
.battle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.battle-header h1 {
  margin: 0;
  color: #ffcc00;
  font-size: 24px;
  text-shadow: 0 0 8px rgba(255, 204, 0, 0.6);
}

.battle-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.battle-timer {
  background: rgba(0, 0, 0, 0.7);
  padding: 5px 15px;
  border-radius: 5px;
  font-weight: bold;
}

.battle-round {
  background: rgba(0, 0, 0, 0.7);
  padding: 5px 15px;
  border-radius: 5px;
  font-weight: bold;
  margin-top: 5px;
  color: white;
}

/* 战斗区域 */
.battle-area {
  position: relative;
  height: 50vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
}

/* 敌人容器 */
.enemy-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.enemy-info {
  background: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 10px;
  width: 200px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.enemy-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

/* 敌我HP样式 */
.player-hp, .enemy-hp {
  height: 18px;
  background: #f3f4f6;
  border-radius: 9px;
  overflow: hidden;
  margin: 5px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) inset;
}

.hp-bar {
  height: 100%;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.hp-text {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 11px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  line-height: 18px;
}

/* HP条颜色状态 */
.hp-bar.high {
  background: linear-gradient(90deg, #4CAF50, #66bb6a);
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.hp-bar.medium {
  background: linear-gradient(90deg, #FFC107, #ffd54f);
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}

.hp-bar.low {
  background: linear-gradient(90deg, #F44336, #ef5350);
  box-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
}

/* 血量减少动画 */
.hp-bar.decreasing {
  animation: hpDecrease 0.5s ease-in-out;
}

@keyframes hpDecrease {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.enemy-level {
  text-align: right;
  color: #666;
  font-size: 12px;
  margin-top: 5px;
}

.enemy-sprite {
  position: relative;
}

.enemy-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  animation: float 3s ease-in-out infinite;
}

/* 玩家容器 */
.player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-sprite {
  position: relative;
  margin-bottom: 10px;
}

.player-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  animation: float 3s ease-in-out infinite;
}

.player-info {
  background: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 10px;
  width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.player-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.player-level {
  text-align: right;
  color: #666;
  font-size: 12px;
  margin-top: 5px;
}

/* 战斗效果 */
.battle-effects {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.damage-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff4d4f;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  animation: damagePopup 1s ease-out forwards;
}

/* 技能栏 */
.skill-bar {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.6);
}

.skill-btn {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill-btn:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.skill-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.skill-icon {
  font-size: 24px;
  color: #ffcc00;
  margin-bottom: 5px;
}

.skill-name {
  font-size: 12px;
  color: white;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}

/* 战斗日志 */
.battle-log {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 15px;
  max-height: 150px;
  overflow-y: auto;
}

.battle-log h3 {
  margin-top: 0;
  color: #ffcc00;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 5px;
}

.log-messages {
  max-height: 100px;
  overflow-y: auto;
}

.log-messages p {
  margin: 5px 0;
  font-size: 14px;
}

/* 大招台词 */
.ultimate-line {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #ffcc00;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.5);
  animation: fadeIn 0.5s ease-out forwards;
  z-index: 10;
}

.line-content {
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.8);
}

/* 战斗结果弹窗 */
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.result-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.5s ease-out forwards;
}

.result-content h2 {
  color: #333;
  margin-bottom: 10px;
}

.result-content p {
  color: #666;
  margin-bottom: 20px;
}

.result-content button {
  background: #ffcc00;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-content button:hover {
  background: #ffdd57;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 回合指示器 */
.turn-indicator {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 20px;
  font-weight: bold;
  z-index: 10;
  animation: pulse 2s infinite;
}

.player-turn {
  background: rgba(76, 175, 80, 0.8);
  color: white;
}

.enemy-turn {
  background: rgba(244, 67, 54, 0.8);
  color: white;
}

.turn-text {
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

/* 动画效果 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes damagePopup {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
  50% { transform: translate(-50%, -80%) scale(1.2); opacity: 1; }
  100% { transform: translate(-50%, -100%) scale(1); opacity: 0; }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translate(-50%, -20px); }
  100% { opacity: 1; transform: translate(-50%, 0); }
}

@keyframes pulse {
  0% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
  100% { transform: translateX(-50%) scale(1); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .battle-area {
    flex-direction: column;
    height: 60vh;
  }

  .enemy-container, .player-container {
    width: 100%;
  }

  .enemy-image, .player-image {
    width: 120px;
    height: 120px;
  }

  .skill-bar {
    flex-wrap: wrap;
  }

  .skill-btn {
    width: 60px;
    height: 60px;
  }

  .skill-icon {
    font-size: 18px;
  }

  .skill-name {
    font-size: 10px;
  }

  .ultimate-line {
    font-size: 18px;
    padding: 10px 20px;
  }

  .turn-indicator {
    font-size: 16px;
    padding: 8px 16px;
  }
}
</style>