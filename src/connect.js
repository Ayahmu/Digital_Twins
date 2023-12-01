import {
  objectArray,
  pipeArray,
  idToIndexMap1,
  idToIndexMap2,
  createWarningMessage,
  deleteWarningMessage,
  flowProcess,
  stopProcess,
} from "./model.js";
import path from "path-browserify";
import * as MQTT from './mqtt.js'
import axios from "axios";

let config = {}
let initialConfig = false;
let client
axios.get('/json/config.json')
    .then((response)=>{
      config = response.data;
      initialConfig = true


      let host = config.mqtt.host;  // MQTT服务器地址
      let port = config.mqtt.port;  // MQTT服务器端口
      let clientId = config.mqtt.clientId;  // 客户端ID
      let topic = config.mqtt.topic; //MQTT服务器订阅主题

      // let url = http_config.url;

      client = new Paho.MQTT.Client(host, port, clientId);
      // 设置连接选项
      let connect_options = {
        onSuccess: onConnect,
        onFailure: onConnectFailure,
        useSSL: false
      };

      client.connect(connect_options);

      //设置订阅选项
      let subscribe_options={
        qos: 2, //订阅的服务质量等级
        onSuccess: onSubscribe,
        onFailure: onSubscribeFailure,
        timeout: 50000 //订阅操作的超时时间，以毫秒为单位
      }

      //连接成功回调函数
      function onConnect() {
        console.log(`Connected to ${host}`);
        // 连接成功后的操作
        client.subscribe(topic, subscribe_options);
      }

      // 连接失败回调函数
      function onConnectFailure(errorMessage) {
        console.error(`Failed to connect to ${host}: ` + errorMessage.errorMessage);
      }

      client.onConnectionLost = function (message){
        console.log('连接丢失',message);
        console.log('正在尝试重新连接...');
        setTimeout(()=>{
          client.connect(connect_options);
        },1000);
      }

      //接收消息
      client.onMessageArrived = function (message){
        console.log('收到消息:', message.destinationName, message.payloadString);
        handleMQTTMessage(message);
      };

      //订阅主题成功回调函数
      function onSubscribe(){
        console.log(`Success to subscribe topic: ${topic} `);
      }

      //订阅主题失败回调函数
      function onSubscribeFailure(){
        console.log(`Failed to subscribe topic: ${topic} `)
      }

    })
    .catch((err)=>{
      console.error("Failed to load config:",err);
    })

let warningMessageArray = new Map();

setInterval(function () {
  for (let [key, value] of warningMessageArray) {
    console.log(value);
    if (value >= 5) {
      deleteWarningMessage(key);
      warningMessageArray.delete(key);
      break;
    }
    value++;
    warningMessageArray.set(key, value);
  }
}, 1000);

//订阅主题成功回调函数

export function getJson(labelName, property) {
  let targetObject = objectArray[idToIndexMap1[labelName]];

  if (targetObject) {
    if (property === "Name") {
      return targetObject.Name;
    } else if (property === "Info") {
      if (targetObject.info) {
        return targetObject.info;
      }
      return "暂无设备信息";
    } else if (property === "Url") {
      return targetObject.url;
    } else if (property === "Manual") {
      return targetObject.Manual;
    } else if (property === "Animation") {
      return targetObject.Animation;
    }
  } else {
    return "暂无设备信息";
  }
}
export function getPipeJson(labelName, property) {
  let targetObject = pipeArray[idToIndexMap2[labelName]];

  if (targetObject) {
    if (property === "Name") {
      return targetObject.Name;
    } else if (property === "Info") {
      if (targetObject.info) {
        return targetObject.info;
      }
      return "暂无设备信息";
    }
  } else {
    return "暂无设备信息";
  }
}
export function getPDF(Manual) {
  if (Manual === "") {
    alert("暂无设备说明书");
  } else {
    let file_path = path.join(config.basePath, Manual);
    file_path = file_path.replace("http:/", "http://");
    console.log(file_path);
    window.open(file_path, "_blank");
  }
}

export function getURL(Url) {
  if (Url === "") {
    alert("暂无设备资料");
  } else {
    let file_path = path.join(config.baseUrl, Url);
    file_path = file_path.replace("http:/", "http://");
    console.log(file_path);
    window.open(file_path, "_blank");
  }
}

//初始默认值,在未进行任何更新时显示,更新后将不会再使用(被覆盖)
let status = [1, 1, "960.18MV"];
let healthLevel = [99, 1, 1, 1, 1, 1, 1];
let parameters = [500.14, 98.01, -14.25, 20.15, 4.25, 50.36];
let pressure = [500.14, 500.57, 501.56, 500.53, 501.06, 499.54, 498.18];
let density = [98.01, 99.12, 98.65, 98.07, 99.25, 99.37, 98.24];
let humidity = [-14.25, -14.32, -13.98, -14.78, -13.05, -13.98, -14.45];
let flow = [20.15, 19.76, 21.08, 20.98, 18.85, 19.25, 20.19];
let energy = [4.25, 4.28, 4.78, 4.43, 4.01, 4.09, 4.01];
let water = [50.36, 51.36, 50.18, 51.08, 51.13, 49.74, 49.35];
let cost = [85.16, 14.84];
let supplement = [22.06, 23.18, 22.35, 22.98, 23.01, 22.19, 22.23];
let purification = [49.36, 55.19, 55.23, 54.42, 55.41, 48.27, 49.36];
let economy = [];
let occureddata = [1, 2, 3, 0, 1, 0, 0];
let handlingdata = [1, 2, 1, 1, 1, 0, 0];
let failure = [];
let handlingrate = [99.18, 98.99, 97.01, 99.15, 98.24, 99.01, 99.28];
let alarm = [
  {
    id: "B0002",
    name: "气体控制阀1",
    diagnosis: "压力过低",
    optimization: "重启设备",
    datetime: "2023-08-11 12:30:20",
  },
  {
    id: "B0003",
    name: "电磁阀",
    diagnosis: "压力过高",
    optimization: "关闭设备",
    datetime: "2023-08-11 14:30:20",
  },
];

function handleMQTTMessage(message) {
  let messageJSON = JSON.parse(message.payloadString);

  console.log(messageJSON);

  if (messageJSON.animation) {
    handleAnimation(messageJSON.animation);
  }
  if (messageJSON.status) {
    handleStatus(messageJSON.status);
  }
  if (messageJSON.healthLevel) {
    handleHealthLevel(messageJSON.healthLevel);
  }
  if (messageJSON.parameters) {
    handleParameters(messageJSON.parameters);
  }
  if (messageJSON.pressure) {
    handlePressure(messageJSON.pressure);
  }
  if (messageJSON.density) {
    handleDensity(messageJSON.density);
  }
  if (messageJSON.humidity) {
    handleHumidity(messageJSON.humidity);
  }
  if (messageJSON.flow) {
    handleFlow(messageJSON.flow);
  }
  if (messageJSON.energy) {
    handleEnergy(messageJSON.energy);
  }
  if (messageJSON.water) {
    handleWater(messageJSON.water);
  }
  if (messageJSON.cost) {
    handleCost(messageJSON.cost);
  }
  if (messageJSON.economy) {
    handleEconomy(messageJSON.economy);
  }
  if (messageJSON.failure) {
    handleFailure(messageJSON.failure);
  }
  if (messageJSON.handling) {
    handleHandling(messageJSON.handling);
  }
  if (messageJSON.alarm) {
    handleAlarm(messageJSON.alarm);
    myHandleAlarm(messageJSON.alarm);
  }
}

function handleAnimation(info) {
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      if (!info[key]) {
        stopProcess(key);
        console.log("stopProcess", key);
      }
    }
  }
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      if (info[key]) {
        flowProcess(key);
        console.log("flowProcess", key);
      }
    }
  }
}

//页面更新部分开始

function handleStatus(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      status[i] = info[key];
    }
    i++;
  }
}



function handleHealthLevel(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      healthLevel[i] = info[key];
    }
    i++;
  }
}



function handleParameters(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      parameters[i] = info[key];
    }
    i++;
  }
}



function handlePressure(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      pressure[i] = info[key];
    }
    i++;
  }
}



function handleDensity(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      density[i] = info[key];
    }
    i++;
  }
}



function handleHumidity(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      humidity[i] = info[key];
    }
    i++;
  }
}



function handleFlow(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      flow[i] = info[key];
    }
    i++;
  }
}



function handleEnergy(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      energy[i] = info[key];
    }
    i++;
  }
}



function handleWater(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      water[i] = info[key];
    }
    i++;
  }
}



function handleCost(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      cost[i] = info[key];
    }
    i++;
  }
}



function handleEconomy(info) {
  let i = 0;
  let j = 0;
  let u = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      economy[i] = info[key];
    }
    i++;
  }
  for (let key in economy[0]) {
    supplement[j] = economy[0][key];
    j++;
  }
  for (let key in economy[1]) {
    purification[u] = economy[1][key];
    u++;
  }
}


function handleFailure(info) {
  let i = 0;
  let j = 0;
  let u = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      failure[i] = info[key];
    }
    i++;
  }
  for (let key in failure[0]) {
    handlingdata[j] = failure[0][key];
    j++;
  }
  for (let key in failure[1]) {
    occureddata[u] = failure[1][key];
    u++;
  }
}



function handleHandling(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      handlingrate[i] = info[key];
    }
    i++;
  }
}



function myHandleAlarm(info) {
  let i = 0;
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      alarm[i] = info[key];
    }
    i++;
  }
}


let connectdata = [
  status,
  healthLevel,
  parameters,
  pressure,
  density,
  humidity,
  flow,
  '1','2',
  cost,
  supplement,
  purification,
  occureddata,
  handlingdata,
  handlingrate,
  alarm,
];
export default connectdata;
//页面更新部分结束

//处理报警信息
function handleAlarm(info) {
  let modelID = info.id;

  if (!modelID) {
    return;
  }

  if (!warningMessageArray.has(modelID)) {
    createWarningMessage(modelID);
  }
  //存入模型id与计时器,存在覆盖
  warningMessageArray.set(modelID, 0);
}
