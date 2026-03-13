import {ref, reactive, computed} from 'vue'
import {defineStore} from 'pinia'


const options = {
    persist: {
        storage: sessionStorage,
    }
}
const id = 'mainstore'
const viewer_store = ref(null)
const altitude = ref(null)
const longitude = ref(100)
const latitude = ref(null)
const finitude = ref(null)
const magnitude = ref(null)
const count = ref(0)
const logined = ref(false)
const layername = ref('')
const layer = ref('')
// stores/platform.js

export const usePlatformStore = defineStore('platform', {
    state: () => ({
        platformNumber: null

        // 可添加其他字段...
    }),

    actions: {
        setPlatformInfo(info) { // 改用一个 action 更新多个字段
            this.platformNumber = info.platformNumber;
        }
    }
});
const filterSelections = ref({
    years: [],
    fmodels: [],
    dacs: [],
    Active: true,
    Inactive: false,
})

const statusCounts = reactive({
    active: 0,
    inactive: 0,
})

// 计算属性
const isValidLayer = computed(() => layer.value.length > 0)

// 方法
function increment() {
    count.value++
}

function loadboalayer(layername) {
    count.value++
    longitude.value = count.value
    latitude.value = count.value + 1000
    console.log(layername)
}

function clearlayers() {
    let viewer = viewer_store.value
    if (viewer?.imageryLayers) {
        viewer.imageryLayers.removeAll()
        console.log('all layers cleared')
    }
}

function setLayerName(name) {
    layername.value = name
    layer.value = name
}

function updateFilterSelections(payload) {
    filterSelections.value = {...filterSelections.value, ...payload}
}

function setLayer(newLayer) {
    layer.value = newLayer
}

function login() {
    logined.value = true
}

function logout() {
    logined.value = false
}


function storeSetup() {
    return {
        // 状态
        viewer_store,
        altitude,
        longitude,
        latitude,
        finitude,
        magnitude,
        count,
        logined,
        layername,
        layer,
        filterSelections,
        statusCounts,

        // 计算属性
        isValidLayer,

        // 方法
        increment,
        loadboalayer,
        clearlayers,
        setLayerName,
        updateFilterSelections,
        setLayer,
        login,
        logout
    };
}

// 定义Pinia store
const useStore = defineStore(id, storeSetup, options);
export default useStore;