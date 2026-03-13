<template>
  <div class="argo-info-panel">
    <!-- 关闭按钮 -->
    <button class="close-btn" @click="closePanel">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>

    <!-- 加载遮罩 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>加载浮标数据中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
      <button @click="retryLoad">重试</button>
    </div>

    <!-- TAB导航 -->
    <div class="tab-nav">
      <!--      <div>Platform Number: {{ platformNumber || '未选择' }}</div>-->
      <button
          v-for="tab in ['list', 'metadata', 'chart']"
          :key="tab"
          :class="{ active: activeTab === tab }"
          @click="switchTab(tab)"
      >
        {{ tab === 'list' ? '浮标列表' : tab === 'metadata' ? '详细信息' : '数据图表' }}
      </button>
    </div>

    <!-- 浮标列表 -->
    <div v-show="activeTab === 'list'" class="scroll-container">
      <div class="buoy-list">
        <div
            v-for="buoy in buoyList"
            :key="buoy.platformNumber + '-' + buoy.cycleNumber"
            :class="{ 'buoy-item': true, 'selected': selectedCycle === buoy.cycleNumber }"
            @click="selectBuoy(buoy)"
        >
          <div class="buoy-header">
            <span class="platform-number">平台编号：{{ buoy.platformNumber }}</span>
            <span class="cycle-number">Cycle {{ buoy.cycleNumber }}</span>
          </div>
          <div class="buoy-info">
            <span>位置: {{ buoy.latitude }}°N, {{ buoy.longitude }}°E</span>
            <span>日期: {{ buoy.sampleDate || '未知' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 元数据标签 -->
    <div v-show="activeTab === 'metadata'" class="scroll-container">
      <template v-if="selectedBuoy">
        <div class="metadata-grid">
          <div class="metadata-item"><label>平台编号</label><span>{{ metadata.platformnumber }}</span></div>
          <div class="metadata-item"><label>投放日期</label><span>{{ metadata.launchdate || '未知' }}</span></div>
          <div class="metadata-item"><label>项目名称</label><span>{{ metadata.projectname }}</span></div>
          <div class="metadata-item"><label>研究人员</label><span>{{ metadata.piname }}</span></div>
          <div class="metadata-item"><label>数据中心</label><span>{{ metadata.datacentre }}</span></div>
          <div class="metadata-item"><label>当前位置</label><span>{{
              metadata.launchlatitude
            }}°N, {{ metadata.launchlongitude }}°E</span></div>
        </div>
      </template>
      <div v-else class="no-selection">
        <i class="icon-info"></i> 请在列表中选择一个浮标
      </div>
    </div>

    <!-- 图表显示 -->
    <div v-show="activeTab === 'chart'" class="scroll-container">
      <div class="chart-container">
        <div ref="tempChartRef" class="chart"></div>
        <div ref="salinityChartRef" class="chart"></div>
      </div>
      <div v-if="!selectedBuoy" class="chart-notice">
        当前显示为示例数据，选择浮标后显示具体观测数据
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref, onMounted, onUnmounted, nextTick, watch, computed} from 'vue'
import {useRouter} from 'vue-router'
import {usePlatformStore} from '@stores/mainstore.js' // 你的store路径
import * as echarts from 'echarts'


// 获取store中的platformNumber
const store = usePlatformStore()
const platformNumber = computed(() => store.platformNumber)
const router = useRouter()
// 响应式状态
const selectedBuoy = ref(null)
const activeTab = ref('metadata')
const selectedCycle = ref(null) // 存储选中的周期号
const buoyList = ref([])
const rawData = ref([]);
const headerFields = [
  'platformNumber',
  'cycleNumber',
  'dataMode',
  'sampleDirection',
  'sampleDate',
  'latitude',
  'longitude',
  'coordinateHex'
];
const loadBuoyList = async (platformNumberVal) => {
  try {
    isLoading.value = true;
    const response = await fetch(`http://127.0.0.1:8000/argoheaderinfo/${platformNumberVal}`)
    if (!response.ok) throw new Error(`请求错误：${response.status}`);
    const data = await response.json();
    rawData.value = data;

    buoyList.value = data.map(item => {
      const obj = {};
      headerFields.forEach((field, index) => {
        obj[field] = item[index];
      });
      return obj;
    });

    // 设置默认选择：找到最小周期号的浮标
    if (buoyList.value.length > 0) {
      const minCycleBuoy = buoyList.value.reduce((min, current) =>
          parseInt(current.cycleNumber) < parseInt(min.cycleNumber) ? current : min
      );
      selectBuoy(minCycleBuoy);
    }
  } catch (err) {
    console.error('加载浮标列表失败：', err);
    errorMessage.value = `加载浮标列表失败：${err.message}`;
  } finally {
    isLoading.value = false;
  }
}

// 选择浮标处理函数
const selectBuoy = (buoy) => {
  selectedCycle.value = buoy.cycleNumber;
  // 立即加载该周期的核心数据
  fetchCoreData(store.platformNumber, buoy.cycleNumber);
}


const coreData = ref([])
const metadata = ref({
  platformnumber: '',
  transmissionsystem: '',
  positioningsystem: '',
  platformmodel: '',
  wmoinstrumenttype: '',
  projectname: '',
  datacentre: '',
  piname: '',
  launchdate: '',
  launchlatitude: '',
  launchlongitude: '',
  sensorsonthefloat: '',
  profilepressure: ''
});

const isLoading = ref(false)
const errorMessage = ref(null)

const tempChartRef = ref(null)
const salinityChartRef = ref(null)
let tempChart = null
let salinityChart = null
let abortController = null
const chartOptions = (title, field) => ({
  title: {text: title, left: 'center', textStyle: {color: '#275f94'}},
  grid: {left: '0%', right: '20%', containLabel: true},
  yAxis: {
    type: 'value',
    inverse: true,
    name: '深度（压力）',
    nameLocation: 'end',
    axisLabel: {
      formatter: value => `${value} dbar`
    },
    // 如果需要也可以调整Y轴的分割
    splitNumber: 8 // Y轴分割段数
  },
  xAxis: {
    type: 'value',
    name: field === 'temperature' ? '温度 (°C)' : '盐度 (PSU)',
    // 增加分割段数，减小间距
    splitNumber: 10,
    // 设置合理的间隔范围
    minInterval: 0.1,
    maxInterval: 5,
    // 确保所有标签显示
    axisLabel: {
      interval: 0,
      // 如果标签重叠可以旋转
      rotate: 0, // 旋转30度防止重叠
      margin: 10  // 增加标签间距
    }
  },
  dataset: {source: coreData.value.map(d => [d[field], d.pressure])},
  series: [{
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 4,
    lineStyle: {width: 2, color: field === 'temperature' ? '#e74c3c' : '#3498db'}
  }],
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      const data = params[0].data;
      return `${field === 'temperature' ? '温度' : '盐度'}: ${data[0].toFixed(2)}<br>深度（压力）: ${data[1]} dbar`;
    }
  }
})

// 加载元信息详情（基于platformNumber）
const loadMetaInfo = async (platformNumberVal) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/argometainfo/${platformNumberVal}`)
    if (!response.ok) throw new Error(`请求错误：${response.status}`)
    console.log(response)
    const data = await response.json()
    if (data.length > 0) {
      const rec = data[0]
      // 假设返回的数据结构符合你的数据库字段
      console.log('返回数据:', data);
      console.log('更新前的metadata:', metadata.value);
      metadata.value = {
        platformnumber: rec[0],
        transmissionsystem: rec[1],
        positioningsystem: rec[2],
        platformmodel: rec[3],
        wmoinstrumenttype: rec[4],
        projectname: rec[5],
        datacentre: rec[6],
        piname: rec[7],
        launchdate: rec[8],
        launchlatitude: rec[9],
        launchlongitude: rec[10],
        sensorsonthefloat: rec[11],
        profilepressure: rec[12]
      }

      console.log('更新后的metadata:', metadata.value);
    } else {
      // 如果无数据，根据需要处理
      // 这里可以清空或提示
    }
  } catch (err) {
    errorMessage.value = `加载元信息失败：${err.message}`
    console.error('加载元信息错误:', err)
  }
}

// 获取核心数据集（根据platformNumber）
const fetchCoreData = async (platformNumberVal, cycleNumber) => {
  if (!platformNumberVal || !cycleNumber) return;

  try {
    isLoading.value = true;
    const response = await fetch(`http://127.0.0.1:8000/argocore/${platformNumberVal}/${cycleNumber}`)
    if (!response.ok) throw new Error(`请求失败：${response.status}`);

    const data = await response.json();

    // 处理返回的二维数组
    coreData.value = data.map(row => ({
      pressure: parseFloat(row[2]),     // 第一列：压力
      temperature: parseFloat(row[3]),  // 第二列：温度
      salinity: parseFloat(row[4])      // 第三列：盐度
    }));

    console.log('核心数据加载成功:', coreData.value);

    // 如果当前在图表标签页，更新图表
    if (activeTab.value === 'chart') {
      nextTick(initCharts);
    }
  } catch (err) {
    errorMessage.value = `获取核心数据失败: ${err.message}`;
    console.error('获取核心数据错误:', err);
  } finally {
    isLoading.value = false;
  }
}


// 初始化图表
const initCharts = () => {
  if (!tempChartRef.value || !salinityChartRef.value) return
  if (tempChart) {
    tempChart.dispose()
  }
  if (salinityChart) {
    salinityChart.dispose()
  }
  tempChart = echarts.init(tempChartRef.value)
  salinityChart = echarts.init(salinityChartRef.value)
  tempChart.setOption(chartOptions('温度剖面图', 'temperature'))
  salinityChart.setOption(chartOptions('盐度剖面图', 'salinity'))

  const resizeHandler = () => {
    tempChart?.resize()
    salinityChart?.resize()
  }
  window.addEventListener('resize', resizeHandler)

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
    tempChart.dispose()
    salinityChart.dispose()
  })
}

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'chart' && selectedBuoy.value) {
    nextTick(() => {
      initCharts()
    })
  }
}

// 监控 platformNumber，自动加载元信息和浮标列表
watch(platformNumber, (newVal) => {
  if (newVal) {
    loadBuoyList(newVal);
    loadMetaInfo(newVal);
  }
})

// 初始化时加载
onMounted(() => {
  if (platformNumber.value) {
    loadBuoyList(platformNumber.value);
    loadMetaInfo(platformNumber.value);
  }
})


// 关闭面板
const closePanel = () => router.push('/mainview')
// 监听平台编号变化，自动同步
watch(() => store.platformNumber, (newVal) => {
  if (newVal) {
    selectedBuoy.value = newVal
  } else {
    selectedBuoy.value = ''
  }
});

// 页面加载时同步
onMounted(() => {
  if (store.platformNumber) {
    selectedBuoy.value = store.platformNumber
    loadBuoyList(store.platformNumber)  // 加载列表
    loadMetaInfo(store.platformNumber)
  }
});
</script>
<style scoped>
.argo-info-panel {
  position: relative;
  height: 100%;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1001;
  padding: 8px;
  background: rgba(39, 95, 148, 0.9);
  border: none;
  //border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #1a3d5f;
  transform: rotate(90deg);
}

.tab-nav {
  display: flex;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.tab-nav button {
  flex: 1;
  padding: 12px;
  border: none;
  background: #0082ff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.tab-nav button.active {
  background: #275f94;
  color: white;
  border-bottom: 2px solid #1a3d5f;
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px 15px;
  margin: 0 -15px;
}

.buoy-list {
  display: grid;
  gap: 12px;
  padding-right: 8px;
}

.buoy-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.buoy-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.buoy-item.selected {
  border-color: #275f94;
  background: #f0f8ff;
}

.buoy-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.platform-number {
  font-weight: 500;
  color: #275f94;
}

.cycle-number {
  color: #666;
  font-size: 0.9em;
}

.buoy-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #666;
  font-size: 0.9em;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.metadata-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.metadata-item label {
  color: #666;
  margin-right: 15px;
  font-weight: 500;
}

.full-width {
  grid-column: 1 / -1;
}

.no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1em;
}

.chart-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  width: 100%;
  padding: 15px 0;
}

.chart {
  height: 400px;
  width: 100%;
  margin: 0 auto;
}

.chart-notice {
  padding: 15px;
  background: #fff3cd;
  color: #856404;
  border-radius: 4px;
  margin-top: 15px;
  text-align: center;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #275f94;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  text-align: center;
  max-width: 80%;
}

.error-message button {
  margin-top: 15px;
  padding: 8px 16px;
  background: #721c24;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.error-message button:hover {
  background: #5c161d;
}

@media (max-width: 768px) {
  .chart {
    height: 300px;
  }

  .metadata-grid {
    grid-template-columns: 1fr;
  }

  .buoy-header {
    flex-direction: column;
    gap: 5px;
  }
}
</style>