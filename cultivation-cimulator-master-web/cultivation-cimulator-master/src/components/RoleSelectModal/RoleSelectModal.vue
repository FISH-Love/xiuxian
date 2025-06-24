<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <nav-bar
        :userName="user_name"
    :selectedRole="userRole"
    @logout="logout"
    ></nav-bar>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="portal-container">
        <div class="portal" @click="goToCultivation">
          <div class="portal-content">
            <h3>自我修炼</h3>
            <p v-if="!userRole">请先选择角色</p>
          </div>
        </div>
        <div class="portal" @click="goToAdventure">
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
export default {
  data() {
    return {
      user_name: '',
      showRoleModal: false,
      userRole: null
    };
  },
  created() {
    // 从路由获取角色（如果有）
    const userRoleStr = this.$route.query.userRole;
    if (userRoleStr) {
      this.userRole = JSON.parse(userRoleStr);
    }

    // 没有角色时显示弹窗
    if (!this.userRole) {
      this.showRoleModal = true;
    }
  },
  methods: {
    confirmRoleSelection(role) {
      this.userRole = role;
      this.showRoleModal = false;
    },
    closeRoleModal() {
      this.showRoleModal = false;
    },
    goToCultivation() {
      if (!this.userRole) {
        this.showRoleModal = true;
        return;
      }
      // 其他逻辑...
    }
  }
};
</script>