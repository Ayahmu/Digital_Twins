<template>
  <div ref="pan" class="chart-containers"></div>
</template>
<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);
import connectdata from "../connect.js";
let status = connectdata[0];
export default {
  data() {
    return {
      computedata: 0.5,
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
              fontSize: 0,

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
              fontSize: 0,
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
                value: 0.5,
                name: "机组状态",
              },
            ],
          },
        ],
      },
    };
  },
  mounted() {
    this.init(status[1]);
  },
  updated(){
    let connectdata = JSON.parse(localStorage.getItem("initData"));
    status = connectdata[0]
    this.init(status[1]);
  },
  methods: {
    init(givendata) {
      if (givendata == 0) {
        this.computedata = 0.165;
      } else if (givendata == 1) {
        this.computedata = 0.5;
      } else if (givendata == 2) {
        this.computedata = 0.835;
      }
      (this.option = {
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
              fontSize: 0,

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
              fontSize: 0,
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
                value: this.computedata,
                name: "机组状态",
              },
            ],
          },
        ],
      }),
        (this.myChart = echarts.init(this.$refs.pan));
      this.myChart.setOption(this.option);
      const scaleRatio = 0.42; // 缩放比例
      this.myChart
        .getZr()
        .painter.getViewportRoot().style.transform = `scale(${scaleRatio})`;
      this.myChart.getZr().painter.getViewportRoot().style.transformOrigin =
        "left top";
      this.myChart.resize();
    },
  },
};
</script>
<style lang="css" scoped>
.chart-containers {
  position: relative;
  width: 400px; /* 初始宽度 */
  height: 400px; /* 初始高度 */
  transform: translate(161px, -409px);
}

.chart-containers canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
