<template>
  <div>
    <div class="box">氢气提纯经济性分析</div>
    <div ref="pole" class="pole"></div>
  </div>
</template>
<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

import connectdata from "../connect.js";
let supplement = connectdata[10];
let purification = connectdata[11];
export default {
  data() {
    return {
      supplement,
      purification,
      option: {
        backgroundColor: "transparent   ",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        //        legend: {
        //   data: ['发生', '处理'],
        //   icon: 'rect',
        //   top: "10%",
        //   right: '6%',
        //   itemGap: 20,
        //   itemWidth: 12,
        //   itemHeight: 8,
        // },
        grid: {
          left: "10%",
          right: "3%",
          top: "15%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            axisLine: {
              show: true,
              lineStyle: {
                width: 2,
                color: "#2B7BD6",
              },
            },
            axisTick: {
              interval: 0, // 调整间距
            },
            axisLabel: {
              color: "#87CEEB",
              fontSize: 14,
            },
          },
        ],
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              width: 2,
              color: "#2B7BD6",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,0.5)",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#87CEEB",
            fontSize: 14,
            fontFamily: "Digital-7",
          },
          // boundaryGap: ['20%', '20%'],
        },

        series: [
          {
            name: "氢气提纯",
            type: "bar",
            backgroundStyle: {
              color: "rgba(216, 229, 247, 0.55)",
              borderRadius: [8, 8, 0, 0],
            },
            itemStyle: {
              normal: {
                color: "rgba(1, 12, 38, 0.4)",
                borderRadius: 0,
                // borderColor: 'rgba(0, 255, 236, 1)',
                borderColor: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#015EFE", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#10C2E8", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
            barWidth: "18",
            label: {
              show: true,
              color: "#cececd",
              position: "outside",
              fontSize: 10,
            },
            data: supplement,
          },

          {
            name: "传统补氢",
            type: "bar",
            backgroundStyle: {
              color: "rgba(216, 229, 247, 0.55)",
              borderRadius: [8, 8, 0, 0],
            },
            symbolRepeat: "fixed",
            symbolMargin: 6,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [5, 22],
            symbolPosition: "start",
            symbolOffset: [0, -2],

            z: 66,
            animationEasing: "elasticOut",
            itemStyle: {
              normal: {
                color: "rgba(5,59,113,0.7)",
                borderRadius: 0,
                // borderColor: 'rgba(0, 255, 236, 1)',
                borderColor: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#015EFE", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#10C2E8", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
            barWidth: "15",
            label: {
              show: true,
              color: "#76e7ea",
              position: "outside",
              fontSize: 10,
            },
            data: purification,
          },
        ],
      },
    };
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.pole);

    this.option && this.myChart.setOption(this.option);
  },
  //   methods: {},
};
</script>
<style lang="css" scoped>
.pole {
  position: relative;
  height: 200px;
  width: 100%;
  transform: translate(-37px, 61px);
}
.box {
  text-align: center;
  background-image: linear-gradient(to bottom, white, #48c8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: absolute;
  top: 10px;
  z-index: 222;
  font-size: 27px;
  width: 100%;
}
</style>
