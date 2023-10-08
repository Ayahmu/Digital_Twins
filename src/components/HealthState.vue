<template>
  <div class="basic">
   <span class="title"
    style="
        text-align: center;
        background-image: linear-gradient(to bottom, white, #48c8ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        position: relative;
        z-index: 2;
        font-size: 27px;
        width: 100%;
      ">系统健康状态</span>
    <dv-decoration-9 style="width: 188px; height: 188px; float: left; transform:translate(15px, 35px)">
      <span  class="number">99%</span></dv-decoration-9
    >
    <div class="icon">
      <el-row>
        <el-col :span="6"><div class="content">氢气品质</div></el-col>
        <el-col :span="3">
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            circle
          ></el-button>
        </el-col>

        <el-col :span="6"  ><div class="content">漏氢状态</div></el-col>
        <el-col :span="6">
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            circle
          ></el-button
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><div class="content">漏液状态</div></el-col>
        <el-col :span="3">
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            circle
          ></el-button> </el-col
        ><el-col :span="6"><div class="content">制氢纯度</div></el-col>
        <el-col :span="6">
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            circle
          ></el-button
        ></el-col>
      </el-row>
      <el-row
        ><el-col :span="6"><div class="content">制氢电压</div></el-col>
        <el-col :span="3">
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            circle
          ></el-button>
        </el-col>
        <el-col :span="6"><div class="content">提纯状态</div></el-col>
        <el-col :span="6">
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            circle
          ></el-button
        ></el-col>
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
}
.content {
  position: relative;
  height: 30px;
  background-color: transparent;
  color: #1563bc;
  font-size: 20px;
}
span{
  background-image: linear-gradient(to bottom, white, #48c8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  font-size: 27px;

  top: 31px;
  left: 10%;
  font-family: "Arial";
}
.number{
  color: #29eef3; font-size: 37px;
  position: absolute;
  top: 68px;
  left: 58px;
}
</style>

