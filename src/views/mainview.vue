<script setup>
import {ref} from 'vue'
import ComOne from "@components/ComOne/ComOne.vue";
import ComTwo from "@components/ComTwo/ComTwo.vue";
import CesiumViewer from "@components/CesiumViewer/CesiumViewer.vue";
import ArgoLayer from "@components/argo/ArgoLayer.vue";

const showArgoLayer = ref(true); // 控制 ArgoLayer 是否显示

// 切换显示状态的函数
function toggleArgoLayer() {
  showArgoLayer.value = !showArgoLayer.value;
}
</script>

<template>
  <main>
    <!-- 导航链接 -->
    <section class="nav-links">
      <router-link to="/">退出</router-link>
      <router-link :to="{name:'argoinfo'}">Argo信息</router-link>
    </section>

    <!-- 按钮 -->
    <button @click="toggleArgoLayer" style="position:fixed; top:50px; right:50px; z-index:1200;"
            class="nav-links">
      {{ showArgoLayer ? '隐藏 ArgoLayer' : '显示 ArgoLayer' }}
    </button>

    <div class="main-container">
      <!-- 左面板 -->
      <div class="left-panel">
        <!-- 左面板内容（可为空或其他内容） -->
      </div>

      <!-- 右面板 -->
      <div class="right-panel">
        <CesiumViewer></CesiumViewer>

        <!-- 悬浮的 ArgoLayer，依据显示状态 -->
        <div v-if="showArgoLayer" class="floating-argo-layer">
          <ArgoLayer></ArgoLayer>
        </div>

        <!-- Argo信息面板 -->
        <Transition name="panel-slide">
          <RouterView v-if="$route.name === 'argoinfo'" class="argo-info-panel"/>
        </Transition>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* 其他样式保持不变 */
.nav-links {
  position: fixed;
  top: 5px;
  right: 50px;
  z-index: 1000;
  display: flex;
  gap: 15px;
  padding: 10px 15px;
  background: rgb(99, 149, 245);
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.96);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.96);
}

.nav-links a {
  color: rgba(0, 0, 0, 0.96);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #1a3d5f;
}

.main-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.right-panel {
  position: relative;
}


/* 新增动画关键帧 */
@keyframes panelSlideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes panelSlideOut {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

/* 修改面板容器样式 */
.argo-info-panel {
  position: absolute;
  left: 0; /* 对齐左面板右侧 */
  top: 0;
  width: 40%;
  height: 100%;
  background: #6395f5;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow: hidden;
}

/* Vue过渡类 */
.panel-slide-enter-active {
  animation: panelSlideIn var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-slide-leave-active {
  animation: panelSlideOut var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1);
}


.right-panel {
  flex: 5;
  min-width: 83%;
  height: 100%;
  position: relative;
}

/* 确保Cesium容器填满空间 */
.right-panel ::v-deep #container {
  height: 100%;
  width: 100%;
}


/* 右面板样式 */
.right-panel {
  flex: 1; /* 使用全部宽度 */
  min-width: 83%;
  height: 100%;
  position: relative;
}

/* 让 Cesium 容器占满空间 */
.right-panel ::v-deep #container {
  height: 100%;
  width: 100%;
}

/* 悬浮的 ArgoLayer 样式 */

.floating-argo-layer {
  position: absolute;
  top: 20px;
  left: 0px;
  width: 250px;
  background: rgb(7, 114, 253);
  box-shadow: 0 4px 12px rgba(248, 243, 243, 0.2);
  border-radius: 8px;
  padding: 10px;
  z-index: 1001;
  bottom: 20px;
}
</style>