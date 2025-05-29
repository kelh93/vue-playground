<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import AlloyFinger from 'alloyfinger'
import VConsole from 'vconsole'

const vConsole = new VConsole()

const initScale = 1;
const af = new AlloyFinger(document.body, {
  pinch: (evt) => {
    document.body.scaleX = document.body.el.scaleY = initScale * evt.zoom;
    console.log('evt.zoom', evt.zoom);
    console.log('scale', document.body.scaleX);
  }
})
</script>

<template>
  <div class="app-container">
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
