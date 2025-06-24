<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <nav-bar
        :u_n="user_name"
        :selectedRole="userRole"
        @logout="logout"
    ></nav-bar>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="portal-container">
        <div
            class="portal"
            @click="goToCultivation"
            :style="{
            opacity: !userRole ? '0.5' : '1',
            cursor: !userRole ? 'not-allowed' : 'pointer'
          }"
        >
          <div class="portal-content">
            <h3>自我修炼</h3>
            <p v-if="!userRole">请先选择角色</p>
          </div>
        </div>

        <div
            class="portal"
            @click="goToAdventure"
            :style="{
            opacity: !userRole ? '0.5' : '1',
            cursor: !userRole ? 'not-allowed' : 'pointer'
          }"
        >
          <div class="portal-content">
            <h3>出去冒险</h3>
            <p v-if="!userRole">请先选择角色</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 角色选择弹窗 -->
    <role-select-modal
        v-if="showRoleModal"
        @confirm="confirmRoleSelection"
        @cancel="closeRoleModal"
        :visible="showRoleModal"
    ></role-select-modal>
  </div>
</template>

<script>
// 脚本部分不变
import RoleSelectModal from '@/components/RoleSelectModal/RoleSelectModal.vue';
import NavBar from '@/components/NavBar/NavBar.vue';

export default {
  name: 'HomeView',
  components: { RoleSelectModal, NavBar },
    data() {
      return {
        allRoles: [],
        isSpinning: false,
        spinInterval: null,
        spinSpeed: 50,
        maxSpeed: 20,
        acceleration: 2,
        currentPosition: 0,
        selectedRole: null,
        spinCount: 0,
        totalSpins: 20,
        loading: true,
        errorMessage: '',
        apiLog: ''
      };
    },
    methods: {
      getCultivationText(level) {
        const cultivationLevels = {
          1: '练气期',
          2: '大帝期',
          3: '上神期'
        };
        return cultivationLevels[level] || `未知境界 (${level})`;
      },

      startSpin() {
        if (this.isSpinning || !this.allRoles.length) return;

        this.isSpinning = true;
        this.spinCount = 0;
        this.spinSpeed = 50;
        this.currentPosition = 0;

        this.spinInterval = setInterval(() => {
          this.spinCount++;

          if (this.spinSpeed > this.maxSpeed) {
            this.spinSpeed -= this.acceleration;
          }

          this.currentPosition += 1;
          if (this.currentPosition >= this.allRoles.length) {
            this.currentPosition = 0;
          }

          const viewport = this.$refs.slotViewport;
          const itemHeight = 60;
          viewport.style.transform = `translateY(-${this.currentPosition * itemHeight}px)`;

          if (this.spinCount > this.totalSpins) {
            this.spinSpeed += this.acceleration / 2;
            if (this.spinSpeed > 100) {
              this.stopSpin();
            }
          }
        }, this.spinSpeed);
      },

      stopSpin() {
        if (!this.isSpinning) return;

        clearInterval(this.spinInterval);
        this.isSpinning = false;
        this.selectedRole = this.allRoles[this.currentPosition];
      },

      confirm() {
        if (!this.selectedRole) return;
        this.$emit('confirm', this.selectedRole);
      },

      cancel() {
        if (this.isSpinning) {
          this.stopSpin();
        }
        this.$emit('cancel');
      },

      async fetchAllRoles() {
        this.loading = true;
        this.errorMessage = '';

        try {
          const response = await this.$axios.post('/roles');
          this.apiLog = `roles接口响应: ${JSON.stringify(response.data)}`;
          console.log('角色API响应:', response.data);

          this.allRoles = response.data || [];

          if (this.allRoles.length > 0) {
            this.allRoles = [...this.allRoles, ...this.allRoles, ...this.allRoles];
          }

          console.log('角色数据加载成功，共', this.allRoles.length, '个角色');
        } catch (error) {
          this.errorMessage = '获取角色列表失败，请检查网络连接';
          console.error('获取角色列表失败:', error);

          if (error.response) {
            this.errorMessage = `请求错误: ${error.response.status} - ${error.response.statusText}`;
          } else if (error.request) {
            this.errorMessage = '网络错误，服务器未响应';
          } else {
            this.errorMessage = '请求处理失败: ' + error.message;
          }
        } finally {
          this.loading = false;
        }
      }
    },
    mounted() {
      console.log('RoleSelectModal 组件已挂载');
      console.log(this.visible)
      this.fetchAllRoles();
    },
    beforeUnmount() {
      if (this.spinInterval) {
        clearInterval(this.spinInterval);
      }
      console.log('RoleSelectModal 组件已卸载');
    }
};
</script>

<style scoped>
/* 核心修改：添加垂直居中逻辑 */
.home-container {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/bg-home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  padding: 0 20px; /* 移除固定上下边距，改用flex布局居中 */
  box-sizing: border-box;
  width: 100%;
  min-height: 0; /* 允许内容撑开高度 */
}

.portal-container {
  display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}

.portal {
  position: relative;
  width: 280px;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

/* 背景图片样式不变 */
.portal:nth-child(1) {
  background-image: url('@/assets/self-cultivate.png');
  background-size: cover;
  background-position: center;
}

.portal:nth-child(2) {
  background-image: url('@/assets/go-advanture.png');
  background-size: cover;
  background-position: center;
}

.portal-content {
  position: relative;
  z-index: 2;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 25px;
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .portal-container {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .portal {
    width: 100%;
    max-width: 300px;
  }
}
</style>