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
        position: fixed;
        transform: translate(25vw, 11vw);
        left: 30vw;
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
    <div>
      <dv-decoration-7
        style="
          width: 412px;
          height: 1.8136vw;
          position: absolute;
          top: 8%;
          left: 48%;
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
      <!-- 左两个 -->
      <div
        style="
          position: absolute;
          width: 25%;
          height: 37.5vw;
          top: 14vw;
          z-index: 3;
          transform: scale(0.8);
          transform-origin: top left;
        "
      >
        <!-- 第一部分 -->

        <dv-border-box-12
          style="
            width: 100%;
            height: 11.07556vw;
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
            <div
              class="one"
              :style="{
                color: unitcolor,
              }"
            >
              {{ first }}
            </div>
            <div
              class="one"
              :style="{
                color: systemcolor,
              }"
            >
              {{ second }}
            </div>
            <div class="one" style="transform: translate(-2vw, 0vw)">
              {{ three }}
            </div>
          </div>
          <div class="total">
            <div class="unitname">机组状态</div>
            <div class="unitname">系统状态</div>
            <div class="unitname">机组负荷</div>
          </div>

          <div class="title"></div>

          <UnitPanel></UnitPanel>
          <SystemPanel></SystemPanel>
          <UnitPower></UnitPower>
        </dv-border-box-12>
        <dv-border-box-12
          style="
            width: 100%;
            height: 8.19647vw;
            background-color: rgba(0, 0, 0, 0.22);
            margin-bottom: 1vw;
            border-radius: 1vw;
          "
          ><WarnInfo></WarnInfo
        ></dv-border-box-12>
        <!-- 第二部分 -->
        <dv-border-box-12
          style="
            width: 100%;
            height: 7.9869vw;
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
          top: 12vw;
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
            height: 19.9629vw;
            background-color: rgba(0, 0, 0, 0.22);
            border-radius: 1vw;
            margin-bottom: 2.5vw;
          "
          ><div
            style="
              width: 97%;
              height: 93%;
              top: 0.6vw;
              left: 0.6vw;
              z-index: 77;
              overflow: auto;
              position: absolute;
            "
          >
            <dv-scroll-board
              class="place"
              :config="status"
              ref="scrollBoard"
              :style="elementStyle"
              @click="chooseModule"
            />
          </div>
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
            <HealthState></HealthState>
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
            <LineChart></LineChart>
          </dv-border-box-12>
        </div>
      </div>
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
// import DoublePole from "../components/DoublePole.vue";
import LineChart from "../components/LineChart.vue";
import CostPie from "../components/CostPie.vue";

import HealthState from "../components/HealthState.vue";
import PageGather from "@/components/PageGather.vue";
import WarnInfo from "@/components/WarnInfo.vue";
import SearchItem from "@/components/SearchItem.vue";
import { searchModel } from "../model.js";
import { ref } from "vue";
import connectdata from "../connect.js";
import axios from "axios";
import { Mesh } from "babylonjs";

let status = connectdata[0];
let first = ref();
let second = ref();
let three = ref();
let unitcolor;
let systemcolor;
if (status[0] == 0) {
  first.value = "停止";
  unitcolor = "#ff7b82";
} else if (status[0] == 1) {
  first.value = "运行";
  unitcolor = "#78f4ad";
} else if (status[0] == 2) {
  first.value = "盘车";
  unitcolor = "#ffe161";
}
if (status[1] == 0) {
  second.value = "停止";
  systemcolor = "#ff7b82";
} else if (status[1] == 1) {
  second.value = "运行";
  systemcolor = "#78f4ad";
} else if (status[1] == 2) {
  second.value = "置换";
  systemcolor = "#ffe161";
}
three.value = status[2];
export default {
  name: "HomeView",
  data() {
    return {
      elementStyle: {
        width: "100%",
        height: " 100%",
        zIndex: "77",
      },
      unitcolor,
      systemcolor,
      first,
      second,
      three,
      showPopup: false,
      currentDateTime: "",
      status: {
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        columnWidth: [203, 265],
        align: ["center", "center"],
        header: [
          "<span style='color: #fff;font-size:1.3vw;'>编号</span>",
          "<span style='color: #fff;font-size:1.3vw;'>设备名称</span>",
        ],
        row: "",
        rowNum: 4,
        waitTime: 5000,
        data: [
          [
            "<span style='color: #00ffff;font-size:1.3vw;'>10BF503</span>",
            "<span style='color: #00ffff;font-size:1.3vw;'>常压流量计</span>",
          ],
        ],
      },
      searchList: [],
      //树状用
      tenList: [],
      twentyList: [],
      thrityList: [],
      MeshList: [],

      //搜索用
      nameList: [],
      idList: [],

      //展示用
      displayList: [],
      formatList: [],
      resetList: [
        [
          "<span style='color: #00ffff;font-size:1.3vw;'>MKG10GH001</span>",
          "<span style='color: #00ffff;font-size:1.3vw;'>气体控制单元</span>",
        ],
        [
          "<span style='color: #00ffff;font-size:1.3vw;'>MKG20GH001</span>",
          "<span style='color: #00ffff;font-size:1.3vw;'>氢气提纯单元</span>",
        ],
        [
          "<span style='color: #00ffff;font-size:1.3vw;'>MKG30GH001</span>",
          "<span style='color: #00ffff;font-size:1.3vw;'>氢气补充单元</span>",
        ],
        [
          "<span style='color: #00ffff;font-size:1.3vw;'>MKGMesh</span>",
          "<span style='color: #00ffff;font-size:1.3vw;'>其它功能单元</span>",
        ],
      ],
    };
  },

  mounted() {
    this.updateDateTime(); // 初始化时立即更新日期时间
    setInterval(this.updateDateTime, 1000); // 每秒更新日期时间
    this.doSeparate();
    this.getJson();
  },
  created() {
    this.$bus.$on("fn", this.FormEvent);
    this.$bus.$on("reset", this.doReset);
  },
  beforeDestroy() {
    this.$bus.$off("fn", this.FormEvent);
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
    doAxios() {
      const config = {
        headers: {
          "Cache-Control": "no-cache", //不缓存
        },
      };
      return axios
        .get("/json/HydrogenSysInfo.json", config)
        .then((response) => {
          this.searchList = response.data;
        })
        .catch((err) => {
          console.error("Failed to load HydrogenSysInfo.json:", err);
        });
    },
    //对json文件中的设备分区
    doSeparate() {
      this.doAxios()
        .then(() => {
          // 在这里可以访问 this.searchList 的数据
          this.tenList = this.searchList.filter(
            (item) => item.ID.substring(0, 2) === "10"
          );
          this.twentyList = this.searchList.filter(
            (item) => item.ID.substring(0, 2) === "20"
          );
          this.thrityList = this.searchList.filter(
            (item) => item.ID.substring(0, 2) === "30"
          );
          this.MeshList = this.searchList.filter(
            (item) => item.ID.substring(0, 4) === ("Mesh" || "Z-BV")
          );
        })
        .catch((err) => {
          // 处理错误情况
          console.log("err");
        });
    },

    //使用json文件中的设备信息配置轮播表和搜索数据库
    getJson() {
      this.status = {
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        columnWidth: [203, 265],
        align: ["center", "center"],
        header: [
          "<span style='color: #fff;font-size:1.3vw;'>编号</span>",
          "<span style='color: #fff;font-size:1.3vw;'>设备名称</span>",
        ],
        row: "",
        rowNum: 4,
        waitTime: 5000,
        data: this.resetList,
      };
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
        `<span style='color: #00ffff;font-size:1.3vw;'>${item.ID}</span>`,
        `<span style='color: #00ffff;font-size:1.3vw;'>${item.Name}</span>`,
      ]);

      this.status = {
        headerBGC: "#3472bb",
        oddRowBGC: "transparent",
        evenRowBGC: "rgba(122, 202, 236,0.3)",
        columnWidth: [203, 265],
        align: ["center", "center"],
        header: [
          "<span style='color: #fff;font-size:1.3vw;'>编号</span>",
          "<span style='color: #fff;font-size:1.3vw;'>设备名称</span>",
        ],
        row: "",
        rowNum: 4,
        waitTime: 5000,
        data: this.formatList,
      };
    },
    doReset(reset) {
      if (reset == 1) {
        this.elementStyle.height = "100%";
        this.status = {
          headerBGC: "#3472bb",
          oddRowBGC: "transparent",
          evenRowBGC: "rgba(122, 202, 236,0.3)",
          columnWidth: [203, 265],
          align: ["center", "center"],
          header: [
            "<span style='color: #fff;font-size:1.3vw;'>编号</span>",
            "<span style='color: #fff;font-size:1.3vw;'>设备名称</span>",
          ],
          row: "",
          rowNum: 4,
          waitTime: 5000,
          data: this.resetList,
        };
      }
    },
    chooseModule(module) {
      if (
        module.row[0] ===
          "<span style='color: #00ffff;font-size:1.3vw;'>MKG10GH001</span>" ||
        module.row[0] ===
          "<span style='color: #00ffff;font-size:1.3vw;'>MKG20GH001</span>" ||
        module.row[0] ===
          "<span style='color: #00ffff;font-size:1.3vw;'>MKG30GH001</span>" ||
        module.row[0] ===
          "<span style='color: #00ffff;font-size:1.3vw;'>MKGMesh</span>"
      ) {
        switch (module.rowIndex) {
          case 0: {
            this.formatList = this.tenList.map((item) => [
              `<span style='color: #00ffff;font-size:1.3vw;'>${item.ID}</span>`,
              `<span style='color: #00ffff;font-size:1.3vw;'>${item.Name}</span>`,
            ]);
            break;
          }
          case 1: {
            this.formatList = this.twentyList.map((item) => [
              `<span style='color: #00ffff;font-size:1.3vw;'>${item.ID}</span>`,
              `<span style='color: #00ffff;font-size:1.3vw;'>${item.Name}</span>`,
            ]);
            break;
          }
          case 2: {
            this.formatList = this.thrityList.map((item) => [
              `<span style='color: #00ffff;font-size:1.3vw;'>${item.ID}</span>`,
              `<span style='color: #00ffff;font-size:1.3vw;'>${item.Name}</span>`,
            ]);
            break;
          }
          case 3: {
            this.formatList = this.MeshList.map((item) => [
              `<span style='color: #00ffff;font-size:1.3vw;'>${item.ID}</span>`,
              `<span style='color: #00ffff;font-size:1.3vw;'>${item.Name}</span>`,
            ]);
            break;
          }
        }
        this.elementStyle.height = `${this.formatList.length * 20}%`;
        this.status = {
          headerBGC: "#3472bb",
          oddRowBGC: "transparent",
          evenRowBGC: "rgba(122, 202, 236,0.3)",
          columnWidth: [203, 265],
          align: ["center", "center"],
          header: [
            "<span style='color: #fff;font-size:1.3vw;'>编号</span>",
            "<span style='color: #fff;font-size:1.3vw;'>设备名称</span>",
          ],
          row: "",
          rowNum: this.formatList.length,
          waitTime: 5000,
          data: this.formatList,
        };
      } else {
        let pattern = />([^<]+)</; // 匹配 > 和 < 之间的字母和数字
        let match = module.row[0].match(pattern);
        // console.log(match);
        if (match) {
          let extractedString = match[1]; // 提取匹配的部分
          // console.log(extractedString);
          searchModel(extractedString);
        } else {
          alert("暂无详细设备信息");
        }
      }
    },
  },

  components: {
    UnitPanel,
    SystemPanel,
    UnitPower,
    TableBlock,
    // DoublePole,
    LineChart,
    CostPie,
    HealthState,
    PageGather,
    WarnInfo,
    SearchItem,
  },
};
</script>
<style lang="" scoped></style>
