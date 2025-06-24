<template>
  <div id="app">
    <!-- 苹果风格底部导航栏 -->
    <nav class="navbar">
      <div class="navbar-items">
        <router-link to="/home" class="nav-item" :class="{ active: $route.path === '/home' }">
          <i class="fa fa-home"></i>
          <span>首页</span>
        </router-link>
        <router-link to="/cultivation" class="nav-item" :class="{ active: $route.path === '/cultivation' }">
          <i class="fa fa-leaf"></i>
          <span>修炼</span>
        </router-link>
        <router-link to="/adventure" class="nav-item" :class="{ active: $route.path === '/adventure' }">
          <i class="fa fa-compass"></i>
          <span>冒险</span>
        </router-link>
        <router-link to="/battle" class="nav-item" :class="{ active: $route.path === '/battle' }">
          <i class="fa fa-crosshairs"></i>
          <span>战斗</span>
        </router-link>
      </div>
    </nav>

    <router-view class="main-content" />
  </div>
</template>

<script>
export default {
  // 无额外逻辑
}
</script>

<style>
/* 苹果风格底部导航栏 */
.navbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;
  height: 70px;
  z-index: 100;

  /* 毛玻璃效果 */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  /* 阴影效果 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);

  display: flex;
  justify-content: center;
  align-items: center;
}

/* 导航项容器 */
.navbar-items {
  display: flex;
  width: 100%;
  justify-content: space-around;
  padding: 0 15px;
}

/* 导航项 */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  font-size: 12px;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 12px;
  min-width: 60px;

  /* 文字阴影 */
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

/* 图标样式 */
.nav-item i {
  font-size: 20px;
  margin-bottom: 4px;
}

/* 导航项悬停效果 */
.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 导航项激活状态 */
.nav-item.active {
  color: #63B3ED; /* 蓝色选中态 */
  background: rgba(255, 255, 255, 0.1);
}

/* 主内容区域（避免被导航栏遮挡） */
.main-content {
  padding-bottom: 100px; /* 根据导航栏高度调整 */
}

/* 响应式调整 */
@media (max-width: 480px) {
  .navbar {
    width: 95%;
    height: 60px;
    border-radius: 16px;
    bottom: 15px;
  }

  .nav-item {
    min-width: 50px;
    padding: 6px 8px;
    font-size: 10px;
  }

  .nav-item i {
    font-size: 18px;
  }

  .main-content {
    padding-bottom: 85px;
  }
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

#app {
  min-height: 100vh;
}
</style>