//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data1 from "../public/json/HydrogenSysInfo.json";
import equipments from "../public/json/equipments.json";
import { getJson, getPDF, getURL } from "./connect.js";
import axios from "axios"

//从config.json中获取配置信息
let config = {};
axios.get('/json/config.json')
    .then(response =>{
        config = response.data;
        if(config.singleLight){
            light1.intensity = 1.5;
            light2.intensity = 1.5;
        }else{
            light1.intensity = 0;
            light2.intensity = 0;
        }
        // 设置相机的灵敏度
        camera.panningSensibility = config.camera.camera_panningSensibility; // 增加平移灵敏度
        camera.wheelPrecision = 1 / config.camera.camera_wheelPrecision;
    })
    .catch((err)=>{
        console.error("Failed to load config:",err);
    });


//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex = "3";


// //将canvas添加到body中
// document.body.appendChild(canvas);

export let objectArray;
let idToDoor = {};
idToDoor["Mesh.2971"] = 0;
idToDoor["Mesh.1898"] = 1;
idToDoor["Mesh.633"] = 2;
//读取json数据

function MyObject(
  ID,
  Name,
  Info,
  Manual,
  Url,
  State,
  SpareParts,
  LocID,
  Animation
) {
  this.ID = ID;
  this.Name = Name;
  this.Info = Info;
  this.Manual = Manual;
  this.Url = Url;
  this.State = State;
  this.SpareParts = SpareParts;
  this.LocID = LocID;
  this.Animation = Animation;
}

// 创建对象实例并存储在数组中
objectArray = data1.map(
  (jsonObject) =>
    new MyObject(
      jsonObject.ID,
      jsonObject.Name,
      jsonObject.Info,
      jsonObject.Manual,
      jsonObject.Url,
      jsonObject.State,
      jsonObject.SpareParts,
      jsonObject.LocID,
      jsonObject.Animation
    )
);


// 创建一个哈希表，将 ID 映射到数组索引
export const idToIndexMap1 = {};

// 填充哈希表
objectArray.forEach((obj, index) => {
  idToIndexMap1[obj.ID] = index;
});

// 要查找的特定 ID
const targetID = "10QM001"; // 例如，查找 ID 为 "10QM001" 的对象

// 使用哈希表查找特定 ID 对应的数组索引
let targetIndex = idToIndexMap1[targetID];

// console.log("10QM001", objectArray[targetIndex]);

//创建引擎，第二个参数为抗锯齿
const engine = new BABYLON.Engine(canvas, true, { stencil: true },false);
// const engine = new BABYLON.WebGPUEngine(canvas );   //使用webgpu
// await engine.initAsync();

//创建场景
const scene = new BABYLON.Scene(engine, false);
// const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("texture/hdr/peppermint_powerplant_2_4k.exr", scene);
let hdrTexture = new BABYLON.HDRCubeTexture(
  "texture/hdr/syferfontein_18d_clear_puresky_4k(深蓝，已修改).hdr",
  scene,
  1024
);
scene.environmentTexture = hdrTexture;
scene.createDefaultSkybox(hdrTexture, true);
scene.environmentIntensity = 0.4;
// scene.debugLayer.show()
let initTarget = new BABYLON.Vector3(
  -37.95875211948178,
  73.00066611807962,
  64.42490800253104
); // 相机目标点
let initPos = new BABYLON.Vector3(
  -37.99717668174966,
  86.58864238456036,
  333.38193590224483
);

// 创建相机
const camera = new BABYLON.ArcRotateCamera(
  "camera",
  0, // 相机水平旋转角度
  0, // 相机垂直旋转角度
  10, // 相机旋转半径
  new BABYLON.Vector3(-37.95875211948178, 73.00066611807962, 64.42490800253104), // 相机目标点
  scene // 相机所在场景
);

camera.wheelDeltaPercentage = 0.02;
camera.inertia = 0; //设置为0以禁用移动和旋转的惯性
camera.panningInertia = 0;

camera.position = new BABYLON.Vector3(
  -37.99717668174966,
  86.58864238456036,
  333.38193590224483
);

//将相机附加到画布上,
camera.attachControl(canvas);

//创建高亮层
let highLightLayer = new BABYLON.HighlightLayer("highLightLayer", scene, {
  camera: camera,
});

//添加鼠标监听事件
const actionManager = new BABYLON.ActionManager(scene);
//未注册json的模型事件
const nullManager = new BABYLON.ActionManager(scene);

let childMesh = [];

//模型数组
let models = [];

actionManager.registerAction(
  new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPointerOverTrigger, //鼠标悬停触发
    function (event) {
      switch (event.meshUnderPointer.id) {
        default:
          removeLabel(rmLabelBuild);
          if(event.meshUnderPointer.id === 'Mesh.633' || event.meshUnderPointer.id === 'Mesh.1898' || event.meshUnderPointer.id === 'Mesh.2971'){
              if(camera.position.z < 60){
                  highLight(event.meshUnderPointer, event.meshUnderPointer.id);
              }
          }else {
              highLight(event.meshUnderPointer, event.meshUnderPointer.id);
          }
          // console.log(event.meshUnderPointer.id);
          break;
      }
    }
  )
);
nullManager.registerAction(
  new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPickTrigger, //鼠标单机触发
    function (event) {
      switch (event.meshUnderPointer.id) {
        default:
          // console.log(event.meshUnderPointer.id)
          break;
      }
    }
  )
);

actionManager.registerAction(
  new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPointerOutTrigger, //鼠标移走触发
    function (event) {
      switch (event.meshUnderPointer.id) {
        default:
          removeLabel(rmLabelBuild);
          break;
      }
    }
  )
);

actionManager.registerAction(
  new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPickTrigger, //鼠标单击触发
    function (event) {
      switch (event.meshUnderPointer.id) {
        default:
          opendoor(event.meshUnderPointer, event.meshUnderPointer.id);
          // alphachange(event.meshUnderPointer, event.meshUnderPointer.id);
          displayLabel(event);
          let pickInfo = scene.pick(scene.pointerX, scene.pointerY);

          if (pickInfo.hit) {
            // 鼠标点击位置的世界坐标
            clickPos = pickInfo.pickedPoint;
            console.log("鼠标点击位置的世界坐标:", clickPos);
            console.log("点击模型世界坐标:", event.meshUnderPointer.position);
          }
          break;
      }
    }
  )
);

let intervalID;
function displayLabel(event) {
  let infoLabelElm = document.getElementById("info-label");

  document.addEventListener("click", function (event) {
    if (
      infoLabelElm.style.display === "block" &&
      !infoLabelElm.contains(event.target)
    ) {
      infoLabelElm.style.display = "none";
    }
  });

  setTimeout(() => {
    infoLabelElm.style.display = "block";
  }, 10);

  let nameElm = document.getElementById("modelName");
  let idElm = document.getElementById("modelID");
  let infoElm = document.getElementById("modelInfo");
  let stateElm = document.getElementById("modelState");
  let manualElm = document.getElementById("modelManual");
  let spareElm = document.getElementById("modelSpare");
  let urlElm = document.getElementById("modelUrl");

  let targetModel = objectArray[idToIndexMap1[event.meshUnderPointer.id]];

  nameElm.innerHTML =
    "设备名称:   " + (targetModel.Name ? targetModel.Name : "暂无");
  idElm.innerHTML =
    "设备编号:    " + (targetModel.ID ? targetModel.ID : "暂无");
  infoElm.innerHTML =
    "设备描述:  " + (targetModel.Info ? targetModel.Info : "暂无");
  stateElm.innerHTML =
    "设备状态:  " + (targetModel.State ? targetModel.State : "正常");

  spareElm.innerHTML =
    "备件信息:  " + (targetModel.SpareParts ? targetModel.SpareParts : "暂无");
  //资料远程存储
  let result1 = targetModel.Url === "" ? ": 暂无" : " >>";
  urlElm.innerHTML = "设备资料" + result1;

  //PDF本地存储
  let result2 = targetModel.Manual === "" ? ": 暂无" : " >>";
  manualElm.innerHTML = "设备说明书" + result2;

  urlElm.onclick = function () {
    getURL(targetModel.Url);
  };
  manualElm.onclick = function () {
    getPDF(targetModel.Manual);
  };

  if (!intervalID) {
    intervalID = setInterval(() => {
      setUiPosition(infoLabelElm, event.meshUnderPointer, 20, -10, true);
    }, 100);
  } else {
    clearInterval(intervalID);
    intervalID = undefined;
  }
}

let rmLabelBuild = [];

let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
advancedTexture.renderScale = 1;

let selectMesh, selectName;
let clickPos;
function highLight(mesh, labelName) {
  if (
    labelName !== "Brep" &&
    labelName !== "Brep.091" &&
    labelName !== "Brep.092"
  ) {
    selectMesh = mesh;
    selectName = labelName;
    highLightLayer.addMesh(mesh, BABYLON.Color3.Blue());
    models.push(mesh);
  }
}

let targetPosCamera, targetPosMesh;
targetPosCamera = new BABYLON.Vector3(-100, -100, -100);
targetPosMesh = new BABYLON.Vector3(-100, -105, -100);

export function resetCamera() {
    camera.rotation = new BABYLON.Vector3(0, 0, 0);

    camera.position = initPos;
    camera.setTarget(initTarget);
    camera.inertia = 0; //设置为0以禁用移动和旋转的惯性

    console.log("Camera reset");
}

function removeLabel(arr) {
  //清除面板
  for (let i = 0; i < arr.length; i++) {
    arr[i].dispose();
  }
  //清除高光
  models.forEach((mesh) => {
    highLightLayer.removeMesh(mesh);
  });
  models = [];
  rmLabelBuild = [];
}

function changematerial1(){//柜内材料
    //给门设置旋转属性
    let door1=scene.getMeshById("Mesh.633");
    let door2=scene.getMeshById("Mesh.1898");
    let door3=scene.getMeshById("Mesh.2971");
    // door1.material=myclapboardMaterial
    door1.ifopen=0;
    door2.ifopen=0;
    door3.ifopen=0;
    //柜体内设备透明
    let equipmentsmaterial1=new BABYLON.PBRMaterial("equipmentsmaterial", scene); //创建pbr 设备管道材料
    equipmentsmaterial1.albedoColor=new BABYLON.Color3.White(); // 反射颜色
    equipmentsmaterial1.metallic=1 // 金属
    equipmentsmaterial1.roughness=0.5 // 粗糙
    equipmentsmaterial1.alpha=0.8;
    let equipmentsmaterial2=new BABYLON.PBRMaterial("equipmentsmaterial2", scene); //创建pbr 设备管道材料
    equipmentsmaterial2.albedoColor=new BABYLON.Color3.White(); // 反射颜色
    equipmentsmaterial2.metallic=1 // 金属
    equipmentsmaterial2.roughness=0.5 // 粗糙
    equipmentsmaterial2.alpha=0.9;
    let equipmentsmaterialred=new BABYLON.PBRMaterial("equipmentsmaterialred", scene); //创建pbr 红色设备管道材料
    equipmentsmaterialred.albedoColor=new BABYLON.Color3.Red(); // 反射颜色
    equipmentsmaterialred.metallic=1 // 金属
    equipmentsmaterialred.roughness=0.5 // 粗糙
    equipmentsmaterialred.alpha=0.8;
    let equipmentsmaterialgreen=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialgreen.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    equipmentsmaterialgreen.metallic=1 // 金属
    equipmentsmaterialgreen.roughness=0.5 // 粗糙
    equipmentsmaterialgreen.alpha=0.8;
    let equipmentsmaterialblack=new BABYLON.PBRMaterial("equipmentsmaterialblack", scene); //创建pbr 黑色设备管道材料
    equipmentsmaterialblack.albedoColor=new BABYLON.Color3.Black(); // 反射颜色
    equipmentsmaterialblack.metallic=1 // 金属
    equipmentsmaterialblack.roughness=0.5 // 粗糙
    equipmentsmaterialblack.alpha=0.8;
    let equipmentsmaterialyellow=new BABYLON.PBRMaterial("equipmentsmaterialyellow", scene); //创建pbr 黄色设备管道材料
    equipmentsmaterialyellow.albedoColor=new BABYLON.Color3.Yellow(); // 反射颜色
    equipmentsmaterialyellow.metallic=1 // 金属
    equipmentsmaterialyellow.roughness=0.5 // 粗糙
    equipmentsmaterialyellow.alpha=0.8;
    let equipmentsmaterialblue1=new BABYLON.PBRMaterial("equipmentsmaterialblue1", scene); //创建pbr 蓝色设备管道材料浅色
    equipmentsmaterialblue1.albedoColor=new BABYLON.Color4(0.13, 0.63, 0.99); // 反射颜色
    equipmentsmaterialblue1.metallic=1 // 金属
    equipmentsmaterialblue1.roughness=0.5 // 粗糙
    equipmentsmaterialblue1.alpha=0.8;
    let equipmentsmaterialblue2=new BABYLON.PBRMaterial("equipmentsmaterialblue2", scene); //创建pbr 蓝色设备管道材料深色
    equipmentsmaterialblue2.albedoColor=new BABYLON.Color4(0.11, 0.19, 0.89); // 反射颜色
    equipmentsmaterialblue2.metallic=1 // 金属
    equipmentsmaterialblue2.roughness=0.5 // 粗糙
    equipmentsmaterialblue2.alpha=0.8;
    let equipmentsmaterialbrown=new BABYLON.PBRMaterial("equipmentsmaterialbrown", scene); //创建pbr 棕色设备管道材料
    equipmentsmaterialbrown.albedoColor=new BABYLON.Color4(1, 0.5, 0, 0.68); // 反射颜色
    equipmentsmaterialbrown.metallic=1 // 金属
    equipmentsmaterialbrown.roughness=0.5 // 粗糙
    equipmentsmaterialbrown.alpha=0.7;
    equipments.forEach(function(it){
        let meshid=it.ID;
        let mesh = scene.getMeshById(meshid);
        // mesh.unfreezeWorldMatrix();
        if(mesh!=null){
          if(it.Info === "报警."){
            // console.log("报警.",mesh);
            mesh.material= equipmentsmaterialred;
          }
          else if(it.Info === "柜门."){
            // console.log("柜门.",mesh);
            mesh.material=equipmentsmaterial2;
          }
          else if(it.Info === "电磁阀."){
            mesh.material= equipmentsmaterialred;
          }
          else if(it.Info === "气动球阀.中"||it.Info === "气动球阀.下"){
            mesh.material= equipmentsmaterialred;
          }
          else if(it.Info === "气动球阀.上"){
            mesh.material= equipmentsmaterialblack;
          }
          else if(it.Info === "大桶."){
            mesh.material= equipmentsmaterialblue2;
          }
          else if(it.Info === "桶."){
            mesh.material= equipmentsmaterialblue1;
          }
          else if(it.Info === "棕."){
            mesh.material= equipmentsmaterialbrown;
          }
          else{
            mesh.material=equipmentsmaterial1;
          }
        }
        // mesh.freezeWorldMatrix();

    })
}
function changematerial2(meshes){//管道和隔板
    // meshes.forEach(function(it){
    //   // it.freezeWorldMatrix();
    //   it.doNotSyncBoundingInfo = true;
    //   it.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
    // })
    // 管道透明
    //氢气管道
    let pipe1=scene.getMeshById("Brep.044");
    let pipe2=scene.getMeshById("Brep.008");
    let hydrogenmaterial = new BABYLON.PBRMaterial("hydrogenmaterial", scene); //创建pbr 氢气管道材料
    hydrogenmaterial.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    hydrogenmaterial.metallic=1 // 金属
    hydrogenmaterial.roughness=0.5 // 粗糙
    hydrogenmaterial.alpha=0.5;

    pipe1.material = hydrogenmaterial;
    pipe2.material = hydrogenmaterial;
    // pipe1.freezeWorldMatrix();
    // pipe1.material.freeze();
    // pipe2.material.freeze();
    //二氧化碳管道
    let pipe3=scene.getMeshById("Brep.049");
    let pipe4=scene.getMeshById("Brep.053");
    let pipe12=scene.getMeshById("Brep.045");
    let carbonmaterial= new BABYLON.PBRMaterial("carbonmaterial", scene); //创建pbr 二氧化碳管道材料
    carbonmaterial.albedoColor=new BABYLON.Color3.Purple(); // 反射颜色
    carbonmaterial.metallic=0.5 // 金属
    carbonmaterial.roughness=0.5 // 粗糙
    carbonmaterial.alpha=0.5;
    pipe3.material = carbonmaterial;
    pipe4.material = carbonmaterial;
    pipe12.material = carbonmaterial;
    //水管道
    let pipe5=scene.getMeshById("Brep.041");
    let pipe6=scene.getMeshById("Brep.042");
    let watermaterial= new BABYLON.PBRMaterial("watermaterial", scene); //创建pbr 水管道材料
    watermaterial.albedoColor=new BABYLON.Color3.Blue(); // 反射颜色
    watermaterial.metallic=0.5 // 金属
    watermaterial.roughness=0.5 // 粗糙
    watermaterial.alpha=0.5;
    pipe5.material = watermaterial;
    pipe6.material = watermaterial;
    //油管
    let pipe7=scene.getMeshById("Brep.051");
    let pipe8=scene.getMeshById("Brep.020");
    let pipe9=scene.getMeshById("Brep.021");
    let pipe10=scene.getMeshById("Brep.005");
    let pipe11=scene.getMeshById("Brep.052");
    let oilmaterial= new BABYLON.PBRMaterial("oilmaterial", scene); //创建pbr 油管道材料
    oilmaterial.albedoColor=new BABYLON.Color3.Yellow(); // 反射颜色
    oilmaterial.metallic=0.5; // 金属
    oilmaterial.roughness=0.5; // 粗糙
    oilmaterial.alpha=0.5;
    pipe7.material = oilmaterial;
    pipe8.material = oilmaterial;
    pipe9.material = oilmaterial;
    pipe10.material = oilmaterial;
    pipe11.material = oilmaterial;
    //获得隔板
    let clapboard1=scene.getMeshById("Brep");
    let clapboard2=scene.getMeshById("Brep.091");
    let clapboard3=scene.getMeshById("Brep.092");
    clapboard1.isVisible=false;
    clapboard2.isVisible=false;
    clapboard3.isVisible=false;
}
function changematerial3(){//发动机外壳
      //发动机外壳
      let machine=scene.getMeshById("Mesh.5924");
      // machine.unfreezeWorldMatrix();
      let mymachineMaterial=new BABYLON.PBRMaterial("mymachineMaterial", scene);
      mymachineMaterial.albedoColor=new BABYLON.Color3.White(); // 反射颜色
      mymachineMaterial.metallic=0.2 // 金属
      mymachineMaterial.roughness=0.8 // 粗糙
      mymachineMaterial.alpha=0.3;
      mymachineMaterial.freeze();
      machine.material = mymachineMaterial;
      // machine.freezeWorldMatrix();
}

function opendoor(mesh, labelName) {
  //开门/关门
  if (
    labelName === "Mesh.633" ||
    labelName === "Mesh.1898" ||
    labelName === "Mesh.2971"
  ) {
    console.log("mesh.ifopen", labelName, mesh.ifopen);
    if (mesh.ifopen === 0) {
      mesh.rotate(BABYLON.Axis.Y, (-Math.PI * 3) / 4, BABYLON.Space.LOCAL);
      mesh.ifopen = 1;
    } else {
      mesh.rotate(BABYLON.Axis.Y, (Math.PI * 3) / 4, BABYLON.Space.LOCAL);
      mesh.ifopen = 0;
    }
  }

  // selectMesh.setPivotPoint(new BABYLON.Vector3(-6, 0, 0));
}
export function stopProcess(ProcessName){
  let pipematerial=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
  pipematerial.albedoColor=new BABYLON.Color3.White(); // 反射颜色
  pipematerial.metallic=1 // 金属
  pipematerial.roughness=0.5 // 粗糙
  pipematerial.alpha=0.9;
  let equipmentsmaterialred=new BABYLON.PBRMaterial("equipmentsmaterialred", scene); //创建pbr 红色设备管道材料
  equipmentsmaterialred.albedoColor=new BABYLON.Color3.Red(); // 反射颜色
  equipmentsmaterialred.metallic=1 // 金属
  equipmentsmaterialred.roughness=0.5 // 粗糙
  equipmentsmaterialred.alpha=0.8;
  if(ProcessName === "fillCO2"){
    let Breps=["Brep.093","Brep.094","Brep.095","Brep.096","Brep.097","Brep.098","Brep.099","Brep.100","Brep.101","Brep.102","Brep.103","Brep.104","Brep.105","Brep.106"];
    Breps.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= pipematerial
    })
      //阀门回归原色
      let Equipments=["Mesh.3655","Mesh.3656","Mesh.3657","10QM018","Mesh.3791","10QN003"];
      Equipments.forEach(function(it){
        let mesh = scene.getMeshById(it);
        // mesh.unfreezeWorldMatrix();
        mesh.material= equipmentsmaterialred;
        objectArray[idToIndexMap1[it]].State="正常"
        // mesh.freezeWorldMatrix();
      })
  }
  if(ProcessName === "exhaustH2"){
    let Breps=["Brep.106",
        "Brep.105",
        "Brep.109",
        "Brep.110",
        "Brep.111",
        "Brep.112",
        "Brep.113",
        "Brep.114",
        "Brep.115",
        "Brep.116",
        "Brep.117",
        "Brep.118",
        "Brep.119",
        "Brep.120",
        "Brep.121"];
    Breps.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= pipematerial
    })
    //阀门回归原色
    let Equipments=["10QM401","10QM402","10QM403","10QM404","Mesh.3798","Mesh.3791","Mesh.3691","Mesh.4092","10QN003"];
    Equipments.forEach(function(it){
      let mesh = scene.getMeshById(it);
      // mesh.unfreezeWorldMatrix();
      mesh.material= equipmentsmaterialred;
      objectArray[idToIndexMap1[it]].State="正常"
      // mesh.freezeWorldMatrix();
    })
  }
  if(ProcessName === "fillH2fromPowerPlant"){
    let Breps=[ "Brep.122",
                "Brep.123",
                "Brep.149",
                "Brep.150",
                "Brep.125",
                "Brep.126",
                "Brep.127",
                "Brep.128",
                "Brep.129",
                "Brep.130",
                "Brep.131",
                "Brep.132",
                "Brep.133",
                "Brep.134",
                "Brep.135",
                "Brep.136",
                "Brep.137",
                "Brep.138",
                "Brep.139",
                "Brep.140",
                "Brep.141",
                "Brep.142",
                "Brep.143",
                "Brep.144",
                "Brep.145",
                "Brep.146",
                "Brep.147",
                "Brep.148",
                "Brep.111",
                "Brep.112",
                "Brep.113"
        ];
    Breps.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= pipematerial
    })
    //阀门回归原色
    let Equipments=["Mesh.3660","Mesh.3658","10QM015","10QN001-5","10QN001-4","10QN001-1","Mesh.3691","Mesh.3798","Mesh.4092"];
    Equipments.forEach(function(it){
      let mesh = scene.getMeshById(it);
      // mesh.unfreezeWorldMatrix();
      mesh.material= equipmentsmaterialred;
      objectArray[idToIndexMap1[it]].State="正常"
      // mesh.freezeWorldMatrix();
    })
  }
  if(ProcessName === "fillH2fromConfluence"){
    let Breps=[ "Brep.151",
                "Brep.152",
                "Brep.153",
                "Brep.154",
                "Brep.150",
                "Brep.125",
                "Brep.126",
                "Brep.127",
                "Brep.128",
                "Brep.129",
                "Brep.130",
                "Brep.131",
                "Brep.132",
                "Brep.133",
                "Brep.134",
                "Brep.135",
                "Brep.136",
                "Brep.137",
                "Brep.138",
                "Brep.139",
                "Brep.140",
                "Brep.141",
                "Brep.142",
                "Brep.143",
                "Brep.144",
                "Brep.145",
                "Brep.146",
                "Brep.147",
                "Brep.148",
                "Brep.111",
                "Brep.112",
                "Brep.113"
        ];
    Breps.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= pipematerial
    })
    //阀门回归原色
    let Equipments=["Mesh.3678","Mesh.3679","10QM001","10QN001-5","10QN001-4","10QN001-1","Mesh.3691","Mesh.3798","Mesh.4092"];
    Equipments.forEach(function(it){
      let mesh = scene.getMeshById(it);
      // mesh.unfreezeWorldMatrix();
      mesh.material= equipmentsmaterialred;
      objectArray[idToIndexMap1[it]].State="正常"
      // mesh.freezeWorldMatrix();
    })
  }
  if(ProcessName === "operationNormally"){
    // scene.onBeforeRenderObservable.clear();
        //阀门回归原色
        let Equipments=["Mesh.3798","Mesh.3791","Mesh.3691","Mesh.4092","10QN003"];
        Equipments.forEach(function(it){
          let mesh = scene.getMeshById(it);
          // mesh.unfreezeWorldMatrix();
          mesh.material= equipmentsmaterialred;
          objectArray[idToIndexMap1[it]].State="正常"
          // mesh.freezeWorldMatrix();
        })
  }
  if(ProcessName === "purificationH2"){
    let Breps=[ "Brep.155",
                "Brep.156",
                "Brep.157",
                "Brep.158",
                "Brep.159",
                "Brep.160",
                "Brep.161",
                "Brep.162",
                "Brep.163",
                "Brep.164",
                "Brep.165",
                "Brep.166",
                "Brep.167",
                "Brep.168",
                "Brep.169",
                "Brep.170",
                "Brep.171",
                "Brep.172",
                "Brep.173",
                "Brep.174",
                "Brep.175",
                "Brep.176",
                "Brep.177",
                "Brep.178",
                "Brep.179",
                "Brep.180",
                "Brep.181",
                "Brep.182",
                "Brep.183",
                "Brep.184",
                "Brep.185",
                "Brep.186",
                "Brep.187",
                "Brep.188",
                "Brep.189",
                "Brep.190",
                "Brep.191",
                "Brep.192",
                "Brep.193",
                "Brep.194",
                "Brep.195",
                "Brep.196",
                "Brep.197",
                "Brep.198",
                "Brep.199",
                "Brep.200",
                "Brep.217",
                "Brep.201",
                "Brep.202",
                "Brep.203",
                "Brep.204",
                "Brep.205",
                "Brep.206",
                "Brep.207",
                "Brep.208",
                "Brep.209",
                "Brep.210",
                "Brep.211",
                "Brep.212",
                "Brep.213",
                "Brep.214",
                "Brep.215",
                "Brep.216"
        ];
    Breps.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= pipematerial
    })
    //阀门回归原色
    let Equipments=["Mesh.2397","Mesh.2398","Mesh.2461","Mesh.1788","Mesh.2383","Mesh.2390","20QM005","20QM009","20QM003","10BM101","10BM102"];
    Equipments.forEach(function(it){
      let mesh = scene.getMeshById(it);
      // mesh.unfreezeWorldMatrix();
      mesh.material= equipmentsmaterialred;
      objectArray[idToIndexMap1[it]].State="正常"
      // mesh.freezeWorldMatrix();
    })
  }
  if(ProcessName === "makeH2"){
    let Breps=[ "Brep.218",
                "Brep.219",
                "Brep.220",
                "Brep.221",
                "Brep.222",
                "Brep.223",
                "Brep.224",
                "Brep.225",
                "Brep.226",
                "Brep.227",
                "Brep.228",
                "Brep.229",
                "Brep.230",
                "Brep.231",
                "Brep.232",
                "Brep.233",
                "Brep.234",
                "Brep.235",
                "Brep.236",
                "Brep.237",
                "Brep.238",
                "Brep.239",
                "Brep.240",
                "Brep.241",
                "Brep.242",
                "Brep.243",
                "Brep.244",
                "Brep.245",
                "Brep.246",
                "Brep.247",
                "Brep.248",
                "Brep.249",
                "Brep.250",
                "Brep.251",
                "Brep.252",
                "Brep.253",
                "Brep.254",
                "Brep.255",
                "Brep.256",
                "Brep.257",
                "Brep.258",
                "Brep.259",
                "Brep.260",
                "Brep.261",
                "Brep.262",
                "Brep.263",
                "Brep.264",
                "Brep.265",
                "Brep.266",
                "Brep.267",
                "Brep.268",
                "Brep.269",
                "Brep.270",
                "Brep.271",
                "Brep.272",
                "Brep.273",
                "Brep.274",
                "Brep.275",
                "Brep.276",
                "Brep.277",
                "Brep.278",
                "Brep.279",
                "Brep.280",
                "Brep.281",
                "Brep.282",
                "Brep.283",
                "Brep.284",
                "Brep.285",
                "Brep.286",
                "Brep.287",
                "Brep.288",
                "Brep.289",
                "Brep.290",
                "Brep.291",
                "Brep.292",
                "Brep.293",
                "Brep.294",
                "Brep.295",
                "Brep.296",
                "Brep.297",
                "Brep.298",
                "Brep.299",
                "Brep.300",
                "Brep.301",
                "Brep.302",
                "Brep.303",
                "Brep.304",
                "Brep.305",
                "Brep.306",
                "Brep.307",
                "Brep.308",
                "Brep.309",
                "Brep.310",
                "Brep.311",
                "Brep.312",
                "Brep.313",
                "Brep.314",
                "Brep.315",
                "Brep.316",
                "Brep.317",
                "Brep.318",
                "Brep.319",
                "Brep.320",
                "Brep.321",
                "Brep.322",
                "Brep.323",
                "Brep.324",
                "Brep.325",
                "Brep.326",
                "Brep.327",
                "Brep.328",
                "Brep.329",
                "Brep.330",
                "Brep.331",
                "Brep.332",
                "Brep.333",
                "Brep.334",
                "Brep.335",
                "Brep.336",
                "Brep.337",
                "Brep.338",
                "Brep.339",
                "Brep.340",
                "Brep.341",
                "Brep.342",
                "Brep.343",
                "Brep.344",
                "Brep.345",
                "Brep.346",
                "Brep.347",
                "Brep.348"
        ];
    Breps.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= pipematerial
    })
        //阀门回归原色
        let Equipments=["Mesh.1151","Mesh.1035","30QM013"];
        Equipments.forEach(function(it){
          let mesh = scene.getMeshById(it);
          // mesh.unfreezeWorldMatrix();
          mesh.material= equipmentsmaterialred;
          objectArray[idToIndexMap1[it]].State="正常"
          // mesh.freezeWorldMatrix();
        })
  }
}

export function flowProcess(ProcessName){
  if(ProcessName === "fillCO2"){
      uvflowing("Brep.093",1,2,0,"紫色")
      uvflowing("Brep.094",2,1,0,"紫色")
      uvflowing("Brep.095",1,1,0,"紫色")
      uvflowing("Brep.096",2,4,0,"紫色")
      uvflowing("Brep.097",2,1,0,"紫色")
      uvflowing("Brep.098",1,3,0,"紫色")
      uvflowing("Brep.099",2,1,0,"紫色")
      uvflowing("Brep.100",2,2,0,"紫色")
      uvflowing("Brep.101",3,2,1,"紫色")
      uvflowing("Brep.102",3,1,1,"紫色")
      uvflowing("Brep.103",1,2,0,"紫色")
      uvflowing("Brep.104",2,1,0,"紫色")
      uvflowing("Brep.105",3,1,1,"紫色")
      uvflowing("Brep.106",2,4,0,"紫色")
      //阀门变色部分
      //全开变绿色（半透明）,1-2变黄色
      let equipmentsmaterialgreen_alpha=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
      equipmentsmaterialgreen_alpha.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
      equipmentsmaterialgreen_alpha.metallic=1 // 金属
      equipmentsmaterialgreen_alpha.roughness=0.5 // 粗糙
      equipmentsmaterialgreen_alpha.alpha=0.8;
      let equipmentsmaterialyellow=new BABYLON.PBRMaterial("equipmentsmaterialyellow", scene); //创建pbr 绿色设备管道材料
      equipmentsmaterialyellow.albedoColor=new BABYLON.Color3.Yellow(); // 反射颜色
      equipmentsmaterialyellow.metallic=1 // 金属
      equipmentsmaterialyellow.roughness=0.5 // 粗糙
      equipmentsmaterialyellow.alpha=1;
      let OpenEquipments=["Mesh.3655","Mesh.3656","Mesh.3657","10QM018"];
      OpenEquipments.forEach(function(it){
        let mesh = scene.getMeshById(it);
        // mesh.unfreezeWorldMatrix();
        mesh.material= equipmentsmaterialgreen_alpha;
        objectArray[idToIndexMap1[it]].State="全开"
        // mesh.freezeWorldMatrix();
      })
      let Equipments_12=["Mesh.3791","10QN003"];
      Equipments_12.forEach(function(it){
        let mesh = scene.getMeshById(it);
        // mesh.unfreezeWorldMatrix();
        mesh.material= equipmentsmaterialyellow;
        objectArray[idToIndexMap1[it]].State="1-2"
        // mesh.freezeWorldMatrix();
      })

      // 管道变色(二氧化碳管道变氢气管道)
      let pipe3=scene.getMeshById("Brep.053");
      let carbonmaterial= new BABYLON.PBRMaterial("carbonmaterial", scene); //创建pbr 二氧化碳管道材料
      carbonmaterial.albedoColor=new BABYLON.Color3.Purple(); // 反射颜色
      carbonmaterial.metallic=0.5 // 金属
      carbonmaterial.roughness=0.5 // 粗糙
      carbonmaterial.alpha=0.3;
      pipe3.material = carbonmaterial;
  }
  if(ProcessName === "exhaustH2"){
    //柜内流动部分
    uvflowing("Brep.106",1,4,0,"绿色")
    uvflowing("Brep.105",4,1,1,"绿色")
    uvflowing("Brep.109",3,1,1,"绿色")
    uvflowing("Brep.110",3,1,1,"绿色")
    uvflowing("Brep.111",3,1,1,"绿色")
    uvflowing("Brep.112",2,1.5,0,"绿色")
    uvflowing("Brep.113",1,3,0,"绿色")
    uvflowing("Brep.114",1,1,0,"绿色")
    uvflowing("Brep.115",1,2,0,"绿色")
    uvflowing("Brep.116",2,1,0,"绿色")
    uvflowing("Brep.117",1,2,0,"绿色")
    uvflowing("Brep.118",3,1,1,"绿色")
    uvflowing("Brep.119",3,1,1,"绿色")
    uvflowing("Brep.120",2,2,0,"绿色")
    uvflowing("Brep.121",2,2,0,"绿色")
    //阀门变色部分
    //全开变绿色（半透明）,1-3也是绿色（不透明）
    let equipmentsmaterialgreen_alpha=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialgreen_alpha.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    equipmentsmaterialgreen_alpha.metallic=1 // 金属
    equipmentsmaterialgreen_alpha.roughness=0.5 // 粗糙
    equipmentsmaterialgreen_alpha.alpha=0.8;
    let equipmentsmaterialgreen=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialgreen.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    equipmentsmaterialgreen.metallic=1 // 金属
    equipmentsmaterialgreen.roughness=0.5 // 粗糙
    equipmentsmaterialgreen.alpha=1;
    let OpenEquipments=["10QM401","10QM402","10QM403","10QM404"];
    OpenEquipments.forEach(function(it){
      let mesh = scene.getMeshById(it);
      // mesh.unfreezeWorldMatrix();
      mesh.material= equipmentsmaterialgreen_alpha;
      objectArray[idToIndexMap1[it]].State="全开"
      // mesh.freezeWorldMatrix();
    })
    let Equipments_13=["Mesh.3798","Mesh.3791","Mesh.3691","Mesh.4092","10QN003"];
    Equipments_13.forEach(function(it){
      let mesh = scene.getMeshById(it);
      // mesh.unfreezeWorldMatrix();
      mesh.material= equipmentsmaterialgreen;
      objectArray[idToIndexMap1[it]].State="1-3"
      // mesh.freezeWorldMatrix();
    })
    let pipe1=scene.getMeshById("Brep.053");
    let hydrogenmaterial = new BABYLON.PBRMaterial("hydrogenmaterial", scene); //创建pbr 氢气管道材料
    hydrogenmaterial.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    hydrogenmaterial.metallic=1 // 金属
    hydrogenmaterial.roughness=0.5 // 粗糙
    hydrogenmaterial.alpha=0.3;
    pipe1.material = hydrogenmaterial;
}
  if(ProcessName === "fillH2fromPowerPlant"){
    uvflowing("Brep.122",1,2,0,"绿色")
    uvflowing("Brep.123",2,1,0,"绿色")
    uvflowing("Brep.149",4,0.5,1,"绿色")
    uvflowing("Brep.150",2,1,0,"绿色")
    uvflowing("Brep.125",1,1,0,"绿色")
    uvflowing("Brep.126",1,3,0,"绿色")
    uvflowing("Brep.127",2,1,0,"绿色")
    uvflowing("Brep.128",2,3,0,"绿色")
    uvflowing("Brep.129",2,1,0,"绿色")
    uvflowing("Brep.130",3,1,1,"绿色")
    uvflowing("Brep.131",1,1.5,0,"绿色")
    uvflowing("Brep.132",2,1,0,"绿色")
    uvflowing("Brep.133",1,1,0,"绿色")
    uvflowing("Brep.134",2,1,0,"绿色")
    uvflowing("Brep.135",2,1,0,"绿色")
    uvflowing("Brep.136",2,1,0,"绿色")
    uvflowing("Brep.137",4,1,1,"绿色")
    uvflowing("Brep.138",2,1,0,"绿色")
    uvflowing("Brep.139",1,1,0,"绿色")
    uvflowing("Brep.140",2,1,0,"绿色")
    uvflowing("Brep.141",1,1,0,"绿色")
    uvflowing("Brep.142",2,2,0,"绿色")
    uvflowing("Brep.143",1,2.5,0,"绿色")
    uvflowing("Brep.144",1,0.5,0,"绿色")
    uvflowing("Brep.145",4,0.5,1,"绿色")
    uvflowing("Brep.146",4,0.5,1,"绿色")
    uvflowing("Brep.147",3,0.5,1,"绿色")
    uvflowing("Brep.148",4,0.5,1,"绿色")
    uvflowing("Brep.111",3,1,1,"绿色")
    uvflowing("Brep.112",2,1.5,0,"绿色")
    uvflowing("Brep.113",2,3,0,"绿色")
    //阀门变色部分
    //全开变绿色（半透明）,1-2变黄色
    let equipmentsmaterialgreen_alpha=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialgreen_alpha.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    equipmentsmaterialgreen_alpha.metallic=1 // 金属
    equipmentsmaterialgreen_alpha.roughness=0.5 // 粗糙
    equipmentsmaterialgreen_alpha.alpha=0.8;
    let equipmentsmaterialyellow=new BABYLON.PBRMaterial("equipmentsmaterialyellow", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialyellow.albedoColor=new BABYLON.Color3.Yellow(); // 反射颜色
    equipmentsmaterialyellow.metallic=1 // 金属
    equipmentsmaterialyellow.roughness=0.5 // 粗糙
    equipmentsmaterialyellow.alpha=1;
    let OpenEquipments=["Mesh.3660","Mesh.3658","10QM015","10QN001-5","10QN001-4","10QN001-1"];
    OpenEquipments.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialgreen_alpha
      objectArray[idToIndexMap1[it]].State="全开"
    })
    let Equipments_12=["Mesh.3691","Mesh.3798","Mesh.4092"];
    Equipments_12.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialyellow
      objectArray[idToIndexMap1[it]].State="1-2"
    })
    //柜外管道流动重新启动
    // particleSystem7.start(); //Brep053
    // particleSystem8.start();
    // particleSystem9.start();
    // particleSystem10.start();
  }
  if(ProcessName === "fillH2fromConfluence"){
    uvflowing("Brep.151",1,1,0,"绿色")
    uvflowing("Brep.152",1,1.5,0,"绿色")
    uvflowing("Brep.153",1,1,0,"绿色")
    uvflowing("Brep.154",4,0.5,1,"绿色")
    uvflowing("Brep.150",2,1,0,"绿色")
    uvflowing("Brep.125",1,1,0,"绿色")
    uvflowing("Brep.126",1,3,0,"绿色")
    uvflowing("Brep.127",2,1,0,"绿色")
    uvflowing("Brep.128",2,3,0,"绿色")
    uvflowing("Brep.129",2,1,0,"绿色")
    uvflowing("Brep.130",3,1,1,"绿色")
    uvflowing("Brep.131",1,1.5,0,"绿色")
    uvflowing("Brep.132",2,1,0,"绿色")
    uvflowing("Brep.133",1,1,0,"绿色")
    uvflowing("Brep.134",2,1,0,"绿色")
    uvflowing("Brep.135",2,1,0,"绿色")
    uvflowing("Brep.136",2,1,0,"绿色")
    uvflowing("Brep.137",4,1,1,"绿色")
    uvflowing("Brep.138",2,1,0,"绿色")
    uvflowing("Brep.139",1,1,0,"绿色")
    uvflowing("Brep.140",2,1,0,"绿色")
    uvflowing("Brep.141",1,1,0,"绿色")
    uvflowing("Brep.142",2,2,0,"绿色")
    uvflowing("Brep.143",1,2.5,0,"绿色")
    uvflowing("Brep.144",1,0.5,0,"绿色")
    uvflowing("Brep.145",4,0.5,1,"绿色")
    uvflowing("Brep.146",4,0.5,1,"绿色")
    uvflowing("Brep.147",3,0.5,1,"绿色")
    uvflowing("Brep.148",4,0.5,1,"绿色")
    uvflowing("Brep.111",3,1,1,"绿色")
    uvflowing("Brep.112",2,1.5,0,"绿色")
    uvflowing("Brep.113",2,3,0,"绿色")
    //阀门变色部分
    //全开变绿色（半透明）,1-2变黄色
    let equipmentsmaterialgreen_alpha=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialgreen_alpha.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    equipmentsmaterialgreen_alpha.metallic=1 // 金属
    equipmentsmaterialgreen_alpha.roughness=0.5 // 粗糙
    equipmentsmaterialgreen_alpha.alpha=0.8;
    let equipmentsmaterialyellow=new BABYLON.PBRMaterial("equipmentsmaterialyellow", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialyellow.albedoColor=new BABYLON.Color3.Yellow(); // 反射颜色
    equipmentsmaterialyellow.metallic=1 // 金属
    equipmentsmaterialyellow.roughness=0.5 // 粗糙
    equipmentsmaterialyellow.alpha=1;
    let OpenEquipments=["Mesh.3678","Mesh.3679","10QM001","10QN001-5","10QN001-4","10QN001-1"];
    OpenEquipments.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialgreen_alpha
      objectArray[idToIndexMap1[it]].State="全开"
    })
    let Equipments_12=["Mesh.3691","Mesh.3798","Mesh.4092"];
    Equipments_12.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialyellow
      objectArray[idToIndexMap1[it]].State="1-2"
    })
    //柜外管道流动重新启动
    // particleSystem7.start(); //Brep053
    // particleSystem8.start();
    // particleSystem9.start();
    // particleSystem10.start();
  }
  if(ProcessName === "operationNormally"){
    //阀门变色部分
    let equipmentsmaterialgreen=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialgreen.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    equipmentsmaterialgreen.metallic=1 // 金属
    equipmentsmaterialgreen.roughness=0.5 // 粗糙
    equipmentsmaterialgreen.alpha=1;
    let Equipments_13=["Mesh.3798","Mesh.3791","Mesh.3691","Mesh.4092","10QN003"];
    Equipments_13.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialgreen
      objectArray[idToIndexMap1[it]].State="1-3"
    })
    //柜外管道流动暂停
    // particleSystem7.stop(); //Brep053
    // particleSystem8.stop();
    // particleSystem9.stop();
    // particleSystem10.stop();
  }
  if(ProcessName === "purificationH2"){
    uvflowing("Brep.155",1,1,0,"绿色")
    uvflowing("Brep.156",2,1,0,"绿色")
    uvflowing("Brep.157",1,2,0,"绿色")
    uvflowing("Brep.158",2,1,0,"绿色")
    uvflowing("Brep.159",1,1,0,"绿色")
    uvflowing("Brep.160",2,1,0,"绿色")
    uvflowing("Brep.161",1,2,0,"绿色")
    uvflowing("Brep.162",2,1,0,"绿色")
    uvflowing("Brep.163",1,4,0,"绿色")
    uvflowing("Brep.164",2,0.5,0,"绿色")
    uvflowing("Brep.165",3,1,1,"绿色")
    uvflowing("Brep.166",1,2,0,"绿色")
    uvflowing("Brep.167",1,2,0,"绿色")
    uvflowing("Brep.168",1,2,0,"绿色")
    uvflowing("Brep.169",2,1,0,"绿色")
    uvflowing("Brep.170",2,1,0,"绿色")
    uvflowing("Brep.171",2,1,0,"绿色")
    uvflowing("Brep.172",2,1,0,"绿色")
    uvflowing("Brep.173",2,1,0,"绿色")
    uvflowing("Brep.174",2,1,0,"绿色")
    uvflowing("Brep.175",1,1,0,"绿色")
    uvflowing("Brep.176",1,1,0,"绿色")
    uvflowing("Brep.177",1,1,0,"绿色")
    uvflowing("Brep.178",1,2,0,"绿色")
    uvflowing("Brep.179",2,2,0,"绿色")
    uvflowing("Brep.180",2,2,0,"绿色")
    uvflowing("Brep.181",2,2,0,"绿色")
    uvflowing("Brep.182",2,3,0,"绿色")
    uvflowing("Brep.183",1,3,0,"绿色")
    uvflowing("Brep.184",2,1,0,"绿色")
    uvflowing("Brep.185",2,3,0,"绿色")
    uvflowing("Brep.186",1,3,0,"绿色")
    uvflowing("Brep.187",1,3,0,"绿色")
    uvflowing("Brep.188",4,0.5,1,"绿色")
    uvflowing("Brep.189",4,0.5,1,"绿色")
    uvflowing("Brep.190",3,0.5,1,"绿色")
    uvflowing("Brep.191",1,0.5,0,"绿色")
    uvflowing("Brep.192",1,3,0,"绿色")
    uvflowing("Brep.193",2,1,0,"绿色")
    uvflowing("Brep.194",2,1,0,"绿色")
    uvflowing("Brep.195",1,1,0,"绿色")
    uvflowing("Brep.196",2,1,0,"绿色")
    uvflowing("Brep.197",2,1,0,"绿色")
    uvflowing("Brep.198",2,2,0,"绿色")
    uvflowing("Brep.199",2,3,0,"绿色")
    uvflowing("Brep.200",2,1,0,"绿色")
    uvflowing("Brep.217",4,1,1,"绿色")
    uvflowing("Brep.201",2,1,0,"绿色")
    uvflowing("Brep.202",2,1,0,"绿色")
    uvflowing("Brep.203",2,1,0,"绿色")
    uvflowing("Brep.204",2,3,0,"绿色")
    uvflowing("Brep.205",2,1,0,"绿色")
    uvflowing("Brep.206",2,1,0,"绿色")
    uvflowing("Brep.207",1,1,0,"绿色")
    uvflowing("Brep.208",2,1,0,"绿色")
    uvflowing("Brep.209",2,1.5,0,"绿色")
    uvflowing("Brep.210",1,2,0,"绿色")
    uvflowing("Brep.211",3,1,1,"绿色")
    uvflowing("Brep.212",2,0.5,0,"绿色")
    uvflowing("Brep.213",2,1.5,0,"绿色")
    uvflowing("Brep.214",2,2,0,"绿色")
    uvflowing("Brep.215",1,1,0,"绿色")
    uvflowing("Brep.216",2,3,0,"绿色")
    //阀门变色部分
    //全开变绿色（半透明）
    let equipmentsmaterialgreen_alpha=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialgreen_alpha.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    equipmentsmaterialgreen_alpha.metallic=1 // 金属
    equipmentsmaterialgreen_alpha.roughness=0.5 // 粗糙
    equipmentsmaterialgreen_alpha.alpha=0.8;
    let OpenEquipments=["Mesh.2397","Mesh.2398","Mesh.2461","Mesh.1788","Mesh.2383","Mesh.2390","20QM005","20QM009","20QM003","10BM101","10BM102"];
    OpenEquipments.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialgreen_alpha
      objectArray[idToIndexMap1[it]].State="全开"
    })
  }
  if(ProcessName === "makeH2"){
    uvflowing("Brep.218",2,5,0,"绿色");
    uvflowing("Brep.219",1,1,0,"绿色");
    uvflowing("Brep.220",2,1,0,"绿色");
    uvflowing("Brep.221",2,3,0,"绿色");
    uvflowing("Brep.222",1,1,0,"绿色");
    uvflowing("Brep.223",1,1,0,"绿色");
    uvflowing("Brep.224",1,3,0,"绿色");
    uvflowing("Brep.225",2,1,0,"绿色");
    uvflowing("Brep.226",1,3,0,"绿色");
    uvflowing("Brep.227",1,1,0,"绿色");
    uvflowing("Brep.228",1,1,0,"绿色");
    uvflowing("Brep.229",2,1,0,"绿色");
    uvflowing("Brep.230",1,1,0,"绿色");
    uvflowing("Brep.231",2,1,0,"绿色");
    uvflowing("Brep.232",2,1,0,"绿色");
    uvflowing("Brep.233",2,3,0,"绿色");
    uvflowing("Brep.234",2,1,0,"绿色");
    uvflowing("Brep.235",2,1,0,"绿色");
    uvflowing("Brep.236",1,4,0,"绿色");
    uvflowing("Brep.237",2,2,0,"绿色");
    uvflowing("Brep.238",1,2,0,"绿色");
    uvflowing("Brep.239",1,2,0,"绿色");
    uvflowing("Brep.240",1,3,0,"绿色");
    uvflowing("Brep.241",1,1,0,"绿色");
    uvflowing("Brep.242",2,1,0,"绿色");
    uvflowing("Brep.243",1,1,0,"绿色");
    uvflowing("Brep.244",1,1,0,"绿色");
    uvflowing("Brep.245",1,1,0,"绿色");
    uvflowing("Brep.246",1,1,0,"绿色");
    uvflowing("Brep.247",1,1,0,"绿色");
    uvflowing("Brep.248",1,1,0,"绿色");
    uvflowing("Brep.249",1,1,0,"绿色");
    uvflowing("Brep.250",2,1,0,"绿色");
    uvflowing("Brep.251",1,1,0,"绿色");
    uvflowing("Brep.252",1,2,0,"绿色");
    uvflowing("Brep.253",2,1,0,"绿色");
    uvflowing("Brep.254",1,1,0,"绿色");
    uvflowing("Brep.255",1,2,0,"绿色");
    uvflowing("Brep.256",2,1,0,"绿色");
    uvflowing("Brep.257",1,1,0,"绿色");
    uvflowing("Brep.258",1,2,0,"绿色");
    uvflowing("Brep.259",1,2,0,"绿色");
    uvflowing("Brep.260",1,2,0,"绿色");
    uvflowing("Brep.261",1,2,0,"绿色");
    uvflowing("Brep.262",1,1,0,"绿色");
    uvflowing("Brep.263",1,1,0,"绿色");
    uvflowing("Brep.264",1,1,0,"绿色");
    uvflowing("Brep.265",2,1,0,"绿色");
    uvflowing("Brep.266",2,1,0,"绿色");
    uvflowing("Brep.267",2,2,0,"绿色");
    uvflowing("Brep.268",2,1,0,"绿色");
    uvflowing("Brep.269",2,1,0,"绿色");
    uvflowing("Brep.270",2,1,0,"绿色");
    uvflowing("Brep.271",2,1,0,"绿色");
    uvflowing("Brep.272",2,2,0,"绿色");
    uvflowing("Brep.273",2,1,0,"绿色");
    uvflowing("Brep.274",2,1,0,"绿色");
    uvflowing("Brep.275",2,1,0,"绿色");
    uvflowing("Brep.276",2,1,0,"绿色");
    uvflowing("Brep.277",2,2,0,"绿色");
    uvflowing("Brep.278",2,1,0,"绿色");
    uvflowing("Brep.279",2,1,0,"绿色");
    uvflowing("Brep.280",1,1,0,"绿色");
    uvflowing("Brep.281",1,1,0,"绿色");
    uvflowing("Brep.282",2,1,0,"绿色");
    uvflowing("Brep.283",1,3,0,"绿色");
    uvflowing("Brep.284",1,1,0,"绿色");
    uvflowing("Brep.285",1,1,0,"绿色");
    uvflowing("Brep.286",1,1,0,"绿色");
    uvflowing("Brep.287",1,3,0,"绿色");
    uvflowing("Brep.288",1,1,0,"绿色");
    uvflowing("Brep.289",1,1,0,"绿色");
    uvflowing("Brep.290",2,1,0,"绿色");
    uvflowing("Brep.291",2,1,0,"绿色");
    uvflowing("Brep.292",2,1,0,"绿色");
    uvflowing("Brep.293",1,1,0,"绿色");
    uvflowing("Brep.294",1,1,0,"绿色");
    uvflowing("Brep.295",1,1,0,"绿色");
    uvflowing("Brep.296",1,2,0,"绿色");
    uvflowing("Brep.297",1,2,0,"绿色");
    uvflowing("Brep.298",1,2,0,"绿色");
    uvflowing("Brep.299",1,1,0,"绿色");
    uvflowing("Brep.300",1,2,0,"绿色");
    uvflowing("Brep.301",1,1,0,"绿色");
    uvflowing("Brep.302",1,3,0,"绿色");
    uvflowing("Brep.303",1,1,0,"绿色");
    uvflowing("Brep.304",1,1,0,"绿色");
    uvflowing("Brep.305",1,1,0,"绿色");
    uvflowing("Brep.306",2,1,0,"绿色");
    uvflowing("Brep.307",1,1,0,"绿色");
    uvflowing("Brep.308",2,2,0,"绿色");
    uvflowing("Brep.309",1,2,0,"绿色");
    uvflowing("Brep.310",4,1,1,"绿色");
    uvflowing("Brep.311",1,1,0,"绿色");
    uvflowing("Brep.312",1,1,0,"绿色");
    uvflowing("Brep.313",1,2,0,"绿色");
    uvflowing("Brep.314",1,2,0,"绿色");
    uvflowing("Brep.315",2,1,0,"绿色");
    uvflowing("Brep.316",3,1,1,"绿色");
    uvflowing("Brep.317",1,4,0,"绿色");
    uvflowing("Brep.318",1,6,0,"绿色");
    uvflowing("Brep.319",2,2,0,"绿色");
    uvflowing("Brep.320",2,1,0,"绿色");
    uvflowing("Brep.321",2,2,0,"绿色");
    uvflowing("Brep.322",2,2.5,0,"绿色");
    uvflowing("Brep.323",1,1,0,"绿色");
    uvflowing("Brep.324",3,1,1,"绿色");
    uvflowing("Brep.325",2,1,0,"绿色");
    uvflowing("Brep.326",1,1,0,"绿色");
    uvflowing("Brep.327",2,1,0,"绿色");
    uvflowing("Brep.328",2,1,0,"绿色");
    uvflowing("Brep.329",1,3,0,"绿色");
    uvflowing("Brep.330",1,2,0,"绿色");
    uvflowing("Brep.331",1,2,0,"绿色");
    uvflowing("Brep.332",2,2,0,"绿色");
    uvflowing("Brep.333",2,0.5,0,"绿色");
    uvflowing("Brep.334",1,1,0,"绿色");
    uvflowing("Brep.335",1,2,0,"绿色");
    uvflowing("Brep.336",2,1,0,"绿色");
    uvflowing("Brep.337",2,1,0,"绿色");
    uvflowing("Brep.338",1,1,0,"绿色");
    uvflowing("Brep.339",2,1,0,"绿色");
    uvflowing("Brep.340",1,2,0,"绿色");
    uvflowing("Brep.341",2,3,0,"绿色");
    uvflowing("Brep.342",1,2,0,"绿色");
    uvflowing("Brep.343",2,1,0,"绿色");
    uvflowing("Brep.344",1,3,0,"绿色");
    uvflowing("Brep.345",1,1,0,"绿色");
    uvflowing("Brep.346",1,1,0,"绿色");
    uvflowing("Brep.347",1,1,0,"绿色")
    uvflowing("Brep.348",2,2.5,0,"绿色")
    //阀门变色部分
    //全开变绿色（半透明）
    let equipmentsmaterialgreen_alpha=new BABYLON.PBRMaterial("equipmentsmaterialgreen", scene); //创建pbr 绿色设备管道材料
    equipmentsmaterialgreen_alpha.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    equipmentsmaterialgreen_alpha.metallic=1 // 金属
    equipmentsmaterialgreen_alpha.roughness=0.5 // 粗糙
    equipmentsmaterialgreen_alpha.alpha=0.8;
    let OpenEquipments=["Mesh.1151","Mesh.1035","30QM013"];
    OpenEquipments.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialgreen_alpha
      objectArray[idToIndexMap1[it]].State="全开"
    })
  }
  if(ProcessName === "outsideH2_1"){
    uvflowing("Brep.041",1,1,0,"绿色")
    uvflowing("Brep.042",3,1,1,"绿色")
    uvflowing("Brep.072",1,2,0,"绿色")
    uvflowing("Brep.044",1,4,0,"绿色")
    uvflowing("Brep.073",1,1,0,"绿色")
    uvflowing("Brep.074",1,1,0,"绿色")
}
if(ProcessName === "outsideH2_2"){
    uvflowing("Brep.058",2,1,0,"绿色")
    uvflowing("Brep.057",2,2,0,"绿色")
    uvflowing("Brep.019",2,3,0,"绿色")
    uvflowing("Brep.054",2,2,0,"绿色")
    uvflowing("Brep.020",2,1,0,"绿色")
}
if(ProcessName === "outsideH2_3"){
    uvflowing("Brep.045",1,1,0,"绿色")
    uvflowing("Brep.039",3,1,1,"绿色")
    uvflowing("Brep.021",1,1,0,"绿色")
    uvflowing("Brep.038",4,1,1,"绿色")
    uvflowing("Brep.049",1,1,0,"绿色")
    uvflowing("Brep.023",3,1,1,"绿色")
    uvflowing("Brep.052",1,1.2,0,"绿色")
    uvflowing("Brep.051",1,1,0,"绿色")
}
if(ProcessName === "outsideCO2_1"){
    uvflowing("Brep.009",2,1,0,"紫色")
    uvflowing("Brep.018",2,2.5,0,"紫色")
    uvflowing("Brep.064",2,1,0,"紫色")
    uvflowing("Brep.063",4,1,1,"紫色")
    uvflowing("Brep.062",2,5,0,"紫色")
    uvflowing("Brep.061",2,3,0,"紫色")
    uvflowing("Brep.060",2,1,0,"紫色")
    uvflowing("Brep.059",2,1,0,"紫色")
}
if(ProcessName === "outsideCO2_2"){
    uvflowing("Brep.070",1,1,0,"紫色")
    uvflowing("Brep.001",2,1,0,"紫色")
    uvflowing("Brep.071",2,1,0,"紫色")
    uvflowing("Brep.008",1,3,0,"紫色")
    uvflowing("Brep.005",2,1,0,"紫色")
}
if(ProcessName === "outsidewater_1"){
  uvflowing("Brep.089",1,5,0,"蓝色")
  uvflowing("Brep.086",2,4,0,"蓝色")
  uvflowing("Brep.088",2,3,0,"蓝色")
  uvflowing("Brep.087",2,1,0,"蓝色")
}
if(ProcessName === "outsidewater_2"){
  uvflowing("Brep.124",1,1,0,"蓝色")
  uvflowing("Brep.108",1,3,0,"蓝色")
  uvflowing("Brep.107",2,1.7,0,"蓝色")
  uvflowing("Brep.090",2,2,0,"蓝色")
  uvflowing("Brep.349",2,4,0,"蓝色")
}
if(ProcessName === "outsideoil_1"){
  uvflowing("Brep.366",1,1,0,"黄色")
  uvflowing("Brep.368",1,2,0,"黄色")
  uvflowing("Brep.365",1,1,0,"黄色")
  uvflowing("Brep.367",1,2,0,"黄色")
  uvflowing("Brep.350",2,6,0,"黄色")
  uvflowing("Brep.360",2,2.3,0,"黄色")
  uvflowing("Brep.361",2,6,0,"黄色")
  uvflowing("Brep.362",4,1,1,"黄色")
  uvflowing("Brep.363",2,2,0,"黄色")
  uvflowing("Brep.364",2,1,0,"黄色")
}
if(ProcessName === "outsideoil_2"){
  uvflowing("Brep.354",2,1,0,"黄色")
  uvflowing("Brep.355",2,2,0,"黄色")
  uvflowing("Brep.356",2,2,0,"黄色")
  uvflowing("Brep.357",2,5,0,"黄色")
  uvflowing("Brep.358",2,1,0,"黄色")
  uvflowing("Brep.359",2,1,0,"黄色")
  uvflowing("Brep.351",2,1,0,"黄色")
  uvflowing("Brep.352",2,1,0,"黄色")
  uvflowing("Brep.353",2,1,0,"黄色")
}
if(ProcessName === "outsideoil_3"){
  uvflowing("Brep.079",2,1,0,"黄色")
  uvflowing("Brep.080",2,3,0,"黄色")
  uvflowing("Brep.084",2,1,0,"黄色")
  uvflowing("Brep.082",2,1.3,0,"黄色")
  uvflowing("Brep.083",2,1.8,0,"黄色")
  uvflowing("Brep.085",2,1.3,0,"黄色")
  uvflowing("Brep.081",2,1,0,"黄色")
}
if(ProcessName === "outsideoil_4"){
  uvflowing("Brep.076",1,1.5,0,"黄色")
  uvflowing("Brep.075",1,1,0,"黄色")
  uvflowing("Brep.077",2,1.5,0,"黄色")
  uvflowing("Brep.078",2,3,0,"黄色")
}
}
function uvflowing(meshid,direction,block,transfer=0,color){
  let tube = scene.getMeshById(meshid);
  var materialSphere3 = new BABYLON.StandardMaterial("texture3", scene);
  if(transfer){
      materialSphere3.diffuseTexture = new BABYLON.Texture(`texture/${color}横.png`, scene);
      materialSphere3.diffuseTexture.uScale = block;//在u(x)轴方向上同样长度内由5块原材质拼接
      materialSphere3.diffuseTexture.vScale = 1//在v(yv)轴方向上同样长度内由2块原材质拼接
  }
  else{
      materialSphere3.diffuseTexture = new BABYLON.Texture(`texture/${color}竖.png`, scene);
      materialSphere3.diffuseTexture.uScale = 1;//在u(x)轴方向上同样长度内由5块原材质拼接
      materialSphere3.diffuseTexture.vScale = block//在v(yv)轴方向上同样长度内由2块原材质拼接
  }
  materialSphere3.diffuseTexture.uOffset = 1;//水平翻转百分比
  materialSphere3.diffuseTexture.vOffset = 1;//垂直翻转百分比
  tube.material=materialSphere3;
  // setInterval(render(),3000)

    scene.onBeforeRenderObservable.add(() => {

      if(direction === 2){
          materialSphere3.diffuseTexture.vOffset += -0.05;
      }
      else if(direction === 1){
          materialSphere3.diffuseTexture.vOffset += 0.05;
      }
      else if(direction === 3){
          materialSphere3.diffuseTexture.uOffset += -0.05;
      }
      else if(direction === 4){
          materialSphere3.diffuseTexture.uOffset += 0.05;
    }
  })


}
// let pipematerial;
BABYLON.SceneLoader.ImportMesh(
    "",
    "model/",
    "modelv20d.glb",
    scene,
    function (Meshes) {
        // console.log("Meshes:",Meshes)
        // pipematerial=scene.getMeshById("Brep.093")
        changematerial3();
        changematerial1(Meshes);
        changematerial2(Meshes);
        flowProcess("outsideH2_1")
        flowProcess("outsideH2_2")
        flowProcess("outsideH2_3")
        flowProcess("outsideCO2_1")
        flowProcess("outsideCO2_2")
        flowProcess("outsidewater_1")
        flowProcess("outsidewater_2")
        flowProcess("outsideoil_1")
        flowProcess("outsideoil_2")
        flowProcess("outsideoil_3")
        flowProcess("outsideoil_4")
        // particlestart();
        // flowProcess("fillCO2");
        // flowProcess("exhaustH2");
        // flowProcess("fillH2fromPowerPlant");
        // flowProcess("fillH2fromConfluence");
        // flowProcess("operationNormally");
        // flowProcess("purificationH2");
        // flowProcess("makeH2");
        let importedMesh = Meshes[0];
        // console.log(Meshes);
        importedMesh.getChildren().forEach(function (mesh){
            //仅为json文件中存在的设备绑定事件
            if(getJson(mesh.id) !== '暂无设备信息'){
                childMesh.push(mesh);
                mesh.actionManager = actionManager;
                modelsPosition.set(mesh.id,new BABYLON.Vector3(-mesh.position.x,mesh.position.y,mesh.position.z));
            }else {
                mesh.actionManeger = nullManager;
            }
        });
        document.getElementById("model").appendChild(canvas);

    });


//鼠标按下时取消绑定事件,防止卡顿
scene.onPointerObservable.add((pointerInfo) => {
  switch (pointerInfo.type) {
    case BABYLON.PointerEventTypes.POINTERDOWN:
    case BABYLON.PointerEventTypes.POINTERWHEEL:
      childMesh.forEach(function (mesh) {
        if (!mesh.actionManager) return;
        mesh.actionManager = null;
      });
      break;
    case BABYLON.PointerEventTypes.POINTERUP:
      childMesh.forEach(function (mesh) {
        if (mesh.actionManager) return;
        mesh.actionManager = actionManager;
      });
      break;
    case BABYLON.PointerEventTypes.POINTERPICK:
      childMesh.forEach(function (mesh) {
        if (mesh.actionManager) return;
        mesh.actionManager = actionManager;
      });
      break;
  }
});

//报警设备Map,便于图标跟随
let warningModels = new Map();

export function createWarningMessage(modelID) {
  let warningModel = scene.getMeshById(modelID);
  if(!warningModel){
    window.alert("警报模型id未找到！")
  }
  //生成报警图标
  let bellElement = document.getElementById("bell");
  let clonedIcon = bellElement.cloneNode(true);
  //标签id为模型id
  clonedIcon.id = modelID;
  bellElement.parentNode.appendChild(clonedIcon);

  //设置报警的必要样式
  clonedIcon.style.display = "block";
  clonedIcon.style.position = "absolute";
  clonedIcon.style.zIndex = 2;

  //报警图标对应模型
  warningModels.set(clonedIcon, warningModel);

  //取消默认点击事件
  let inputElement = clonedIcon.querySelector("input");
  inputElement.addEventListener("click", function (event) {
    event.preventDefault();
  });
  inputElement.addEventListener("click", function () {
    // createWarningLabel(modelID,warningModel);
    // window.open(url, "_blank");
  });
  setWarningPosition(warningModels);
}

export function deleteWarningMessage(modelID) {
  let warningElement = document.getElementById(modelID);
  warningModels.delete(warningElement);
  warningElement.remove();
  removeLabel(rmLabelBuild);
}

let renderWidth = engine.getRenderingCanvas().width;
let renderHeight = engine.getRenderingCanvas().height;
let viewport = scene.activeCamera.viewport;
viewport.toGlobal(renderWidth, renderHeight);
let worldMatrix = scene.getTransformMatrix();

//定时器id数组，用于结束不必的定时器
function setWarningPosition(warningModels) {
  warningModels.forEach(function (value, key) {
    if (!value) {
      return;
    }
    setInterval(() => {
      setUiPosition(key, value, 0, 0, false);
    }, 100);
  });
}

let modelsPosition = new Map();

export function searchModel(modelID) {
  removeLabel(rmLabelBuild);
  // for(let mesh of childMesh){
  //     if(mesh.id === modelID){
  //         resetCamera();
  //         highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
  //         models.push(mesh);
  //         // camera.position.x = mesh.position.x;
  //         // camera.position.y = 30;
  //         // camera.position.z = -45;
  //         camera.setPosition(new BABYLON.Vector3(mesh.position.x,30,-45));
  //         camera.setTarget();
  //         // camera.radius = 50;
  //         console.log(modelID);
  //         return;
  //     }
  // }
  let modelPosition = modelsPosition.get(modelID);
  console.log(modelsPosition);
  if (modelPosition) {
    let mesh = scene.getMeshById(modelID);
    highLight(mesh, modelID);
      if(modelID === 'Mesh.633' || modelID === 'Mesh.1898' || modelID === 'Mesh.2971'){
        camera.setPosition(new BABYLON.Vector3(modelPosition.x, 30, -45));
      }else {
        camera.setPosition(new BABYLON.Vector3(modelPosition.x, 30, 170));
      }

    const targetPosition = (modelPosition.scale(10)).subtract(camera.position).scale(0.11111)
    camera.setTarget(targetPosition.add(new BABYLON.Vector3(0, 1, 0)));
    console.log(modelPosition);
    console.log(camera.position);
  } else {
    alert("未查找到指定设备");
  }
}

function setUiPosition(element, model, topOffset, leftOffset, isLabel) {
  let modelPosition = model.getAbsolutePosition();
  const transformMatrix = BABYLON.Matrix.Identity();
  transformMatrix.multiply(worldMatrix);
  let screenPosition = BABYLON.Vector3.Project(
    modelPosition,
    transformMatrix,
    scene.getTransformMatrix(),
    viewport
  );

  if (isLabel) {
    let top, left;
    if (screenPosition.y * 100 - topOffset < 0) {
      top = 0;
    } else if (screenPosition.y * 100 - topOffset > 40) {
      top = 40;
    } else {
      top = screenPosition.y * 100 - topOffset;
    }
    if (screenPosition.x * 100 - leftOffset < 25) {
      left = 25;
    } else if (screenPosition.x * 100 - leftOffset > 55) {
      left = 55;
    } else {
      left = screenPosition.x * 100 - leftOffset;
    }
    element.style.top = top + "%";
    element.style.left = left + "%";
  } else {
    element.style.top = screenPosition.y * 100 - topOffset + "%";
    element.style.left = screenPosition.x * 100 - leftOffset + "%";
  }
}

let light1 = new BABYLON.HemisphericLight(
  "light",
  new BABYLON.Vector3(1, 1, 1),
  scene
);

let light2 = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(-1, -1, -1),
    scene
);


scene.registerBeforeRender(function () {
  setWarningPosition(warningModels);

  //计算帧率
  let fps = engine.getFps().toFixed();

  // let fpsDisplay = document.getElementById("fpsDisplay");
  // fpsDisplay.innerHTML = "FPS:" + fps;

});

//渲染场景
engine.runRenderLoop(() => {
  scene.render();
  // console.log(camera.position);
});

//监听窗口大小改变
window.addEventListener("resize", () => {
    engine.resize();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
scene.clearCachedVertexData();
scene.freezeActiveMeshes();
scene.autoClear = false; // Color buffer
scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
scene.blockMaterialDirtyMechanism = true;//关键
scene.getAnimationRatio();
