<template>
  <div>
    <div class="box">电解水制氢成本占比</div>
    <dv-active-ring-chart
      :config="config"
      style="width: 14.5944vw; height: 14.5944vw; transform: translate(0.0957vw, 0.5vw)"
    />
    <div class="pie" ref="pie" style="width: 12.1414vw; height: 19.3513vw"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
// import * as chartUtils from '../chartUtils.js';
export default {
  data() {
    return {
      config: {
        // digitalFlopStyle: {
 digitalFlopStyle: {
  fontSize: 18,
  fill: '#fff'
},
        lineWidth:25,
        activeTimeGap: 6000,
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
  methods:{
    
      getViewportWidth() {
        return window.innerWidth || document.documentElement.clientWidth;
      },
  
      calculateLabelSize() {
        var viewportWidth = this.getViewportWidth();
        var labelSize = viewportWidth * 0.01; // 假设为视口宽度的1%
        return labelSize;
      }
    
  },
  mounted() {
 const ba=this.calculateLabelSize();

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
        // top: "-3%",
        left: "41%",
        orient: 'vertical',
        textStyle: {
          color: "#4edbff",
          fontSize: 1.0556*ba+"px",
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
