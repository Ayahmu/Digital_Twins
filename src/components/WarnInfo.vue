<template>
  <div>
    <dv-scroll-board
      class="place"
      :config="status"
      style="width: 97%; height: 95%; top: 8px"
      @click="dialogVisible = true"
    />

    <dv-border-box-13>
      <el-dialog
        modal
        modal-append-to-body
        append-to-body
        title="报警信息详情"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <span
          ><el-table :data="tableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="发生时间">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="警报类型">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>

                  <el-form-item label="诊断信息">
                    <span>{{ props.row.desc }}</span>
                  </el-form-item>
                  <el-form-item label="优化建议">
                    <span>{{ props.row.adv }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="时间" prop="id"> </el-table-column>
            <el-table-column label="名称" prop="name"> </el-table-column>
            <el-table-column label="诊断信息" prop="desc"> </el-table-column>
            <el-table-column label="优化建议" prop="adv">
            </el-table-column> </el-table
        ></span> </el-dialog
    ></dv-border-box-13>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
    
        {
          id: "Mesh.4124",
          name: "气体控制报警",

          desc: "设备状态异常",
          adv: "建议重启设备",
        },
        {
          id: "Mesh.1449",
          name: "净化单元报警",

          desc: "设备参数错误",
          adv: "建议重启设备",
        },
       
      ],
      dialogVisible: false,

      status: {
        waitTime: 4000,
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        align: ["center"],
        header: ["时间", "名称", "诊断信息", "优化建议"],
        row: "",
        rowNum: 2,
        columnWidth: [159,159,159,159],
        data: [
          [
            "<span style='color: #00ffff;font-size:18px;'>9月10日23:18</span>",
            "<span style='color: #00ffff;font-size:18px;'>气体控制报警</span>",
            "<span style='color: #ff0000;font-size:18px;'>压力过低</span>",
            "<span style='color: #ffc700;font-size:18px;'>重启设备</span>",
          ],
          // [
          //   "<span style='color: #00ffff;font-size:18px;'>Mesh.1449</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>净化单元报警</span>",
          //   "<span style='color: #ff0000;font-size:18px;'>异常</span>",
          //   "<span style='color: #ffc700;font-size:18px;'>点击查看</span>",
          // ],
          // [
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          // ],
          // [
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          // ],
          // [
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          // ],
          // [
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          // ],
          // [
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          // ],
          // [
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          // ],
          // [
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          // ],
          // [
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          //   "<span style='color: #00ffff;font-size:18px;'>1</span>",
          // ],
        ],
      },
    };
  },
  // methods: {
  //   handleClose(done) {
  //     this.$confirm("确认关闭？")
  //       .then((_) => {
  //         done();
  //       })
  //       .catch((_) => {});
  //   },
  // },

  //   methods: {
  //     chooseModule(module) {
  //       console.log(module.row);
  //       alert("111");
  //       //设备详情界面跳转预留区
  //       //
  //       //
  //       //
  //       //
  //     },
  //   },
};
</script>
<style scoped>
.dialog {
  width: 80%;
  height: 80%;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
