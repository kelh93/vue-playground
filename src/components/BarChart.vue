<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import * as echarts from 'echarts';
const chartRef = ref(null);
const chartInstance = ref(null);
const options = computed(() => {
  return {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ],
    tooltip: {
      show: true,
      trigger: 'item'
    }
  }
})

onMounted(() => {
  chartInstance.value = echarts.init(chartRef.value);
  chartInstance.value.setOption(options.value);
})

</script>

<style scoped>
.chart {
  width: calc(100vw - 4rem);
  height: 300px;
}
</style>