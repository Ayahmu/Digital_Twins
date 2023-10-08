<template>
  <div>
    <div
      style="
        text-align: center;
        background-image: linear-gradient(to bottom, white, #48c8ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        position: absolute;
        top: -12px;
        z-index: 222;
        font-size: 27px;
        width: 100%;
      "
    >
      系统运行状态
    </div>
    <div ref="panel" class="chart-container"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      myChart: null,
      option: {
        series: [
          {
            textStyle: {
              fontSize: 1111,
            },
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            center: ["50%", "75%"],
            radius: "90%",
            min: 0,
            max: 1,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 0,
                color: [
                  [0.33, "#FF6E76"],
                  [0.67, "#7CFFB2"],
                  [1, "#FDDD60"],
                ],
              },
            },
            pointer: {
              icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
              length: "55%",
              width: 15,
              offsetCenter: [0, "-29%"],
              itemStyle: {
                color: "auto",
              },
            },
            axisTick: {
              length: 20,
              lineStyle: {
                color: "auto",
                width: 4,
              },
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: "auto",
                width: 5,
              },
            },
            axisLabel: {
              color: "#7CFFB2",
              fontSize: 39,

              distance: 140,
              rotate: "tangential",
              formatter: function (value) {
                if (value === 0.165) {
                  return "停止";
                } else if (value === 0.5) {
                  return "运行";
                } else if (value === 0.835) {
                  return "盘车";
                }

                return "";
              },
            },
            title: {
              offsetCenter: [0, "37%"],
              fontSize: 60,
              color: "#48c8ff",

              fontFamily: "Arial",
            },
            detail: {
              fontSize: 0,
              offsetCenter: [0, "-35%"],
              valueAnimation: true,
              formatter: function (value) {
                return Math.round(value * 100) + "";
              },
              color: "inherit",
            },
            data: [
              {
                value: "0.5",
                name: "机组状态",
              },
            ],
          },
        ],
      },
    };
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.panel);
    this.myChart.setOption(this.option);
    const scaleRatio = 0.42; // 缩放比例
    this.myChart
      .getZr()
      .painter.getViewportRoot().style.transform = `scale(${scaleRatio})`;
    this.myChart.getZr().painter.getViewportRoot().style.transformOrigin =
      "left top";
    this.myChart.resize();
  },
};
</script>
<style lang="css" scoped>
.chart-container {
  position: relative;
  width: 400px; /* 初始宽度 */
  height: 400px; /* 初始高度 */
  transform: translate(4px, -11px);
}

.chart-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
}
</style>
