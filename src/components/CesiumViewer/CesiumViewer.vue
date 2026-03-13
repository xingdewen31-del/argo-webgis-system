<script setup>
import {onMounted, ref, watch, computed, onBeforeUnmount} from "vue";
import Button from "primevue/button";
import 'cesium/Build/Cesium/Widgets/widgets.css';
import CesiumBegin from "./js/CesiumBegin.js";
import {
  BOA,
  TianWMTSimg,
  header,
  meta,
  CoordinateDisplay,
  WMSsvectorlayer,
  CoffeeBelt
} from "./js/CesiumImageryLayers.js";
import useStore, {usePlatformStore} from "@stores/mainstore.js";
import {storeToRefs} from "pinia";
import * as Cesium from 'cesium';

const store = useStore();
let viewer = ref(null);
let {viewer_store} = storeToRefs(store);
let {filterSelections} = storeToRefs(store);
let currentLayer = computed(() => store.layer);

// +++ 新增视频球体相关变量 +++
const videoElement = ref(null);
const showVideoSphere = ref(false);
let videoSphere = null;
const videoPosition = ref([120.2052342, 30.2489634, 10000]); // 球体初始位置 [经度, 纬度, 高度]
const videoSphereRadius = ref(3000); // 球体半径
const showVideoOverlay = ref(true);
watch(currentLayer, (newVal) => {
  if (newVal === 'null') {
    viewer.value.destroy();
    viewer.value = CesiumBegin.cbing('container', './assets/cesium');
    TianWMTSimg.addTianWMTSimg(viewer.value);
    meta.addmeta(viewer.value, store.filterSelections);
    coordDisplayDestroyer = CoordinateDisplay.initialize(viewer.value, {});

    // +++ 重新创建视频球体 +++
    if (showVideoSphere.value) {
      createVideoSphere();
    }
  } else {
    BOA.addBOA(viewer.value, newVal);
    console.log(newVal);
  }
});
const createVideoSphere = async () => {
  if (!viewer.value || !videoElement.value) return;

  // 确保视频已加载
  await new Promise((resolve) => {
    if (videoElement.value.readyState >= 3) {
      resolve();
    } else {
      videoElement.value.onloadeddata = resolve;
    }
  });

  // 移除现有球体
  if (videoSphere) {
    viewer.value.entities.remove(videoSphere);
  }

  // 创建新球体
  videoSphere = viewer.value.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
        videoPosition.value[0],
        videoPosition.value[1],
        videoPosition.value[2]
    ),
    ellipsoid: {
      radii: new Cesium.Cartesian3(
          videoSphereRadius.value,
          videoSphereRadius.value,
          videoSphereRadius.value
      ),
      material: videoElement.value,
    },
    show: showVideoSphere.value
  });
};

// +++ 修改视频球体切换函数 +++
const toggleVideoSphere = () => {
  showVideoSphere.value = !showVideoSphere.value;

  if (showVideoSphere.value) {
    // 显示视频控件
    videoElement.value.style.display = 'block';
    createVideoSphere();
    viewer.value.trackedEntity = videoSphere;
  } else {
    // 隐藏视频控件
    videoElement.value.style.display = 'none';
    if (videoSphere) {
      viewer.value.entities.remove(videoSphere);
      videoSphere = null;
    }
    viewer.value.trackedEntity = undefined;
  }
};
// +++ 修改球体位置更新函数 +++
const updateVideoPosition = () => {
  const lng = parseFloat(document.getElementById('lngInput').value);
  const lat = parseFloat(document.getElementById('latInput').value);
  const height = parseFloat(document.getElementById('heightInput').value);

  videoPosition.value = [lng, lat, height];

  if (videoSphere && showVideoSphere.value) {
    videoSphere.position = Cesium.Cartesian3.fromDegrees(lng, lat, height);
    // 更新后重新追踪球体
    viewer.value.trackedEntity = videoSphere;
  }
};

// +++ 修改球体半径更新函数 +++
const updateVideoRadius = () => {
  const radius = parseFloat(document.getElementById('radiusInput').value);
  videoSphereRadius.value = radius;

  if (videoSphere && showVideoSphere.value) {
    // 保持球体中心位置不变
    const position = videoSphere.position.getValue();

    // 先移除旧球体
    viewer.value.entities.remove(videoSphere);

    // 创建新球体
    videoSphere = viewer.value.entities.add({
      position: position,
      ellipsoid: {
        radii: new Cesium.Cartesian3(radius, radius, radius),
        material: videoElement.value,
      },
      show: true
    });

    // 重新追踪球体
    viewer.value.trackedEntity = videoSphere;
  }
};


let a = ref(true);
let b = ref(true);
const rectangleDegrees = ref([-120, -20.0, 70.0, 45.0]); // 使用ref包装

// 响应矩形范围变化
watch(rectangleDegrees, (newVal) => {
  if (coffeeBeltController) {
    coffeeBeltController.destroy();
  }
  // 重新创建 CoffeeBelt
  coffeeBeltController = CoffeeBelt.create(viewer.value, newVal, numRectangles, heightInterval, outlineStyle);
}, {deep: true});

function spilt() {
  if (a.value) {
    WMSsvectorlayer.addWMSsvectorlayer(
        viewer.value,
        "http://localhost:8080/geoserver/argo_project/wms",
        "argo_project:argometa",
        "",
        "1=1",
        true
    );
    a.value = false;
  } else {
    WMSsvectorlayer.removeExistingLayers(viewer.value);
    a.value = true;
  }
}

function parsePlatformInfo(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const rows = doc.querySelectorAll('tr');
  const info = {};

  rows.forEach(row => {
    const tds = row.querySelectorAll('td');
    if (tds.length === 2) {
      const key = tds[0].textContent.trim().toLowerCase();
      const value = tds[1].textContent.trim();
      info[key] = value;
    }
  });

  return info;
}

const outlineStyle = {
  width: 2,
  color: Cesium.Color.RED
};
const numRectangles = 5;
const heightInterval = 500;
let coffeeBeltController = null;

function coffe() {
  if (b.value) {
    // 确保控制器存在
    if (!coffeeBeltController) {
      coffeeBeltController = CoffeeBelt.create(
          viewer.value,
          rectangleDegrees.value,
          numRectangles,
          heightInterval,
          outlineStyle
      );
    }
    coffeeBeltController.toggleLimit(true);
    coffeeBeltController.toggleBounds(true);
    b.value = false;
  } else {
    if (coffeeBeltController) {
      coffeeBeltController.toggleLimit(false);
      coffeeBeltController.toggleBounds(false);
    }
    b.value = true;
  }
}

const storea = usePlatformStore();
const debounceRefresh = ((func) => {
  let timer;
  return (viewer, params) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(viewer, params), 300);
  };
})(meta.addmeta);

watch(
    () => store.filterSelections,
    (newVal) => {
      debounceRefresh(viewer.value, newVal);
    },
    {deep: true}
);

let coordDisplayDestroyer = null;

onMounted(() => {
  viewer.value = CesiumBegin.cbing('container', './assets/cesium');
  viewer_store.value = viewer;
  TianWMTSimg.addTianWMTSimg(viewer.value);
  meta.addmeta(viewer.value, store.filterSelections);
  coordDisplayDestroyer = CoordinateDisplay.initialize(viewer.value, {});

  coffeeBeltController = CoffeeBelt.create(
      viewer.value,
      rectangleDegrees.value,
      numRectangles,
      heightInterval,
      outlineStyle
  );

  coffeeBeltController.toggleLimit(false);
  coffeeBeltController.toggleBounds(false);

  const handler = viewer.value.screenSpaceEventHandler;
  handler.setInputAction((event) => {
    const entity = viewer.value.selectedEntity;
    if (entity) {
      if (entity.id !== 'None' || entity.id !== 'Loading...') {
        const htmlTable = viewer.value.selectedEntity.description._value;
        const platformInfo = parsePlatformInfo(htmlTable);
        storea.setPlatformInfo({
          platformNumber: platformInfo.platformnumber
        });
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
});


onBeforeUnmount(() => {
  if (coffeeBeltController) {
    coffeeBeltController.destroy();
  }
  if (viewer.value && !viewer.value.isDestroyed()) {
    viewer.value.destroy();
  }
});

// 更新矩形范围的函数
function updateRectangleDegrees() {
  const west = parseFloat(document.getElementById('westInput').value);
  const south = parseFloat(document.getElementById('southInput').value);
  const east = parseFloat(document.getElementById('eastInput').value);
  const north = parseFloat(document.getElementById('northInput').value);

  rectangleDegrees.value = [west, south, east, north];

  // 如果咖啡带当前是显示状态，更新后保持显示
  if (!b.value && coffeeBeltController) {
    coffeeBeltController.toggleLimit(true);
    coffeeBeltController.toggleBounds(true);
  }
}

const viewMode = ref('2.5D'); // 初始为2.5D

function toggleViewMode() {
  if (viewMode.value === '2.5D') {
    viewMode.value = '3D';
    // 切换到3D模式
    viewer.value.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
  } else if (viewMode.value === '3D') {
    viewMode.value = '2D';
    // 切换到2D模式
    viewer.value.scene.mode = Cesium.SceneMode.SCENE2D;
  } else {
    viewMode.value = '2.5D';
    // 切换到2.5D（例如，科幻视角或默认模式）
    viewer.value.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW; // 你可以自定义你的2.5D为哪种设置
  }
}

watch(
    () => store.filterSelections,
    (newVal) => {
      console.log('筛选条件更新：', JSON.parse(JSON.stringify(newVal)));
    },
    {deep: true}
);
// +++ 添加视频控制函数 +++
const toggleVideoPlay = () => {
  if (videoElement.value.paused) {
    videoElement.value.play();
  } else {
    videoElement.value.pause();
  }
};

const restartVideo = () => {
  videoElement.value.currentTime = 0;
  videoElement.value.play();
};

function toggleVideoOverlay() {

  showVideoOverlay.value = !showVideoOverlay.value;
  if (showVideoOverlay.value) {
    videoElement.value.style.display = 'block';
    createVideoSphere();
    viewer.value.trackedEntity = videoSphere;
  } else {
    // 隐藏视频控件
    videoElement.value.style.display = 'none';

    viewer.value.trackedEntity = undefined;
  }
}

</script>

<template>
  <section id="container">
    <header class="fixed-top text-info text-right fs-4 w-63">
      <slot></slot>

    </header>
    <video
        ref="videoElement"
        src="D:\LJSfinal\vue-untitled - 副本\src\video\屏幕录制 2025-06-04 092224.mp4"
        controls
        muted
        loop
        crossorigin="anonymous"
        class="video-overlay"
        style="position: absolute; bottom: 20px; left: 20px; width: 300px; z-index: 1000; display: none;"
    ></video>
    <div class="input-container mt-3" style="position: fixed; top: 5%; right:1%; width: 15%; z-index: 1000;">
      <!-- 地图控制区域 -->
      <br>
      <br>
      <div class="control-section mb-4 p-2" style="background: rgb(99,149,245); border-radius: 5px;">
        <h6 class="mb-2">显示视频球体</h6>
        <div class="input-group mb-2">
          <span class="input-group-text">经度（longitude）</span>
          <input id="lngInput" type="number" class="form-control" :value="videoPosition[0]">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text">纬度(latitude)</span>
          <input id="latInput" type="number" class="form-control" :value="videoPosition[1]">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text">高度(height)</span>
          <input id="heightInput" type="number" class="form-control" :value="videoPosition[2]">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text">半径(radius)</span>
          <input id="radiusInput" type="number" class="form-control" :value="videoSphereRadius">
        </div>
        <div class="d-grid gap-2">
          <Button @click="updateVideoPosition" class="btn-sm" style="background: #14e889;">更新球体位置</Button>
          <Button @click="updateVideoRadius" class="btn-sm" style="background: #14e889;">更新球体半径</Button>
          <Button @click="toggleVideoSphere" class="btn-sm" style="background: #14e889;">
            {{ showVideoSphere ? '隐藏' : '显示' }}视频球体
          </Button>
          <Button @click="toggleVideoOverlay" class="btn-sm" style="background: #14e889;">
            {{ showVideoOverlay ? '隐藏' : '显示' }}播放控件
          </Button>
          <Button @click="toggleVideoPlay" class="btn-sm" style="background: #14e889;">
            {{ videoElement?.paused ? '播放视频' : '暂停播放' }}
          </Button>
          <Button @click="restartVideo" class="btn-sm" style="background: #14e889;">重播视频</Button>
        </div>
      </div>
      <div class="control-section mb-4 p-2" style="background: rgb(99,149,245); border-radius: 5px;">
        <h6 class="mb-2">地图控制</h6>
        <div class="input-group mb-2">
          <span class="input-group-text">西经</span>
          <input id="westInput" type="number" class="form-control" :value="rectangleDegrees[0]">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text">南纬</span>
          <input id="southInput" type="number" class="form-control" :value="rectangleDegrees[1]">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text">东经</span>
          <input id="eastInput" type="number" class="form-control" :value="rectangleDegrees[2]">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text">北纬</span>
          <input id="northInput" type="number" class="form-control" :value="rectangleDegrees[3]">
        </div>
        <div class="d-grid gap-2">
          <Button @click="updateRectangleDegrees" class="btn-sm" style="background: #14e889;">更新范围</Button>
          <Button @click="spilt" class="btn-sm" style="background: #14e889;">分屏显示</Button>
          <Button @click="toggleViewMode" class="btn-sm" style="background: #14e889;">
            视图: {{ viewMode }}
          </Button>
          <Button @click="coffe" class="btn-sm" style="background: #14e889;">
            {{ b ? '显示' : '隐藏' }}条带
          </Button>
        </div>
      </div>
      <!-- 视频球体控制区域 -->

    </div>
  </section>
</template>

<style scoped>

.video-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 300px;
  z-index: 1000;
}

:deep(.p-button) {
  border: none !important;
  box-shadow: none !important; /* 可额外去除阴影 */
}

.input-container {
  margin-top: 20px;
  z-index: 1000; /* 确保输入框显示在最上层 */
}

.input-group {
  max-width: 450px;
  margin: 0 auto;
}

.form-control {
  width: 100%; /* 让输入框占满父容器的宽度 */
}

.w-63 {
  width: 63% !important;
}

.w-5 {
  width: 5% !important;
}

.fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
}

.fixed-righta {
  position: fixed;
  top: 0;
  right: 0;
  left: 90%;
  z-index: 1030;
}

.fixed-rightb {
  position: fixed;
  top: 0;
  right: 0;
  left: 95%;
  z-index: 1030;
}

.text-right {
  text-align: right !important;
}

.control-section {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-group-text {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
}

.form-control {
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}

.d-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
</style>