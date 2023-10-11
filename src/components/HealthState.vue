<template>
  <div class="basic">
    <span class="title" style="">系统健康状态</span>
    <dv-decoration-9 class="picture">
      <span class="number">99%</span></dv-decoration-9
    >
    <div class="icon">
      <el-row>
        <el-col :span="6"><div class="content">氢气品质</div></el-col>
        <el-col :span="3"> <div class="circle"></div> </el-col>

        <el-col :span="6"><div class="content">漏氢状态</div></el-col>
        <el-col :span="6"> <div class="circle"></div> </el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><div class="content">漏液状态</div></el-col>
        <el-col :span="3"> <div class="circle"></div> </el-col
        ><el-col :span="6"><div class="content">制氢纯度</div></el-col>
        <el-col :span="6"> <div class="circle"></div>  </el-col>
      </el-row>
      <el-row
        ><el-col :span="6"><div class="content">制氢电压</div></el-col>
        <el-col :span="3"> <div class="circle"></div>  </el-col>
        <el-col :span="6"><div class="content">提纯状态</div></el-col>
        <el-col :span="6"> <div class="circle"></div> </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: true,
      value2: true,
      value3: true,
      value4: true,
      value5: true,
      value6: true,
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
  height: 100%;
  cursor: default;
}
.content {
  position: relative;
  height: 1.5vw;
  background-color: transparent;
  color: #1563bc;
  font-size: 1vw;
}
span {
  text-align: center;
  background-image: linear-gradient(to bottom, white, #48c8ff);
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
  transform: translate(15px, 42px);
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
  background-color: green;
  text-align: bottom;
  transform: translate(0px,0.4vw);
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
