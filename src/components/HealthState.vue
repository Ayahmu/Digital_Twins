<template>
  <div class="basic">
    <span class="title" style="transform:translateX(0.5vw)">系统健康状态</span>
    <dv-decoration-9 class="picture">
      <span class="number">{{ number }}%</span></dv-decoration-9
    >
    <div class="icon">
      <el-row>
        <el-col :span="6"><div class="content">氢气品质</div></el-col>
        <el-col :span="3">
          <div class="circle" :style="{ backgroundColor: choosecolor1 }"></div>
        </el-col>

        <el-col :span="6"><div class="content">漏氢状态</div></el-col>
        <el-col :span="6">
          <div class="circle" :style="{ backgroundColor: choosecolor2 }"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><div class="content">漏液状态</div></el-col>
        <el-col :span="3">
          <div
            class="circle"
            :style="{ backgroundColor: choosecolor3 }"
          ></div> </el-col
        ><el-col :span="6"><div class="content">制氢功率</div></el-col>
        <el-col :span="6">
          <div class="circle" :style="{ backgroundColor: choosecolor4 }"></div>
        </el-col>
      </el-row>
      <el-row
        ><el-col :span="6"><div class="content">制氢状态</div></el-col>
        <el-col :span="3">
          <div class="circle" :style="{ backgroundColor: choosecolor5 }"></div>
        </el-col>
        <el-col :span="6"><div class="content">提纯状态</div></el-col>
        <el-col :span="6">
          <div class="circle" :style="{ backgroundColor: choosecolor6 }"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import connectdata from "../connect.js";
let healthlevel = connectdata[1];
let number = healthlevel[0];
let choosecolor1,
  choosecolor2,
  choosecolor3,
  choosecolor4,
  choosecolor5,
  choosecolor6;
if (healthlevel[1] == 0) {
  choosecolor1 = "#fc2100";
} else if (healthlevel[1] == 1) {
  choosecolor1 = "rgb(0, 158, 0)";
}
if (healthlevel[2] == 0) {
  choosecolor2 = "#fc2100";
} else if (healthlevel[2] == 1) {
  choosecolor2 = "rgb(0, 158, 0)";
}
if (healthlevel[3] == 0) {
  choosecolor3 = "#fc2100";
} else if (healthlevel[3] == 1) {
  choosecolor3 = "rgb(0, 158, 0)";
}
if (healthlevel[4] == 0) {
  choosecolor4 = "#fc2100";
} else if (healthlevel[4] == 1) {
  choosecolor4 = "rgb(0, 158, 0)";
}
if (healthlevel[5] == 0) {
  choosecolor5 = "#fc2100";
} else if (healthlevel[5] == 1) {
  choosecolor5 = "rgb(0, 158, 0)";
}
if (healthlevel[6] == 0) {
  choosecolor6 = "#fc2100";
} else if (healthlevel[6] == 1) {
  choosecolor6 = "rgb(0, 158, 0)";
}

export default {
  data() {
    return {
      number,
      choosecolor1,
      choosecolor2,
      choosecolor3,
      choosecolor4,
      choosecolor5,
      choosecolor6,
    };
  },
};
</script>
<style scoped>
el-switch {
  transform: translate(100px, -200px);
}
.icon {
  float: left;
  width: 340px;
  height: 105px;
  position: absolute;
  top: 35%;
  left: 45%;
}
.basic {
  position: relative;
  height: 120%;
  cursor: default;
}
.content {
  position: relative;
  height: 1.5vw;
  background-color: transparent;
  color: #00ffff;
  font-size: 1vw;
}
span {
  text-align: center;
  background-image: linear-gradient(to bottom, white, #48c8ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  left: -15px;
  position: absolute;
  top: 22px;
  z-index: 222;
  font-size: 27px;
  width: 100%;
}
.picture {
  width: 178px;
  height: 178px;
  float: left;
  transform: translate(15px, 3.5vw);
}
.number {
  color: #29eef3;
  font-size: 37px;
  position: absolute;
  top: 68px;
  left: 0px;
}
el-button {
  align-items: center;
}
.circle {
  position: relative;
  width: 0.8vw;
  height: 0.8vw;
  border-radius: 50%;
  background-color: rgb(0, 158, 0);
  text-align: bottom;
  transform: translate(0px, 0.4vw);
}

.circle::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  /* background-color: white; */
}
</style>
