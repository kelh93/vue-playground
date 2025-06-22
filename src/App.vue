<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted, reactive } from 'vue'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import AlloyFinger from 'alloyfinger'
import VConsole from 'vconsole'
import { showToast } from 'vant';

const vConsole = new VConsole()

const initScale = ref(1)
const appContainerBg = ref(null)

// 使用reactive存储变换状态
const transform = reactive({
  scale: 1,
  lastScale: 1,
  translateX: 0,
  translateY: 0,
  lastTranslateX: 0,
  lastTranslateY: 0,
  minScale: 1,  // 最小缩放比例
  maxScale: 5    // 最大缩放比例
})

const appBox = ref(null)
let startY = ref(0)
const isGestureActive = ref(false)
const overlay = ref(null)

onMounted(() => {
  console.log('onMounted')
  showToast('123')
  const af = new AlloyFinger(appBox.value, {
    touchStart: (evt) => {
      overlay.value.classList.add('active');
      isGestureActive.value = false;
      startY.value = evt.touches[0].clientY
    },
    touchMove: function (evt) {
      // 如果移动距离超过阈值，判定为手势操作
      if (Math.abs(evt.deltaX) > 10 || Math.abs(evt.deltaY) > 10) {
        isGestureActive.value = true;
      }
    },
    touchEnd: function () {
      // 如果是点击（非手势），立即恢复穿透
      if (!isGestureActive.value) {
        overlay.value.classList.remove('active');
      }
    },
    swipe: function (evt) {
      console.log('检测到滑动手势:', evt.direction);
      // 手势结束后恢复穿透
      setTimeout(() => {
        overlay.value.classList.remove('active');
      }, 100);
    },
    tap: function () {
      // 如果是点击，立即恢复穿透，允许事件传递到 iframe
      overlay.value.classList.remove('active');
    },
    // 捏合缩放
    pinch: (evt) => {
      evt.preventDefault();
      // el.scaleX = el.scaleY = initScale.value * evt.zoom;
      // 计算新的缩放值
      let newScale = transform.lastScale * evt.zoom

      // 限制缩放范围
      // if (newScale < transform.minScale) newScale = transform.minScale
      // if (newScale > transform.maxScale) newScale = transform.maxScale

      transform.scale = newScale

      // 应用变换
      applyTransform()
    },
    // 长按
    longTap: function (evt) { 
      showToast('longTap')
      evt.preventDefault()

    },
    // 捏合结束时保存最后的缩放值
    pinchend: () => {
      transform.lastScale = transform.scale
    },

    // 双击重置所有变换
    doubleTap: () => {
      // resetTransform()
    },

    // 拖动处理（仅当放大时可移动）
    pressMove: (evt) => {
      
      // el.translateX += evt.deltaX;
      // el.translateY += evt.deltaY;
      // evt.preventDefault();

      const deltaY = evt.touches[0].clientY - startY;
      // 如果横向滑动，阻止默认事件（避免滚动冲突）
      if (Math.abs(evt.deltaX) > Math.abs(deltaY)) {
        // evt.preventDefault();
      }
      // 只有当缩放大于1时才允许移动
      // if (transform.scale <= 1) return

      // 计算新的位置
      transform.translateX += evt.deltaX
      transform.translateY += evt.deltaY
      evt.preventDefault();

      // 限制移动范围，防止内容移出太远
      // const maxTranslate = (transform.scale - 1) * 150 // 根据缩放比例计算最大移动距离
      // transform.translateX = Math.max(Math.min(transform.translateX, maxTranslate), -maxTranslate)
      // transform.translateY = Math.max(Math.min(transform.translateY, maxTranslate), -maxTranslate)

      // 应用变换
      applyTransform()
    },
    multipointStart: function (evt) {
      if (evt.touches.length > 1) {
        showToast('多指触碰')
        appContainerBg.value.style.display = 'block'
        // evt.preventDefault();
        // 禁用默认的双指缩放行为
        // evt.stopPropagation();
      }

    },
    // 移动结束时保存最后的位置
    pressEnd: () => {
      transform.lastTranslateX = transform.translateX
      transform.lastTranslateY = transform.translateY
    },
    passive: false
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
    <h2 style="text-align: center;">手势放大缩小与移动</h2>
    <div class="app-container">
      <!-- <img ref="appBox" class="rectbox" src="./assets/test.png" /> -->
      <!-- <div ref="appBox" class="rectbox"></div> -->
      <!-- <div ref="appContainerBg" class="app-container-bg" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);z-index: 1;"></div> -->
      <iframe ref="appBox" class="rectbox" src="https://element-plus.org/zh-CN/component/table.html" frameborder="0"></iframe>
      <div class="gesture-overlay" ref="overlay"></div>
      <!-- <LineChart />
      <BarChart /> -->
    </div>
    <div class="scale-info">
      <div>缩放: {{ transform.scale.toFixed(2) }}</div>
      <div>位置: ({{ transform.translateX.toFixed(0) }}, {{ transform.translateY.toFixed(0) }})</div>
      <button @click="resetTransform" class="reset-btn">重置</button>
    </div>
    <!-- <div class="imgBox">
      <img src="./assets/test.png" />
    </div> -->
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #42b883;
}

.app-container {
  position: relative;
  width: 100%;
  height: 50%;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  border: solid 2px #fff;
  touch-action: none;
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  /* 防止浏览器默认的触摸行为干扰 */
}

.app-container iframe {
  border: solid 2px #f00;
  touch-action: none;
}

.scale-info {
  position: fixed;
  bottom: 10px;
  right: 30%;
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

.rectbox {
  width: 100%;
  height: 100%;
  /* background: red; */
  border-radius: 12px;
  transform-origin: 0 0;
}
.gesture-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: orange;
  opacity: 0.5;
  pointer-events: none; /* 默认不拦截事件 */
  z-index: 10;
}
.gesture-overlay.active {
  /* background-color: transparent; */
  opacity: 0;
  pointer-events: auto; /* 仅在手势激活时拦截 */
}
</style>
