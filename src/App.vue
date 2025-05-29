<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import AlloyFinger from 'alloyfinger'
import VConsole from 'vconsole'

const vConsole = new VConsole()

const initScale = 1;
const appBox = ref(null)
const af = new AlloyFinger(appBox.value, {
  pinch: (evt) => {
    appBox.value.scaleX = appBox.value.scaleY = initScale * evt.zoom;
    console.log('evt.zoom', evt.zoom);
    console.log('scale', appBox.value.scaleX);
  }
})
</script>

<template>
  <div ref="appBox" id="app-container" class="app-container">
    <h2>手势放大缩小pinch</h2>
    <LineChart />
    <BarChart />
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.app-container {
  width: 100%;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
