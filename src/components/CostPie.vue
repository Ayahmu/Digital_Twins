<template>
  <div>
    <div class="box">电解水制氢成本占比</div>
    <dv-active-ring-chart
      :config="config"
      style="
        width: 11.5944vw;
        height: 13.5944vw;
        border-radius: 1vw;
        transform: scale(1, 1.25) translate(0.0957vw, 2vw);
        transform-origin: bottom;
      "
    />
    <div
      class="pie"
      ref="pie"
      style="width: 12.1414vw; height: 19.3513vw"
    ></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import connectdata from "../connect.js";
let cost = connectdata[9];

export default {
  data() {
    return {
      cost,
      config: {
        // digitalFlopStyle: {
        digitalFlopStyle: {
          fontSize: 14,
          fill: "#fff",
        },
        lineWidth: 18,
        activeTimeGap: 8000,
        data: [
          {
            name: "能耗",
            value: cost[0],
          },

          {
            name: "水耗",
            value: cost[1],
          },
        ],
        color: ["#00ffff", "#ffe963"],
        digitalFlopToFixed: 2,
      },
    };
  },
  methods: {
    getViewportWidth() {
      return window.innerWidth || document.documentElement.clientWidth;
    },

    calculateLabelSize() {
      var viewportWidth = this.getViewportWidth();
      var labelSize = viewportWidth * 0.01; // 假设为视口宽度的1%
      return labelSize;
    },
  },
  mounted() {
    const ba = this.calculateLabelSize();

    const data = [
      {
        name: "能耗",
        value: cost[0],
      },
      {
        name: "水耗",
        value: cost[1],
      },
    ];
    this.myChart = echarts.init(this.$refs.pie);
    this.option = {
      color: ["#00ffff", "#ffe963"],
      legend: {
        top: "3%",
        left: "41%",
        orient: "vertical",
        textStyle: {
          color: "#4edbff",
          fontSize: 1.3556 * ba + "px",
        },
        icon: "roundRect",
        data: [
          {
            name: "能耗",
            value: cost[0],
          },
          {
            name: "水耗",
            value: cost[1],
          },
        ],
      },
      series: [
        // 主要展示层的
        {
          radius: ["0%", "0%"],
          center: ["0%", "0%"],
          type: "pie",
          label: {
            normal: {
              show: false,
              formatter: "{c}%",
              textStyle: {
                fontSize: 0,
              },
              position: "outside",
            },
            emphasis: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
              length: 0,
              length2: 0,
            },
            emphasis: {
              show: false,
            },
          },
          name: "",
          data: data,
        },
        // 边框的设置
        {
          radius: ["0%", "0%"],
          center: ["0%", "0%"],
          type: "pie",
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          animation: false,
          tooltip: {
            show: false,
          },
          data: [
            {
              value: 1,
              itemStyle: {
                color: "transparent",
              },
            },
          ],
        },
        {
          name: "外边框",
          type: "pie",
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          center: ["0%", "0%"],
          radius: ["0%", "0%"],
          label: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: 9,
              name: "",
              itemStyle: {
                normal: {
                  borderWidth: 2,
                  borderColor: "#0b5263",
                },
              },
            },
          ],
        },
      ],
    };
    this.option && this.myChart.setOption(this.option);
  },
};
</script>
<style scoped>
.pie {
  position: absolute;
  left: 30%;

  transform: translate(1vw, -9.236vw);
}

.box {
  text-align: center;
  background-image: linear-gradient(to bottom, white, #48c8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: absolute;
  top: 10px;
  z-index: 2;
  font-size: 1.3602vw;
  width: 100%;
}
</style>
