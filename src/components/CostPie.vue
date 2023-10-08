<template>
  <div>
    <div class="box">电解水制氢成本占比</div>
    <dv-active-ring-chart
      :config="config"
      style="width: 320px; height: 320px; transform: translate(76px, 1px)"
    />
    <div class="pie" ref="pie" style="width: 480px; height: 390px"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      config: {
        // 
        lineWidth:33,
        activeTimeGap: 5000,
        data: [
          {
            name: "电  费",
            value: 85.3,
          },
          {
            name: "固定成本",
            value: 7.8,
          },
          {
            name: "水  费",
            value: 2.8,
          },
          {
            name: "设备维护",
            value: 4.1,
          },
        ],
        color: ['#00ffff','#00cfff','#006ced','#ffe000'],
        digitalFlopToFixed: 1,
      },
    };
  },
  mounted() {
    const data = [
      {
        name: "电  费",
        value: 85.3,
      },
      {
        name: "固定成本",
        value: 7.8,
      },
      {
        name: "水  费",
        value: 2.8,
      },
      {
        name: "设备维护",
        value: 4.1,
      },
    ];
    this.myChart = echarts.init(this.$refs.pie);
    this.option = {
      color: ['#00ffff','#00cfff','#006ced','#ffe000'],
      legend: {
        top: "35%",
        left: "34%",
        textStyle: {
          color: "#1563bc",
          fontSize: 25,
        },
        icon: "roundRect",
        data: [
          {
            name: "电  费",
            value: 85.3,
          },
          {
            name: "固定成本",
            value: 7.8,
          },
          {
            name: "水  费",
            value: 2.8,
          },
          {
            name: "设备维护",
            value: 4.1,
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
  position: relative;
  left: 30%;
  width: 50px;
  height: 20px;
  transform: translate(-12px, -195px);
  //position: relative;
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
  font-size: 27px;
  width: 100%;

}
</style>
