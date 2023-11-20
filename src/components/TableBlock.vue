<template>
  <div @click="handleClick" class="bigtable" ref="parentRef">
    <div class="block" ref="childRef">
      <dv-border-box-8 style="width: 100%; height: 100%"
        ><div class="title" data-id="1">氢气压力</div>
        <p>{{parameters[0]}}</p>
        <span>kPa</span></dv-border-box-8
      >
    </div>
    <div class="block" ref="childRef">
      <dv-border-box-8 style="width: 100%; height: 100%"
        ><div class="title" data-id="2">制氢浓度</div>
        <p>{{parameters[1]}}</p>
        <span>%</span></dv-border-box-8
      >
    </div>
    <div class="block" ref="childRef">
      <dv-border-box-8 style="width: 100%; height: 100%"
        ><div class="title" data-id="3">氢气湿度</div>
        <p>{{parameters[2]}}</p>
        <span>℃</span></dv-border-box-8
      >
    </div>
    <div class="block" ref="childRef">
      <dv-border-box-8 style="width: 100%; height: 100%"
        ><div class="title" data-id="4">制氢流量</div>
        <p>{{parameters[3]}}</p>
        <span>Nm³/h</span></dv-border-box-8
      >
    </div>
    <div class="block">
      <dv-border-box-8 style="width: 100%; height: 100%"
        ><div class="title" data-id="5">制氢能耗</div>
        <p>{{parameters[4]}}</p>
        <span>kWh/Nm³</span></dv-border-box-8
      >
    </div>
    <div class="block">
      <dv-border-box-8 style="width: 100%; height: 100%"
        ><div class="title" data-id="6">制氢水耗</div>
        <p>{{parameters[5]}}</p>
        <span>L/kg</span></dv-border-box-8
      >
    </div>
  </div>
</template>
<script>

import connectdata from "../connect.js";
let parameters = connectdata[2];
export default {
  data(){
    return{
  parameters
    }
  },
  methods: {
    handleClick(event) {
      if (event.target.parentNode.childNodes[0].tagName === "DIV") {
        // console.log(event.target.parentNode.childNodes[0].innerText);

        this.$bus.$emit(
          "messageEvent",
          event.target.parentNode.childNodes[0].dataset.id
        );
        // console.log(event.target.parentNode.childNodes[0].dataset.id);
      }
    },
  },
};
</script>
<style lang="css" scoped>
.bigtable {
  padding: 3px;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  /* align-content: center; */
}
.block {
  flex: 0 1 49%;
  /* width: 33%; */

  height: 32%;
}
.title {
  transform: translate(-19px, 6px);
  font-size: 20px;
  color: #32c5e9;
}
p {
  font-family: "Digital-7", Arial, sans-serif;
  transform: translate(119px, 50%);
  font-size: 24px;
  color: #fc2e00;


  display: inline-block;
}
span {
  font-family: "Digital-7", Arial, sans-serif;
  font-size: 25px;
  display: inline-block;
  transform: translate(122px, 50%);
  color: #51c8ef;
}
</style>
