<template>
  <div>
    <dv-scroll-board
      class="place"
      :config="status"
      style="width: 97%; height: 95%; top: 8px"
      @click="openPopup"
    />
    <div v-if="showPopup" class="popup-overlay" @click="closePopup"></div>
    <div v-if="showPopup" class="popup">
      <dv-border-box-12
        style="
          height: 10vw;
          width: 18vw;
          position: absolute;
          padding-left: 0.6vw;
          padding-top: 0.6vw;
          z-index: 4;
          font-size: 1vw;
          line-height: 2vw;
          white-space: pre-wrap;
          overflow: auto;
          user-select: none;
          color: #00ffffcc;
        "
        >
        <p>时    间:  10月10日23:18</p>
        <p>名    称:  气体控制报警</p>
        <p>诊断信息:  压力过低</p>
        <p>优化建议:  重启设备</p></dv-border-box-12
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false,
      status: {
        waitTime: 4000,
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        align: ["center"],
        header: ["时间", "名称", "诊断信息", "优化建议"],
        row: "",
        rowNum: 2,
        columnWidth: [159, 159, 159, 159],
        data: [
          [
            "<span style='color: #00ffff;font-size:18px;'>10月10日23:18</span>",
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
  methods: {
    openPopup() {
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
  },
  destroyed() {
    // 组件销毁时，确保移除事件监听器
    document.removeEventListener("click", this.handleOutsideClick);
  },
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup {
  position: fixed;
  top: 45%;
  left: 55%;
  transform: translate(-50%, -50%);
  /* background-color: #fff; */
  padding: 20px;
  border-radius: 4px;
}

.popup-content {
  /* 自定义弹窗内容的样式 */
  height: 10vw;
  width: 18vw;
  position: absolute;
  left: 1vw;
  top: 0.5vw;
  z-index: 4;
  font-size: 1vw;
  line-height: 1.2vw;
}
</style>
