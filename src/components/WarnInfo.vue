<template>
  <div>
    <dv-scroll-board
      class="place"
      :config="status"
      style="width: 97%; height: 90%; top: 0.5vw"
      @click="openPopup"
    />
    <div v-if="showPopup" class="popup-overlay" @click="closePopup"></div>

    <div v-show="showPopup" class="popup" ref="showarea">
      <dv-border-box-12
        style="
          height: 10vw;
          width: 18vw;
          position: absolute;
          left: -5vw;
          padding-left: 0.6vw;
          padding-top: 0.6vw;
          z-index: 4;
          font-size: 1.2vw;
          line-height: 2.2vw;
          white-space: pre-wrap;
          overflow: auto;
          user-select: none;
          color: #00ffffcc;
        "
      >
        <p>时 间: 10月10日23:18</p>
        <p>名 称: 气体控制报警</p>
        <p>诊断信息: 压力过低</p>
        <p>优化建议: 重启设备</p></dv-border-box-12
      >
    </div>
  </div>
</template>

<script>
import connectdata from "../connect.js";
let alarm = connectdata[15];
export default {
  data() {
    return {
      alarm,
      formattedAlarms: "",
      showPopup: false,
      status: {
        waitTime: 4000,
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        align: ["center"],
        header: [
          "<span style='color: #fff;font-size:15px;'>时间</span>",
          "<span style='color: #fff;font-size:15px;'>名称</span>",
          ,
          "<span style='color: #fff;font-size:15px;'>诊断信息</span>",
          ,
          "<span style='color: #fff;font-size:15px;'>优化建议</span>",
        ],
        row: "",
        rowNum: 2,
        columnWidth: [159, 159, 159, 159],
        data: [
          [
            "<span style='color: #00ffff;font-size:15px;'>10月10日23:18</span>",
            "<span style='color: #00ffff;font-size:15px;'>气体控制报警</span>",
            "<span style='color: #ff0000;font-size:15px;'>压力过低</span>",
            "<span style='color: #ffc700;font-size:15px;'>重启设备</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:15px;'>Mesh.1449</span>",
            "<span style='color: #00ffff;font-size:15px;'>净化单元报警</span>",
            "<span style='color: #ff0000;font-size:15px;'>异常</span>",
            "<span style='color: #ffc700;font-size:15px;'>点击查看</span>",
          ],
        ],
      },
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    openPopup(module) {
      console.log();
      this.$refs.showarea.innerHTML = ` <dv-border-box-12
        style="
          height: 12vw;
          width: 18vw;
          position: absolute;
          left: -5vw;
          padding-left: 0.6vw;
          padding-top: 0.6vw;
          z-index: 4;
          font-size: 1.2vw;
          line-height: 2.2vw;
          overflow: auto;
          user-select: none;
          color: #00ffffcc;
          border:0.3vw solid #3065a1
        "
      >
        <p>时 间: ${alarm[module.rowIndex].datetime}</p>
        <p>编 号: ${alarm[module.rowIndex].id}</p>
        <p>名 称: ${alarm[module.rowIndex].name}</p>
        <p>诊断信息: ${alarm[module.rowIndex].diagnosis}</p>
        <p>优化建议: ${alarm[module.rowIndex].optimization}</p>
        </dv-border-box-12>`;
      this.showPopup = true;
      // 添加事件监听器，点击任意弹窗外内容时关闭弹窗
      document.addEventListener("click", this.handleOutsideClick);
    },
    closePopup() {
      this.showPopup = false;
      // 移除事件监听器
      document.removeEventListener("click", this.handleOutsideClick);
    },
    handleOutsideClick(event) {
      // 检查点击事件是否发生在弹窗外部
      if (
        this.$refs.popup &&
        !this.$refs.popup.contains(event.target) &&
        this.showPopup
      ) {
        this.closePopup();
      }
    },
    update() {
      this.formattedAlarms = this.alarm.map((item) => [
        `<span style='color: #00ffff;font-size:15px;'>${item.datetime}</span>`,
        `<span style='color: #00ffff;font-size:15px;'>${item.name}</span>`,
        `<span style='color: #ff0000;font-size:15px;'>${item.diagnosis}</span>`,
        `<span style='color: #ffc700;font-size:15px;'>${item.optimization}</span>`,
      ]);
      this.status = {
        waitTime: 4000,
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        align: ["center"],
        header: [
          "<span style='color: #fff;font-size:15px;'>时间</span>",
          "<span style='color: #fff;font-size:15px;'>名称</span>",
          "<span style='color: #fff;font-size:15px;'>诊断信息</span>",
          "<span style='color: #fff;font-size:15px;'>优化建议</span>",
        ],
        row: "",
        rowNum: 2,
        columnWidth: [159, 179, 150, 150],
        data: this.formattedAlarms,
      };
    },
  },
  destroyed() {
    // 组件销毁时，确保移除事件监听器
    // document.removeEventListener("click", this.handleOutsideClick);
  },
};
</script>

<style scoped>
.popup-overlay {
  position: absolute;
  top: -80vw;
  left: -120vw;
  width: 250vw;
  height: 250vw;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.popup {
  position: fixed;
  top: 45%;
  left: -55%;
  transform: translate(-50%, -50%);
  /* background-color: #fff; */
  padding: 20px;
  border-radius: 4px;
  z-index: 101;
}

.popup-content {
  /* 自定义弹窗内容的样式 */
  height: 10vw;
  width: 18vw;
  position: absolute;
  left: -11vw;
  top: 0.5vw;
  z-index: 4;
  font-size: 1.5vw;
  line-height: 1.8vw;
}
</style>
