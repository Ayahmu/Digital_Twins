<template>
  <div>
    <div class="box">电解水制氢成本占比</div>

    <div class="pie" ref="pie"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";

import connectdata from "../connect.js";
let cost = connectdata[9];
var dataStyle = {
  normal: {
    label: {
      show: true,
      color: "#7cffb2",
      fontSize: 18,
    },
    labelLine: {
      //smooth: 0.2,
      length: 40,
      length2: 40,
    },
  },
};

var labelShow = {
  show: true,
  color: "#7cffb2",
  fontSize: 15,
  formatter: ["{d| {d}% }", "{b| {b} }"].join("\n"),
  rich: {
    d: {
      fontSize: 22,
      color: "#8ed7f6",
    },
    b: {
      fontSize: 22,
      color: "#8ed7f6",
    },
  },
};

var placeHolderStyle = {
  normal: {
    color: "rgba(0,0,0,0)",
    label: {
      show: false,
    },
    labelLine: {
      show: false,
    },
  },
  emphasis: {
    color: "rgba(0,0,0,0)",
  },
};
export default {
  data() {
    return {
      cost,

      option: {
        backgroundColor: "transparent",

        color: ["#2078d1", "#8a00ec"],
        tooltip: {
          show: false,
          formatter: "{b} {d}%",
        },
        angleAxis: {
          type: "category",
          z: 10,
          axisLine: {
            color: "#fff",
            lineStyle: {
              width: 1,
              color: "#fff",
            },
          },
        },
        radiusAxis: {
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            color: "#00e3e3",
          },
          axisLine: {
            show: false,
            color: "#fff",
            lineStyle: {
              color: "#fff",
            },
          },
          splitLine: {
            color: "#000",
            lineStyle: {
              type: "dotted",
              color: "rgba(170,170,170,.5)",
            },
          },
        },
        polar: {
          center: ["50%", "50%"],
          radius: 80,
        },
        legend: {
          right: "0%",
          top: "30%",
          orient: "vertical",
          textStyle: {
            color: "#8ed7f6",
            fontSize: "24",
          },
          itemGap: 12,
          data: ["水耗", "能耗"],
        },
        series: [
          {
            name: "Line 1",
            type: "pie",
            clockWise: false,
            radius: [35, 65],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [{
                value: cost[1],
                name: "",
                itemStyle: placeHolderStyle,
              },
              {
                value: 0,
                name: "",
                itemStyle: placeHolderStyle,
              },
              {
                value: cost[0],
                name: "能耗",
                label: labelShow,
              },
              
            ],
          },
          {
            name: "Line 2",
            type: "pie",
            clockWise: false,
            radius: [40, 65],
            itemStyle: dataStyle,
            hoverAnimation: false,

            data: [
              
              {
                value: cost[1],
                name: "水耗",
                label: labelShow,
              },{
                value: cost[0],
                name: "",
                itemStyle: placeHolderStyle,
              },
              {
                value: 0,
                name: "",
                itemStyle: placeHolderStyle,
              },
            ],
          },

          {
            type: "bar",
            data: [0],
            coordinateSystem: "polar",
            name: "06a",
            stack: "a",
          },
        ],
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
  updated(){
    let connectdata = JSON.parse(localStorage.getItem("initData"));
    let oldcost = cost
    cost = connectdata[9]
    this.option = {
        backgroundColor: "transparent",

        color: ["#2078d1", "#8a00ec"],
        tooltip: {
          show: false,
          formatter: "{b} {d}%",
        },
        angleAxis: {
          type: "category",
          z: 10,
          axisLine: {
            color: "#fff",
            lineStyle: {
              width: 1,
              color: "#fff",
            },
          },
        },
        radiusAxis: {
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            color: "#00e3e3",
          },
          axisLine: {
            show: false,
            color: "#fff",
            lineStyle: {
              color: "#fff",
            },
          },
          splitLine: {
            color: "#000",
            lineStyle: {
              type: "dotted",
              color: "rgba(170,170,170,.5)",
            },
          },
        },
        polar: {
          center: ["50%", "50%"],
          radius: 80,
        },
        legend: {
          right: "0%",
          top: "30%",
          orient: "vertical",
          textStyle: {
            color: "#8ed7f6",
            fontSize: "24",
          },
          itemGap: 12,
          data: ["水耗", "能耗"],
        },
        series: [
          {
            name: "Line 1",
            type: "pie",
            clockWise: false,
            radius: [35, 65],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [{
                value: cost[1],
                name: "",
                itemStyle: placeHolderStyle,
              },
              {
                value: 0,
                name: "",
                itemStyle: placeHolderStyle,
              },
              {
                value: cost[0],
                name: "能耗",
                label: labelShow,
              },
              
            ],
          },
          {
            name: "Line 2",
            type: "pie",
            clockWise: false,
            radius: [40, 65],
            itemStyle: dataStyle,
            hoverAnimation: false,

            data: [
              
              {
                value: cost[1],
                name: "水耗",
                label: labelShow,
              },{
                value: cost[0],
                name: "",
                itemStyle: placeHolderStyle,
              },
              {
                value: 0,
                name: "",
                itemStyle: placeHolderStyle,
              },
            ],
          },

          {
            type: "bar",
            data: [0],
            coordinateSystem: "polar",
            name: "06a",
            stack: "a",
          },
        ],
    }
    if(JSON.stringify(oldcost) !== JSON.stringify(cost)){
      this.cost = cost
      if (this.myChart) {
      // 销毁旧的图表实例
      this.myChart = null;
      }
      // 重新初始化图表实例
      this.myChart = echarts.init(this.$refs.pie);

      // 设置新的配置项
      this.option && this.myChart.setOption(this.option);

      // 设置缩放比例和缩放原点
      const scaleRatio = 0.62;
      this.myChart
        .getZr()
        .painter.getViewportRoot().style.transform = `scale(${scaleRatio})`;
      this.myChart.getZr().painter.getViewportRoot().style.transformOrigin =
        "left top";

      // 调整图表尺寸
      this.myChart.resize();
    }
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.pie);

    this.option && this.myChart.setOption(this.option);
    const scaleRatio = 0.62; // 缩放比例
    this.myChart
      .getZr()
      .painter.getViewportRoot().style.transform = `scale(${scaleRatio})`;
    this.myChart.getZr().painter.getViewportRoot().style.transformOrigin =
      "left top";
    this.myChart.resize();
  },
};
</script>
<style scoped>
.pie {
  position: absolute;
  left: 10%;
  width: 33.1414vw;
  height: 19.3513vw;
  transform: translate(-3vw, 1.736vw);
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
