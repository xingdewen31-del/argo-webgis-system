<script setup>
import {computed, ref, watch} from "vue";
import {storeToRefs} from "pinia"
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import useStore from "@stores/mainstore.js";
import {meta} from "@components/CesiumViewer/js/CesiumImageryLayers.js";

const store = useStore();
const {filterSelections, Data} = storeToRefs(store);

const years = ref([
  2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014,
  2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
]);
const year = ref(null);
const month = ref(null);
const months = ref(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);
const features = ref([
  {name: "温度", code: 'BOAtemp'},
  {name: "盐度", code: 'BOAsalt'}
]);

const Fmodels = ref(['APEX', 'ARVOR_D', 'HM4000', 'NINJA_D', 'SOLO_D', 'SOLO_D_MRV', 'XUANWU']);
const DACs = ref(['美国', '英国', '法国', '中国（1）', '澳大利亚', '日本', '韩国（1）', '韩国（2）', '加拿大', '中国（2）']);
const Dyears = ref(Array.from({length: 26}, (_, i) => 2000 + i));

const splitIndex = computed(() => Math.ceil(Dyears.value.length / 2));
const leftYears = computed(() => Dyears.value.slice(0, splitIndex.value));
const rightYears = computed(() => Dyears.value.slice(splitIndex.value));

const feature = ref(null);
const layerName = computed(() => `${feature.value || ''}${year.value || ''}${month.value || ''}`);
const isFormValid = computed(() => year.value && month.value && feature.value);

const selectedYears = ref([...filterSelections.value.years]);
const selectedFmodel = ref([...filterSelections.value.fmodels]);
const selectedDACs = ref([...filterSelections.value.dacs]);
const statusCounts = ref({active: 0, inactive: 0});

const updateLayerName = () => {
  store.setLayerName(layerName.value);
  console.log('图层名称已更新：', layerName.value);
};

const clearLayerName = () => {
  year.value = null;
  month.value = null;
  feature.value = 'null';
  store.setLayerName(layerName.value);
  console.log('选择已清除:', layerName.value);
};

const selectedActive = computed({
  get: () => store.filterSelections.Active,
  set: (val) => store.updateFilterSelections({Active: val})
});

const selectedInactive = computed({
  get: () => store.filterSelections.Inactive,
  set: (val) => store.updateFilterSelections({Inactive: val})
});

watch(
    () => ({
      years: store.filterSelections.years,
      fmodels: store.filterSelections.fmodels,
      dacs: store.filterSelections.dacs,
      Active: store.filterSelections.Active,
      Inactive: store.filterSelections.Inactive
    }),
    async (params) => {
      try {
        const counts = await meta.getStatusCounts(params);
        statusCounts.value = counts;
      } catch (error) {
        console.error("操作失败:", error);
      }
    },
    {deep: true, immediate: true}
);

watch(selectedYears, (newVal) => {
  store.updateFilterSelections({years: newVal});
});
watch(selectedFmodel, (newVal) => {
  store.updateFilterSelections({fmodels: newVal});
});
watch(selectedDACs, (newVal) => {
  store.updateFilterSelections({dacs: newVal});
});
watch(selectedActive, (newVal) => {
  store.updateFilterSelections({Active: newVal});
});
watch(selectedInactive, (newVal) => {
  store.updateFilterSelections({Inactive: newVal});
});

const selectedBasemap = ref(null);
const basemapOptions = ref([
  {label: '天地图', value: 'tianditu'},
  {label: '大气卫星影像图', value: 'satellite'},
  {label: '海洋卫星影像图', value: 'ocean'}
]);

import * as Cesium from "cesium";

const switchBasemap = () => {
  if (!viewer) return;

  // 清除所有图层
  viewer.imageryLayers.removeAll();

  switch (selectedBasemap.value) {
    case 'tianditu':
      viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.gov.cn/img_w/wmts?tk=d80f5e4789cf0981e5ac85f62fa4f8b4",
        layer: 'img',
        style: 'default',
        tileMatrixSetID: 'w',
        format: 'tiles',
        maximumLevel: 18,
        credit: 'Tianditu',
      }));
      break;

    case 'satellite':
      viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        credit: 'Esri Satellite'
      }));
      break;

    case 'ocean':
      viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer',
        credit: 'Esri Ocean'
      }));
      break;

    default:
      console.warn("未选择有效底图类型");
  }
};
const clearBasemap = () => {
  if (!viewer) return;
  viewer.imageryLayers.removeAll();
  selectedBasemap.value = null;
  console.log("底图已移除");
};


</script>

<template>
  <div class="scroll-container">
    <h2>Argo测量数据可视化平台</h2>

    <h5>加载BOA图层</h5>
    <div class="filter-row">
      <FloatLabel variant="on" class="d-inline">
        <Select v-model="year" :options="years" checkmark/>
        <label>年份</label>
      </FloatLabel>

      <FloatLabel variant="on" class="d-inline">
        <Select v-model="month" :options="months" checkmark/>
        <label>月份</label>
      </FloatLabel>

      <FloatLabel variant="on" class="d-inline">
        <Select
            v-model="feature"
            :options="features"
            option-label="name"
            option-value="code"
            checkmark
        />
        <label>类型</label>
      </FloatLabel>
    </div>

    <div class="mt-3">
      <Button label="生成" :disabled="!isFormValid" @click="updateLayerName"/>
      <Button label="移除" :disabled="!isFormValid" @click="clearLayerName"/>
    </div>

    <!-- ✅ 底图切换模块 -->
    <h5>底图切换</h5>
    <div class="filter-row">
      <FloatLabel variant="on" class="d-inline">
        <Select
            v-model="selectedBasemap"
            :options="basemapOptions"
            option-label="label"
            option-value="value"
            checkmark
        />
        <label>底图类型</label>
      </FloatLabel>
    </div>
    <Button label="切换" :disabled="!selectedBasemap" @click="switchBasemap"/>
    <Button label="移除" :disabled="!selectedBasemap" @click="clearBasemap"/>


    <h5>海洋浮标状态</h5>
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <Checkbox v-model="selectedActive" id="Active" :binary="true"/>
        <label for="Active" class="select-none">活跃状态： {{ statusCounts.active }}</label>
      </div>

      <div class="flex items-center gap-2">
        <Checkbox v-model="selectedInactive" id="Inactive" :binary="true"/>
        <label for="Inactive" class="select-none">离线状态： {{ statusCounts.inactive }}</label>
      </div>
    </div>

    <div class="mt-3">
      <h5>数据中心 (DAC)</h5>
      <div
          v-for="DAC in DACs"
          :key="DAC"
          class="flex items-center gap-2"
      >
        <Checkbox v-model="selectedDACs" :id="DAC" :value="DAC"/>
        <label :for="DAC" class="select-none">{{ DAC }}</label>
      </div>
    </div>
  </div>
</template>


<style scoped>
.scroll-container {
  height: 90%;
  overflow-y: auto;
  padding: 16px;
  background: rgb(7, 114, 253); /* 半透明淡蓝背景 */
  backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgb(7, 114, 253);
  font-family: "Segoe UI", sans-serif;
  color: #fff;
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

h5 {
  color: #14e889;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 1rem;
}

.d-inline {
  flex: 1;
  min-width: 160px;
}

button.p-button {
  margin-right: 10px;
  margin-top: 8px;
  background-color: #14e889;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

button.p-button:hover {
  background-color: #14e889;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 0.5rem;
}

.select-none {
  user-select: none;
  font-size: 14px;
  color: #f5f5f5;
}

.mt-3 {
  margin-top: 1.25rem;
}

.gap-8 {
  gap: 2rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

</style>
