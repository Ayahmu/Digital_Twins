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
    <div class="nav_btn" @click="sendMessage">
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

    <div>
      <dv-decoration-7
        style="
          width: 412px;
          height: 1.8136vw;
          position: absolute;
          top: 6%;
          left: 50%;
          transform: translate(23.21158vw, -2vw);
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
          top: 4vw;
          z-index: 3;
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

      <div
        style="
          position: absolute;
          right: 0;
          width: 25%;
          height: 37.5vw;
          z-index: 3;
          top: 4vw;
        "
      >
        <!-- 搜索部分 -->

        <SearchItem></SearchItem>

        <!-- 设备信息轮播表，跳转入口 -->
        <dv-border-box-12
          style="
            width: 100%;
            height: 15.0629vw;
            background-color: rgba(0, 0, 0, 0.22);
            border-radius: 1vw;
          "
        >
          <dv-scroll-board
            class="place"
            :config="status"
            style="width: 97%; height: 95%; top: 8px"
            @click="chooseModule"
          />
        </dv-border-box-12>
        <dv-border-box-12
          style="
            width: 100%;
            height: 6.19647vw;
            background-color: rgba(0, 0, 0, 0.22);
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
          position: absolute;
          height: 16.06297vw;
          top: 42.666vw;
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
              border-radius: 1vw;
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

import { ref } from "vue";
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
      currentDateTime: "",
      status: {
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        columnWidth: [133, 255, 91],
        align: ["center", "center", "center"],
        header: ["编号", "设备名称", "状态"],
        row: "",
        rowNum: 4,
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
    };
  },

  mounted() {
    window.resizeTo(1985, 1240);
    this.updateDateTime(); // 初始化时立即更新日期时间
    setInterval(this.updateDateTime, 1000); // 每秒更新日期时间
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
