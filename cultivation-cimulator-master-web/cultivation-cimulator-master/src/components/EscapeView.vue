<template>
  <div class="escape-container">
    <!-- 水墨背景 -->
    <div class="ink-bg"></div>

    <!-- 主内容区 -->
    <div class="escape-content">
      <!-- 标题 -->
      <div class="escape-title">
        <span>遁</span>
      </div>

      <!-- 逃跑提示 -->
      <div class="escape-message">
        <p>你施展遁术，成功逃离了战斗</p>
        <p class="escape-subtext">留得青山在，不怕没柴烧</p>
      </div>

      <!-- 水墨装饰元素 -->
      <div class="ink-decoration top"></div>
      <div class="ink-decoration bottom"></div>

      <!-- 返回按钮 -->
      <button class="return-btn" @click="goBack">
        <span>返回</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EscapeView',
  methods: {
    goBack() {
      this.$router.push('/home'); // 返回首页
    }
  }
}
</script>

<style scoped>
/* 水墨风格逃跑界面 */
.escape-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f5f0; /* 宣纸底色 */
  overflow: hidden;
  font-family: 'Ma Shan Zheng', cursive;
}

/* 水墨背景 - 使用CSS渐变替代图片 */
.ink-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f5f0 0%, #e8e0d0 100%);
  opacity: 1;
  z-index: -1;
}

.ink-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
      radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.05) 5%, transparent 30%),
      radial-gradient(circle at 70% 60%, rgba(0, 0, 0, 0.05) 5%, transparent 30%),
      radial-gradient(circle at 40% 80%, rgba(0, 0, 0, 0.03) 3%, transparent 20%);
  opacity: 0.3;
}

/* 主内容区 */
.escape-content {
  position: relative;
  width: 80%;
  max-width: 600px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

/* 标题样式（毛笔字效果） */
.escape-title {
  position: relative;
  font-size: 80px;
  color: #333;
  margin-bottom: 30px;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
  font-family: 'Ma Shan Zheng', cursive;
}

.escape-title span {
  position: relative;
  z-index: 2;
  display: inline-block;
  padding: 0 15px;
}

.escape-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 12px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2), transparent);
  z-index: 1;
  border-radius: 50%;
}

/* 提示信息 */
.escape-message {
  text-align: center;
  margin-bottom: 40px;
  color: #555;
  font-size: 24px;
  line-height: 1.6;
  font-family: 'Ma Shan Zheng', cursive;
}

.escape-subtext {
  font-size: 18px;
  color: #777;
  margin-top: 10px;
}

/* 水墨装饰元素 - 使用CSS渐变替代图片 */
.ink-decoration {
  position: absolute;
  width: 100%;
  height: 150px;
  opacity: 0.08;
}

.ink-decoration.top {
  top: -50px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));
  transform: rotate(-5deg);
}

.ink-decoration.bottom {
  bottom: -50px;
  background: linear-gradient(to top, transparent, rgba(0, 0, 0, 0.1));
  transform: rotate(5deg);
}

/* 返回按钮 */
.return-btn {
  background: none;
  border: 2px solid #333;
  color: #333;
  padding: 12px 30px;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-family: 'Ma Shan Zheng', cursive;
}

.return-btn:hover {
  background: #333;
  color: white;
  transform: translateY(-3px);
}

.return-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.5s ease;
}

.return-btn:hover::before {
  left: 100%;
}

/* 动画效果 */
@keyframes inkFade {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.escape-content {
  animation: inkFade 0.8s ease-out forwards;
}

/* 水墨粒子效果 */
.escape-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image:
      radial-gradient(circle at 10% 20%, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
      radial-gradient(circle at 80% 40%, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
      radial-gradient(circle at 40% 70%, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
      radial-gradient(circle at 90% 80%, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 100px 100px;
  opacity: 0.3;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .escape-title {
    font-size: 60px;
  }

  .escape-message {
    font-size: 20px;
  }

  .escape-subtext {
    font-size: 16px;
  }

  .return-btn {
    padding: 10px 20px;
    font-size: 16px;
  }
}
</style>