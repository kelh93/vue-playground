<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted, reactive } from 'vue'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import AlloyFinger from 'alloyfinger'
import VConsole from 'vconsole'

const vConsole = new VConsole()

// 使用reactive存储缩放状态
const transform = reactive({
  scale: 1,
  lastScale: 1,
  minScale: 0.5,  // 最小缩放比例
  maxScale: 3     // 最大缩放比例
})

const appBox = ref(null)

onMounted(() => {
  const af = new AlloyFinger(appBox.value, {
    // 捏合缩放
    pinch: (evt) => {
      // 计算新的缩放值
      let newScale = transform.lastScale * evt.zoom

      // 限制缩放范围
      if (newScale < transform.minScale) newScale = transform.minScale
      if (newScale > transform.maxScale) newScale = transform.maxScale

      transform.scale = newScale

      // 应用变换
      applyTransform()
    },

    // 捏合结束时保存最后的缩放值
    pinchend: () => {
      transform.lastScale = transform.scale
    },

    // 双击重置缩放
    doubleTap: () => {
      transform.scale = 1
      transform.lastScale = 1
      applyTransform()
    }
  })

  // 初始应用变换
  applyTransform()
})

// 应用变换到DOM元素
function applyTransform() {
  if (!appBox.value) return

  appBox.value.style.transform = `scale(${transform.scale})`
  appBox.value.style.transformOrigin = 'center center'
  appBox.value.style.transition = transform.scale === 1 ? 'transform 0.3s' : 'none'
}
</script>

<template>
  <div ref="appBox" id="app-container" class="app-container">
    <h2>手势放大缩小pinch</h2>
    <div class="scale-info">当前缩放比例: {{ transform.scale.toFixed(2) }}</div>
    <LineChart />
    <BarChart />
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.app-container {
  width: 100%;
  touch-action: none;
  /* 防止浏览器默认的触摸行为干扰 */
}

.scale-info {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1000;
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
