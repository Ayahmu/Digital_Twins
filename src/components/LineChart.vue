<template>
  <div style="height: 100%">
    <div class="box">氢气提纯经济效益</div>
    <div ref="line" class="line"></div>
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
        backgroundColor: "transparent",

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0, 255, 233,0)",
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255, 255, 255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 255, 233,0)",
                  },
                ],
                global: false,
              },
            },
          },
        },

        grid: {
          top: "24%",
          left: "6%",
          right: "6%",
          bottom: "22%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: true,
            },
            // splitArea: {
            //   // show: true,
            //   color: "#f00",
            //   lineStyle: {
            //     color: "#f00",
            //   },
            // },
            axisLabel: {
              color: "#4ed2fd",
              interval: 0,
              fontSize: 15,
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],

        yAxis: [
          {
            type: "value",
            min: function (value) {
              return value.min - 10;
            },
            max: function (value) {
              return value.max + 10;
            },
            // max: 140,
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.1)",
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
              margin: 20,
              textStyle: {
                color: "#d1e6eb",
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "氢气提纯",
            type: "line",
            // smooth: true, //是否平滑
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: "circle",
            symbolSize: 9,
            lineStyle: {
              normal: {
                color: "#2c8cfe",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 4,
                shadowOffsetX: 4,
              },
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#4ed2fd",
              },
            },

            itemStyle: {
              color: "#2c8cfe",
              borderColor: "#fff",
              borderWidth: 3,
              shadowColor: "rgba(0, 0, 0, .3)",
              shadowBlur: 0,
              shadowOffsetY: 2,
              shadowOffsetX: 2,
            },
            tooltip: {
              show: true,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(44, 140, 254,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(44, 140, 254,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0,202,149, 0.9)",
                shadowBlur: 20,
              },
            },
            data: purification,
          },
          // {
          //   name: "传统补氢",
          //   type: "line",
          //   // smooth: true, //是否平滑
          //   showAllSymbol: true,
          //   // symbol: 'image://./static/images/guang-circle.png',
          //   symbol: "circle",
          //   symbolSize: 5,
          //   lineStyle: {
          //     normal: {
          //       color: "#00b18a",
          //       shadowColor: "rgba(0, 0, 0, .3)",
          //       shadowBlur: 0,
          //       shadowOffsetY: 5,
          //       shadowOffsetX: 5,
          //     },
          //   },
          //   label: {
          //     show: true,
          //     position: "top",
          //     textStyle: {
          //       color: "#00ca95",
          //     },
          //   },

          //   itemStyle: {
          //     color: "#00b18a ",
          //     borderColor: "#00b18a",
          //     borderWidth: 3,
          //     shadowColor: "rgba(0, 0, 0, .3)",
          //     shadowBlur: 0,
          //     shadowOffsetY: 2,
          //     shadowOffsetX: 2,
          //   },
          //   tooltip: {
          //     show: true,
          //   },
          //   areaStyle: {
          //     normal: {
          //       color: new echarts.graphic.LinearGradient(
          //         0,
          //         0,
          //         0,
          //         1,
          //         [
          //           {
          //             offset: 0,
          //             color: "rgba(44, 140, 254,0.3)",
          //           },
          //           {
          //             offset: 1,
          //             color: "rgba(44, 140, 254,0)  ",
          //           },
          //         ],
          //         false
          //       ),
          //       shadowColor: "rgba(0,202,149, 0.9)",
          //       shadowBlur: 20,
          //     },
          //   },
          //   data: supplement,
          // },
        ],
      },
    };
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.line);

    this.option && this.myChart.setOption(this.option);
  },
};
</script>
<style scoped>
.line {
  width: 90%;
  height: 90%;
  transform: translate(21px, 20px);
}
.box {
  text-align: center;
  background-image: linear-gradient(to bottom, white, #48c8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: absolute;
  top: 10px;
  font-size: 1.4vw;
  width: 100%;
}
</style>
