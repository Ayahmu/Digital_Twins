<template>
  <div style="height: 2.2166vw; width: 120%; transform: translate(7px, -9px)">
    <el-form
      :inline="true"
      :model="formInline"
      :rules="rules"
      class="demo-form-inline"
      ref="ruleForm"
    >
      <el-form-item label="" prop="id">
        <el-input v-model="formInline.id" placeholder="设备编号或名称" style="width: 15vw" @keyup.enter.native="submitForm('ruleForm')"></el-input>
      </el-form-item>
      <!-- <el-form-item label="" prop="name">
         <el-input v-model="formInline.name" placeholder="设备名称"  style="width: 158px"> </el-input> -->
      <!-- </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >搜索</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {searchModel} from "@/model";
import { provide } from 'vue';
export default {
  data() {
    return {

      rules: {
        id: [{ required: true, message: "输入不能为空", trigger: "blur" }],
        // name: [{ required: true, message: "输入不能为空 ", trigger: "blur" }],
      },
      formInline: {
        id: "",
        // name: "",
      },
    };
  },

  methods: {
    submitForm(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$bus.$emit("fn", this.formInline.id);
          //这里只传名字或编号给轮播图,后续点击旋转事件都放在轮播图的位置
        //  searchModel(this.formInline.id);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$bus.$emit("reset", 1);
    },
  },
};
</script>
