<template>
  <div>
    <div ref="cesiumContainer" class="cesium-container"></div>
    <video
        ref="videoElement"
        src="D:\LJSfinal\vue-untitled - 副本\src\video\期末.mp4"
        controls
        muted
        loop
        crossorigin="anonymous"
        class="video-overlay"
    ></video>

    <div class="control-panel">
      <button @click="toggleClockSync">
        {{ clockSync ? 'Disable' : 'Enable' }} Clock Sync
      </button>
      <button @click="toggleImageRepeat">
        {{ isRepeating ? 'Disable' : 'Enable' }} Image Repeat
      </button>
      <button @click="toggleVideoOverlay">
        {{ showVideoOverlay ? 'Hide' : 'Show' }} Video Overlay
      </button>
    </div>
  </div>
</template>

<script>
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import CesiumBegin from "@components/CesiumViewer/js/CesiumBegin.js";
import {CoffeeBelt} from "@components/CesiumViewer/js/CesiumImageryLayers.js";
import {ref} from "vue";

export default {
  name: "CesiumVideoSphere",
  data() {
    return {
      viewer: null,
      sphere: null,
      synchronizer: null,
      clockSync: false,
      isRepeating: true,
      showVideoOverlay: true,
    };
  },
  mounted() {
    this.initCesium();
  },
  beforeUnmount() {
    this.cleanup();
  },

  methods: {
    async initCesium() {
      try {
        // 正确初始化 Cesium Viewer

        this.viewer = await CesiumBegin.cbing(this.$refs.cesiumContainer, './assets/cesium');
        // 获取视频元素引用
        const videoElement = this.$refs.videoElement;

        // 确保视频已加载
        await new Promise((resolve) => {
          videoElement.onloadeddata = resolve;
          if (videoElement.readyState >= 3) resolve(); // 如果已加载则立即解析
        });

        // 创建视频球体
        this.sphere = this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(-79, 39, 1000),
          ellipsoid: {
            radii: new Cesium.Cartesian3(1000, 1000, 1000),
            material: videoElement,
          },
        });

        this.viewer.trackedEntity = this.sphere;

        // 设置材质重复属性
        this.sphere.ellipsoid.material.repeat = new Cesium.CallbackProperty(
            () => {
              return this.isRepeating
                  ? new Cesium.Cartesian2(8, 8)
                  : new Cesium.Cartesian2(1, 1);
            },
            false
        );

        // 错误处理
        this.viewer.scene.renderError.addEventListener(() => {
          if (!videoElement.paused) videoElement.pause();
          this.viewer.cesiumWidget.showErrorPanel(
              "This browser does not support cross-origin WebGL video textures.",
              "",
              ""
          );
        });
      } catch (error) {
        console.error("Cesium initialization failed:", error);
      }
    },

    toggleClockSync() {
      this.clockSync = !this.clockSync;

      if (this.synchronizer) {
        this.synchronizer.destroy();
        this.synchronizer = null;
        this.$refs.videoElement.playbackRate = 1.0;
        return;
      }

      this.synchronizer = new Cesium.VideoSynchronizer({
        clock: this.viewer.clock,
        element: this.$refs.videoElement,
      });
    },

    toggleImageRepeat() {
      this.isRepeating = !this.isRepeating;
    },

    toggleVideoOverlay() {
      this.showVideoOverlay = !this.showVideoOverlay;
      this.$refs.videoElement.style.display = this.showVideoOverlay
          ? "block"
          : "none";
    },

    cleanup() {
      if (this.viewer && !this.viewer.isDestroyed()) {
        this.viewer.destroy();
      }
      if (this.synchronizer) {
        this.synchronizer.destroy();
      }
    }
  }
};
</script>

<style scoped>
.cesium-container {
  width: 100%;
  height: 80vh;
  position: relative;
}

.video-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 300px;
  z-index: 1000;
}

.control-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 12px;
  background: rgba(40, 40, 40, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: rgba(80, 80, 80, 0.9);
}
</style>