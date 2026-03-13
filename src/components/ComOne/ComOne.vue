/* vue-untitled / 2025-05-13 / gis@jou.edu.cn */
<template>
  <main>
    <Panel header="ComOne" toggleable collapsed>
      <p class="m-0" @click="clearlayers">

        <Button>组件万</Button>

      </p>
    </Panel>
  </main>
</template>
<!---------------------------------------------------------->
<script setup>
import {ref, useTemplateRef, onMounted} from "vue";
import usemainStore from "@stores/mainstore.js";
import {storeToRefs} from "pinia";
import Panel from 'primevue/panel';
import Button from 'primevue/button';

/**/
const store = usemainStore();
const {viewer_store} = storeToRefs(store);
const {clearlayers} = store;

/**/
function test() {
  console.log('comoned store.viewer ', store.viewer_store.imageryLayers.length);//
  console.log('comoned viewer value ', viewer_store.value.imageryLayers.length);//
}

/**/
onMounted(() => {
  console.log('comoned mounted', viewer_store);
})
</script>
<!---------------------------------------------------------->
<style scoped>
</style>