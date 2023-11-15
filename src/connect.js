import {
    objectArray,
    pipeArray,
    idToIndexMap1,
    idToIndexMap2,
    createWarningMessage,
    deleteWarningMessage,
    flowProcess,
} from './model.js'
import path from 'path-browserify'
import {mqtt_config, getConfig } from "./config.js";
import * as MQTT from './mqtt.js'

let host = mqtt_config.host;  // MQTT服务器地址
let port = mqtt_config.port;  // MQTT服务器端口
let clientId = mqtt_config.clientId;  // 客户端ID
let topic = mqtt_config.topic; //MQTT服务器订阅主题

// let url = http_config.url;

let client = new Paho.MQTT.Client(host, port, clientId);

// 设置连接选项
let connect_options = {
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onConnectFailure,
    useSSL: false
};

client.connect(connect_options);

//设置订阅选项
let subscribe_options={
    qos: 0, //订阅的服务质量等级
    onSuccess: onSubscribe,
    onFailure: onSubscribeFailure,
    timeout: 5000 //订阅操作的超时时间，以毫秒为单位
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
    client.connect(connect_options);
}

//接收消息
client.onMessageArrived = function (message){
    console.log('收到消息:', message.destinationName, message.payloadString);

    handleMQTTMessage(message);

};

let warningMessageArray = new Map();

setInterval(function() {
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
function onSubscribe(){
    console.log(`Success to subscribe topic: ${topic} `);
}

//订阅主题失败回调函数
function onSubscribeFailure(){
    console.log(`Failed to subscribe topic: ${topic} `)
}


export function getJson(labelName,property){
    let targetObject = objectArray[idToIndexMap1[labelName]]

    if(targetObject){
        if(property === 'Name'){
            return targetObject.Name;
        }
        else if(property === 'Info')
        {
            if(targetObject.info){
                return targetObject.info;
            }
            return "暂无设备信息";
        }
        else if(property === 'Url')
        {
            return targetObject.url;
        }
        else if(property === 'Manual'){
            return targetObject.Manual;
        }
        else if(property === 'Animation')
        {
            return targetObject.Animation;
        }

    }else {
        return "暂无设备信息"
    }
}
export function getPipeJson(labelName,property){
    let targetObject = pipeArray[idToIndexMap2[labelName]]

    if(targetObject){
        if(property === 'Name'){
            return targetObject.Name;
        }
        else if(property === 'Info')
        {
            if(targetObject.info){
                return targetObject.info;
            }
            return "暂无设备信息";
        }

    }else {
        return "暂无设备信息"
    }
}
export function getPDF(Manual){
 const config = getConfig();
    if(Manual==""){
        alert("暂无设备说明书");
    }else {
        const config = getConfig();
        let file_path = path.join(config.basePath, Manual);
        file_path = file_path.replace('http:/','http://');
        console.log(file_path);
        window.open(file_path, '_blank');
    }
}

export function getURL(Url){
    const config = getConfig();
    if(Url==""){
       alert("暂无设备资料");
    }else {
       const config = getConfig();
       let file_path = path.join(config.baseUrl,Url);
       file_path = file_path.replace('http:/','http://');
       console.log(file_path);
       window.open(file_path, '_blank');
       }
}


function handleMQTTMessage(message){
    let messageJSON = JSON.parse(message.payloadString);

    console.log(messageJSON)

    if(messageJSON.animation){
        handleAnimation(messageJSON.animation);
    }
    if(messageJSON.status){
        handleStatus(messageJSON.status);
    }
    if(messageJSON.healthLevel){
        handleHealthLevel(messageJSON.healthLevel);
    }
    if(messageJSON.parameters){
        handleParameters(messageJSON.parameters);
    }
    if(messageJSON.pressure){
        handlePressure(messageJSON.pressure);
    }
    if(messageJSON.density){
        handleDensity(messageJSON.density);
    }
    if(messageJSON.humidity){
        handleHumidity(messageJSON.humidity);
    }
    if(messageJSON.flow){
        handleFlow(messageJSON.flow);
    }
    if(messageJSON.energy){
        handleEnergy(messageJSON.energy);
    }
    if(messageJSON.water){
        handleWater(messageJSON.water);
    }
    if(messageJSON.cost){
        handleCost(messageJSON.cost);
    }
    if(messageJSON.economy){
        handleEconomy(messageJSON.economy);
    }
    if(messageJSON.failure){
        handleFailure(messageJSON.failure);
    }
    if(messageJSON.handling){
        handleHandling(messageJSON.handling);
    }
    if(messageJSON.alarm){
        handleAlarm(messageJSON.alarm);
    }
}

function handleAnimation(info) {
    for (let key in info) {
        if (info.hasOwnProperty(key)) {
            if(info[key]){
                flowProcess(key)
            }
        }
    }
}
function handleStatus(info) {

}
function handleHealthLevel(info) {

}
function handleParameters(info) {

}
function handlePressure(info) {

}
function handleDensity(info) {

}
function handleHumidity(info) {

}
function handleFlow(info) {

}
function handleEnergy(info) {

}
function handleWater(info) {

}
function handleCost(info) {

}
function handleEconomy(info) {

}
function handleFailure(info) {

}
function handleHandling(info) {

}

//处理报警信息
function handleAlarm(info){
    let modelID = info.id;

    if(!modelID){
        return
    }

    if(!warningMessageArray.has(modelID)){
        createWarningMessage(modelID);
    }
    //存入模型id与计时器,存在覆盖
    warningMessageArray.set(modelID, 0);
}
