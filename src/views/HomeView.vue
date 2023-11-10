<template xmlns="http://www.w3.org/1999/html">
  <div class="content bg">
    <dv-decoration-5
      :dur="3"
      style="
        position: absolute;
        width: 20%;
        height: 40px;
        left: 40%;
        top: 2%;
        z-index: 3;
      "
    />
    <div id="fpsDisplay" style="z-index: 2"></div>
    <div
      id="model"
      style="position: absolute; width: 100%; height: 100%; z-index: 2"
    ></div>
    <label class="container" id="bell">
      <input type="checkbox" checked="checked" class="checkbox" />
      <svg
        class="bell-solid"
        id="bell-solid"
        height="1em"
        viewBox="0 0 448 512"
      >
        <path
          d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"
        ></path>
      </svg>
    </label>
    <dv-border-box-12
      id="info-label"
      style="
        height: 12vw;
        width: 20vw;
        position: absolute;
        left: 0;
        z-index: 4;
        display: none;
      "
    >
      <div
        style="
          position: absolute;
          left: 5%;
          top: 5%;
          width: 90%;
          height: 90%;
          font-size: 0.8vw;
          color: #00ffffcc;
          word-break: normal;
          white-space: pre-line;
          overflow: auto;
          user-select: none;
        "
      >
        <p class="info-title" id="modelName">设备名称:</p>
        <p class="info-title" id="modelID">设备编号:</p>
        <p class="info-title" id="modelInfo">设备描述:</p>
        <p class="info-title" id="modelState">设备状态:</p>
        <p class="info-title" id="modelManual" style="cursor: pointer">
          设备资料:
        </p>
        <div class="info-title" id="modelUrl" style="cursor: pointer">
          设备说明书
        </div>
        <p class="info-title" id="modelSpare">备件信息:</p>
      </div>
    </dv-border-box-12>
    <!--<div class="nav_btn" @click="sendMessage">
      <div class="btn_right">
        <button id="back_btn" class="back-button">
          <img
            src="../../public/icons/返回.png"
            alt="Icon"
            class="icon"
            title="返回"
          />
        </button>
      </div>
    </div>
    暂时去掉按钮提高美观度-->

    <div>
      <dv-decoration-7
        style="
          width: 412px;
          height: 1.8136vw;
          position: absolute;
          top: 6%;
          left: 50%;
          transform: translate(24.21158vw, -2vw);
          font-family: Digital-7;
          font-weight: bold;
          font-size: 1.8136vw;
          color: rgb(0, 255, 255);
          z-index: 22;
        "
        >{{ currentDateTime }}</dv-decoration-7
      >
      <div class="text" style="z-index: 3; top: 9vw" id="home_btn">
        <p @click="consoleLog" style="cursor: pointer">智能氢气控制系统</p>
      </div>
      <!-- 左三个 -->
      <div
        style="
          position: absolute;
          width: 25%;
          height: 37.5vw;
          top: 9vw;
          z-index: 3;
          transform: scale(0.8);
          transform-origin: top left;
        "
      >
        <!-- 第一部分 -->

        <dv-border-box-12
          style="
            width: 100%;
            height: 10.07556vw;
            padding-top: 40px;
            transform: translate(0px, 28px);
            position: relative;
            top: -25px;
            left: 0;
            background-color: rgba(0, 0, 0, 0.22);
            border-radius: 1vw;
            margin-bottom: 1.5vw;
          "
        >
          <div class="three">
            <div class="one">运行</div>
            <!-- <div class="one"></div> -->
            <div class="one">运行</div>
            <div class="one" style="transform: translate(-2vw, 0vw)">
              960.18MV
            </div>
          </div>
          <div class="total">
            <div class="unitname">机组状态</div>
            <div class="unitname">系统状态</div>
            <div class="unitname">机组负荷</div>
          </div>

          <div class="title">
            <!-- 当前时间 -->
            <!-- <dv-decoration-6 style="width: 250px; height: 60px" /> -->
          </div>

          <UnitPanel></UnitPanel>
          <SystemPanel></SystemPanel>
          <UnitPower></UnitPower>
        </dv-border-box-12>

        <!-- 第二部分 -->
        <dv-border-box-12
          style="
            width: 100%;
            height: 12.09068vw;
            left: 0;
            background-color: rgba(0, 0, 0, 0.22);
            margin-bottom:1.5vw
            border-radius: 1vw;
          "
          ><HealthState></HealthState>
        </dv-border-box-12>

        <!-- 第三部分 -->
        <dv-border-box-12
          style="
            width: 100%;
            height: 11.5869vw;
            left: 0;
            background-color: rgba(0, 0, 0, 0.22);
            border-radius: 1vw;
          "
        >
          <TableBlock></TableBlock>
        </dv-border-box-12>
      </div>
      <!--右侧盒子-->
      <div
        style="
          position: absolute;
          right: 0;
          width: 25%;
          height: 37.5vw;
          z-index: 3;
          top: 9vw;
          transform: scale(0.8);
          transform-origin: top right;
        "
      >
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
            <p>时 间: 10月10日23:18</p>
            <p>名 称: 气体控制报警</p>
            <p>诊断信息: 压力过低</p>
            <p>优化建议: 重启设备</p></dv-border-box-12
          >
        </div>
        <!-- 搜索部分 -->

        <SearchItem></SearchItem>

        <!-- 设备信息轮播表，跳转入口 -->
        <dv-border-box-12
          style="
            width: 100%;
            height: 15.0629vw;
            background-color: rgba(0, 0, 0, 0.22);
            border-radius: 1vw;
            margin-bottom: 1.5vw;
          "
          ><dv-scroll-board
            class="place"
            :config="status"
            ref="scrollBoard"
            style="
              width: 97%;
              height: 95%;
              top: 8px;
              z-index: 77;
              position: absolute;
            "
            @click="chooseModule"
          />
        </dv-border-box-12>
        <dv-border-box-12
          style="
            width: 100%;
            height: 6.19647vw;
            background-color: rgba(0, 0, 0, 0.22);
            margin-bottom: 1.5vw;
            border-radius: 1vw;
          "
          ><WarnInfo></WarnInfo
        ></dv-border-box-12>

        <dv-border-box-12
          style="
            width: 100%;
            height: 12.9921vw;
            background-color: rgba(0, 0, 0, 0.22);
            border-radius: 1vw;
          "
        >
          <LineChart></LineChart>
        </dv-border-box-12>
      </div>

      <!-- 下方盒子 -->
      <div
        class="module-box"
        style="
          transform: scale(1, 0.85);
          transform-origin: bottom;

          position: absolute;
          height: 16.06297vw;
          top: 42.366vw;
          width: 100%;
          z-index: 3;
        "
      >
        <!-- 一号 -->
        <div style="flex-basis: 25%">
          <dv-border-box-12
            style="
              width: 100%;
              height: 85%;
              background-color: rgba(0, 0, 0, 0.3);
              border-radius: 1vw;
            "
            ><PageGather></PageGather
          ></dv-border-box-12>
        </div>
        <!-- 二号 -->
        <div style="flex-basis: 25%">
          <dv-border-box-12
            style="
              width: 100%;
              height: 85%;
              background-color: rgba(0, 0, 0, 0.22);
            "
            ><CostPie></CostPie
          ></dv-border-box-12>
        </div>
        <!-- 三号 -->
        <div style="flex-basis: 25%">
          <dv-border-box-12
            style="
              width: 100%;
              height: 85%;
              background-color: rgba(0, 0, 0, 0.22);
              border-radius: 1vw;
            "
          >
            <TimeCompare></TimeCompare>
          </dv-border-box-12>
        </div>
        <!-- 四号 -->
        <div style="flex-basis: 25%">
          <dv-border-box-12
            style="
              width: 100%;
              height: 85%;
              background-color: rgba(0, 0, 0, 0.22);
              border-radius: 1vw;
            "
          >
            <DoublePole></DoublePole>
          </dv-border-box-12>
        </div>
      </div>
      <!-- 最底部装饰盒子 -->
      <!-- <div class="max">
          <div class="first">
            <dv-decoration-10
              style="width: 92%; height: 10px"
              :color="['#00ffff', '#5558f0']"
              :dur="10"
            />
          </div>
          <div class="second">
            <dv-decoration-8
              style="width: 300px; height: 50px; flex-basis: 33%"
              :color="['#7ce7fd', '#7ce7fd']"
            />

            <dv-decoration-6
              style="width: 300px; height: 60px; flex-basis: 33%"
              :color="['#00ffff', '#00ffff']"
            />
            <dv-decoration-8
              :reverse="true"
              style="width: 300px; height: 50px; flex-basis: 33%"
              :color="['#7ce7fd', '#7ce7fd']"
            />
          </div>
        </div>  -->
    </div>
  </div>
</template>

<script>
import * as model from "../model.js";
import * as connect from "../connect";

import UnitPanel from "../components/UnitPanel.vue";
import SystemPanel from "../components/SyetemPanel.vue";
import UnitPower from "../components/UnitPower.vue";
import TableBlock from "../components/TableBlock.vue";
import DoublePole from "../components/DoublePole.vue";
import LineChart from "../components/LineChart.vue";
import CostPie from "../components/CostPie.vue";
import TimeCompare from "../components/TimeCompare.vue";
import HealthState from "../components/HealthState.vue";
import PageGather from "@/components/PageGather.vue";
import WarnInfo from "@/components/WarnInfo.vue";
import SearchItem from "@/components/SearchItem.vue";

export default {
  name: "HomeView",
  data() {
    return {
      showPopup: false,
      currentDateTime: "",
      status: {
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        columnWidth: [153, 255, 71],
        align: ["center", "center", "center"],
        header: ["编号", "设备名称", "状态"],
        row: "",
        rowNum: 4,
        waitTime: 5000,
        data: [
          [
            "<span style='color: #00ffff;font-size:18px;'>Mesh.2971</span>",
            "<span style='color: #00ffff;font-size:18px;'>气体控制柜门</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:18px;'>10QM023</span>",
            "<span style='color: #00ffff;font-size:18px;'>电磁阀</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:18px;'>10QM009</span>",
            "<span style='color: #00ffff;font-size:18px;'>气动球阀</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:18px;'>20QM410</span>",
            "<span style='color: #00ffff;font-size:18px;'>氢气阻火器</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:18px;'>20QM028</span>",
            "<span style='color: #00ffff;font-size:18px;'>阻断阀</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:18px;'>10BP102</span>",
            "<span style='color: #00ffff;font-size:18px;'>压力变送器</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:18px;'>10KF102</span>",
            "<span style='color: #00ffff;font-size:18px;'>氢气分析仪</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:18px;'>30BL001</span>",
            "<span style='color: #00ffff;font-size:18px;'>浮球液位计</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:18px;'>30PG101</span>",
            "<span style='color: #00ffff;font-size:18px;'>压力表</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
          [
            "<span style='color: #00ffff;font-size:18px;'>10BF503</span>",
            "<span style='color: #00ffff;font-size:18px;'>常压流量计</span>",
            "<span style='color: #00ffff;font-size:18px;'>正常</span>",
          ],
        ],
      },
      searchList: [
        { ID: "Mesh.2971", Name: "气体控制柜门", State: "正常" },
        { ID: "Mesh.1898", Name: "净化单元柜门", State: "正常" },
        { ID: "Mesh.633", Name: "制氢单元柜门", State: "正常" },
        { ID: "10QM018", Name: "电磁阀", State: "正常" },
        { ID: "10QM023", Name: "电磁阀", State: "正常" },
        { ID: "10QM028", Name: "电磁阀", State: "正常" },
        { ID: "10QM401", Name: "电磁阀", State: "正常" },
        { ID: "10QM402", Name: "电磁阀", State: "正常" },
        { ID: "10QM403", Name: "电磁阀", State: "正常" },
        { ID: "10QM404", Name: "电磁阀", State: "正常" },
        { ID: "10QM614", Name: "电磁阀", State: "正常" },
        { ID: "10QM615", Name: "电磁阀", State: "正常" },
        { ID: "10QM616", Name: "电磁阀", State: "正常" },
        { ID: "30QM109", Name: "电磁阀", State: "正常" },
        { ID: "Mesh.3655", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.4092", Name: "气动球阀", State: "正常" },
        { ID: "10QN001-5", Name: "气动球阀", State: "正常" },
        { ID: "10QM001", Name: "氢站进氢门", State: "正常" },
        { ID: "10QM003", Name: "进空自动门", State: "正常" },
        { ID: "10QN003", Name: "气动球阀", State: "正常" },
        { ID: "10QM015", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.2449", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.2437", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.2427", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.2415", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.2383", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.2398", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.1788", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.2394", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.1151", Name: "气动球阀", State: "正常" },
        { ID: "Mesh.3694", Name: "气动球阀", State: "正常" },
      ],
      nameList: [],
      idList: [],

      displayList: [],
      formatList: [],
    };
  },

  mounted() {
    window.resizeTo(1985, 1240);
    this.updateDateTime(); // 初始化时立即更新日期时间
    setInterval(this.updateDateTime, 1000); // 每秒更新日期时间
  },
  created() {
    this.$bus.$on("fn", this.handleFormEvent);
    this.$bus.$on("reset", this.doReset);
  },
  beforeDestroy() {
    this.$bus.$off("fn", this.handleFormEvent);
    this.$bus.$off("reset", this.doReset);
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    consoleLog() {
      model.resetCamera();
    },
    sendMessage() {
      connect.sendMessage();
    },

    // 模糊搜索备选框由轮播表代替, 不影响原本轮播表的点击事件
    //后续可以使用json配置数据库中的设备信息,此处只使用固定设备信息进行示例
    FormEvent(bus_id) {
      const regex = new RegExp(bus_id, "i");
      // 'i'表示忽略大小写
      this.nameList = this.searchList.filter((item) => item.Name.match(regex));
      this.idList = this.searchList.filter((item) => item.ID.match(regex));
      //两种方式筛选,通过结果长度判断使用的搜索方法
      this.displayList =
        this.idList.length > this.nameList.length ? this.idList : this.nameList;
      this.formatList = this.displayList.map((item) => [
        `<span style='color: #00ffff;font-size:18px;'>${item.ID}</span>`,
        `<span style='color: #00ffff;font-size:18px;'>${item.Name}</span>`,
        `<span style='color: #00ffff;font-size:18px;'>${item.State}</span>`,
      ]);
      this.status = {
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        columnWidth: [153, 255, 71],
        align: ["center", "center", "center"],
        header: ["编号", "设备名称", "状态"],
        row: "",
        rowNum: 4,
        waitTime: 5000,
        data: this.formatList,
      };
    },
    doReset(reset) {
      if (reset == 1) {
        this.status = {
          headerBGC: "#3472bb",
          oddRowBGC: "transparent",
          evenRowBGC: "rgba(122, 202, 236,0.3)",
          columnWidth: [153, 255, 71],
          align: ["center", "center", "center"],
          header: ["编号", "设备名称", "状态"],
          row: "",
          rowNum: 4,
          waitTime: 5000,
          data: [
            [
              "<span style='color: #00ffff;font-size:18px;'>Mesh.2971</span>",
              "<span style='color: #00ffff;font-size:18px;'>气体控制柜门</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
            [
              "<span style='color: #00ffff;font-size:18px;'>10QM023</span>",
              "<span style='color: #00ffff;font-size:18px;'>电磁阀</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
            [
              "<span style='color: #00ffff;font-size:18px;'>10QM009</span>",
              "<span style='color: #00ffff;font-size:18px;'>气动球阀</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
            [
              "<span style='color: #00ffff;font-size:18px;'>20QM410</span>",
              "<span style='color: #00ffff;font-size:18px;'>氢气阻火器</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
            [
              "<span style='color: #00ffff;font-size:18px;'>20QM028</span>",
              "<span style='color: #00ffff;font-size:18px;'>阻断阀</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
            [
              "<span style='color: #00ffff;font-size:18px;'>10BP102</span>",
              "<span style='color: #00ffff;font-size:18px;'>压力变送器</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
            [
              "<span style='color: #00ffff;font-size:18px;'>10KF102</span>",
              "<span style='color: #00ffff;font-size:18px;'>氢气分析仪</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
            [
              "<span style='color: #00ffff;font-size:18px;'>30BL001</span>",
              "<span style='color: #00ffff;font-size:18px;'>浮球液位计</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
            [
              "<span style='color: #00ffff;font-size:18px;'>30PG101</span>",
              "<span style='color: #00ffff;font-size:18px;'>压力表</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
            [
              "<span style='color: #00ffff;font-size:18px;'>10BF503</span>",
              "<span style='color: #00ffff;font-size:18px;'>常压流量计</span>",
              "<span style='color: #00ffff;font-size:18px;'>正常</span>",
            ],
          ],
        };
      }
    },

    chooseModule(module) {
      console.log(module.row);
      alert("暂无详细设备信息");
      //设备详情界面跳转预留区
      //
      //
      //
      //
    },
  },

  components: {
    UnitPanel,
    SystemPanel,
    UnitPower,
    TableBlock,
    DoublePole,
    LineChart,
    TimeCompare,
    CostPie,
    HealthState,
    PageGather,
    WarnInfo,
    SearchItem,
  },
};
</script>
<style lang="" scoped></style>
