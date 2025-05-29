<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted, reactive } from 'vue'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import AlloyFinger from 'alloyfinger'
import VConsole from 'vconsole'

const vConsole = new VConsole()

// 使用reactive存储变换状态
const transform = reactive({
  scale: 1,
  lastScale: 1,
  translateX: 0,
  translateY: 0,
  lastTranslateX: 0,
  lastTranslateY: 0,
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
    
    // 双击重置所有变换
    doubleTap: () => {
      resetTransform()
    },
    
    // 拖动处理（仅当放大时可移动）
    pressMove: (evt) => {
      // 只有当缩放大于1时才允许移动
      if (transform.scale <= 1) return
      
      // 计算新的位置
      transform.translateX = transform.lastTranslateX + evt.deltaX
      transform.translateY = transform.lastTranslateY + evt.deltaY
      
      // 限制移动范围，防止内容移出太远
      const maxTranslate = (transform.scale - 1) * 150 // 根据缩放比例计算最大移动距离
      transform.translateX = Math.max(Math.min(transform.translateX, maxTranslate), -maxTranslate)
      transform.translateY = Math.max(Math.min(transform.translateY, maxTranslate), -maxTranslate)
      
      // 应用变换
      applyTransform()
    },
    
    // 移动结束时保存最后的位置
    pressEnd: () => {
      transform.lastTranslateX = transform.translateX
      transform.lastTranslateY = transform.translateY
    }
  })
  
  // 初始应用变换
  applyTransform()
})

// 应用变换到DOM元素
function applyTransform() {
  if (!appBox.value) return
  
  appBox.value.style.transform = `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`
  appBox.value.style.transformOrigin = 'center center'
  
  // 只在重置时添加过渡效果
  const isReset = transform.scale === 1 && transform.translateX === 0 && transform.translateY === 0
  appBox.value.style.transition = isReset ? 'transform 0.3s' : 'none'
}

// 重置所有变换
function resetTransform() {
  transform.scale = 1
  transform.lastScale = 1
  transform.translateX = 0
  transform.translateY = 0
  transform.lastTranslateX = 0
  transform.lastTranslateY = 0
  applyTransform()
}
</script>

<template>
  <div class="container">
    <div ref="appBox" id="app-container" class="app-container">
      <h2>手势放大缩小与移动</h2>
      <LineChart />
      <BarChart />
    </div>
    <div class="scale-info">
      <div>缩放: {{ transform.scale.toFixed(2) }}</div>
      <div>位置: ({{ transform.translateX.toFixed(0) }}, {{ transform.translateY.toFixed(0) }})</div>
      <button @click="resetTransform" class="reset-btn">重置</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.app-container {
  width: 100%;
  touch-action: none; /* 防止浏览器默认的触摸行为干扰 */
}

.scale-info {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1000;
}

.reset-btn {
  margin-top: 8px;
  padding: 5px 10px;
  background: #42b883;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
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
