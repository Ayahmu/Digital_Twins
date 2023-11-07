//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data1 from "../public/json/HydrogenSysInfo.json";
import data2 from "../public/json/pipe.json";
import equipments from "../public/json/equipments.json";
import { camera_config } from "./config.js";
import { getJson, getPDF, getURL } from "./connect.js";
import axios from "axios"



//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex = "3";


// //将canvas添加到body中
// document.body.appendChild(canvas);


export let objectArray;
export let pipeArray;
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
pipeArray = data2.map(
  (jsonObject) =>
    new MyObject(
      jsonObject.ID,
      jsonObject.Name,
      jsonObject.Info,
      jsonObject.Manual,
      jsonObject.Url,
      jsonObject.LocID,
      jsonObject.Animation
    )
);

// 创建一个哈希表，将 ID 映射到数组索引
export const idToIndexMap1 = {};
export const idToIndexMap2 = {};

// 填充哈希表
objectArray.forEach((obj, index) => {
  idToIndexMap1[obj.ID] = index;
});
pipeArray.forEach((obj, index) => {
  idToIndexMap2[obj.ID] = index;
});

// 要查找的特定 ID
const targetID = "10QM001"; // 例如，查找 ID 为 "10QM001" 的对象

// 使用哈希表查找特定 ID 对应的数组索引
let targetIndex = idToIndexMap1[targetID];

console.log("10QM001", objectArray[targetIndex]);

//创建引擎，第二个参数为抗锯齿
const engine = new BABYLON.Engine(canvas, true, { stencil: true });
// const engine = new BABYLON.WebGPUEngine(canvas );   //使用webgpu
// await engine.initAsync();     


axios.get('/json/config.json')
    .then((response)=>{
        if(response.data.singleLight){
            light1.intensity = 0.6;
            light2.intensity = 0.6;
        }else{
            light1.intensity = 0;
            light2.intensity = 0;
        }

    })
    .catch((err)=>{
        console.error("Failed to load config:",err);
    })
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
// 设置相机的灵敏度
camera.panningSensibility = camera_config.camera_panningSensibility; // 增加平移灵敏度
camera.wheelPrecision = 1 / camera_config.camera_wheelPrecision;
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
          highLight(event.meshUnderPointer, event.meshUnderPointer.id);
          console.log(event.meshUnderPointer.id);
          // createLabel(event);
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
          alphachange(event.meshUnderPointer, event.meshUnderPointer.id);
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
let clapboardbegin;
function changematerial(meshes){

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
    //获得隔板材质
    let clapboard1=scene.getMeshById("Brep");
    let clapboard2=scene.getMeshById("Brep.091");
    let clapboard3=scene.getMeshById("Brep.092");
    clapboardbegin=clapboard2.material;
    let myclapboardMaterial=new BABYLON.PBRMaterial("myclapboardMaterial", scene);
    myclapboardMaterial.albedoColor=new BABYLON.Color3.White(); // 反射颜色
    myclapboardMaterial.diffuseColor=new BABYLON.Color3.White(); // 反射颜色
    myclapboardMaterial.metallic=0.2 // 金属
    myclapboardMaterial.roughness=0.8 // 粗糙
    myclapboardMaterial.alpha=1;
    clapboard1.material = myclapboardMaterial;
    clapboard1.alpha = 1;
    clapboard2.material = myclapboardMaterial;
    clapboard2.alpha = 1;
    clapboard3.material = myclapboardMaterial;
    clapboard3.alpha = 1;
    //发动机外壳
    let machine=scene.getMeshById("Mesh.5924");
    let mymachineMaterial=new BABYLON.PBRMaterial("mymachineMaterial", scene);
    mymachineMaterial.albedoColor=new BABYLON.Color3.White(); // 反射颜色
    mymachineMaterial.metallic=0.2 // 金属
    mymachineMaterial.roughness=0.8 // 粗糙
    mymachineMaterial.alpha=0.3;
    machine.material = mymachineMaterial;
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
    equipmentsmaterial1.alpha=0.6;
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
    equipmentsmaterialgreen.alpha=0.5;
    let equipmentsmaterialblack=new BABYLON.PBRMaterial("equipmentsmaterialblack", scene); //创建pbr 黑色设备管道材料
    equipmentsmaterialblack.albedoColor=new BABYLON.Color3.Black(); // 反射颜色
    equipmentsmaterialblack.metallic=1 // 金属
    equipmentsmaterialblack.roughness=0.5 // 粗糙
    equipmentsmaterialblack.alpha=0.5;
    let equipmentsmaterialyellow=new BABYLON.PBRMaterial("equipmentsmaterialyellow", scene); //创建pbr 黄色设备管道材料
    equipmentsmaterialyellow.albedoColor=new BABYLON.Color3.Yellow(); // 反射颜色
    equipmentsmaterialyellow.metallic=1 // 金属
    equipmentsmaterialyellow.roughness=0.5 // 粗糙
    equipmentsmaterialyellow.alpha=0.5;
    let equipmentsmaterialblue1=new BABYLON.PBRMaterial("equipmentsmaterialblue1", scene); //创建pbr 蓝色设备管道材料浅色
    equipmentsmaterialblue1.albedoColor=new BABYLON.Color4(0.13, 0.63, 0.99); // 反射颜色
    equipmentsmaterialblue1.metallic=1 // 金属
    equipmentsmaterialblue1.roughness=0.5 // 粗糙
    equipmentsmaterialblue1.alpha=0.5;
    let equipmentsmaterialblue2=new BABYLON.PBRMaterial("equipmentsmaterialblue2", scene); //创建pbr 蓝色设备管道材料深色
    equipmentsmaterialblue2.albedoColor=new BABYLON.Color4(0.11, 0.19, 0.89); // 反射颜色
    equipmentsmaterialblue2.metallic=1 // 金属
    equipmentsmaterialblue2.roughness=0.5 // 粗糙
    equipmentsmaterialblue2.alpha=0.5;
    let equipmentsmaterialbrown=new BABYLON.PBRMaterial("equipmentsmaterialbrown", scene); //创建pbr 蓝色设备管道材料深色
    equipmentsmaterialbrown.albedoColor=new BABYLON.Color4(1, 0.5, 0, 0.68); // 反射颜色
    equipmentsmaterialbrown.metallic=1 // 金属
    equipmentsmaterialbrown.roughness=0.5 // 粗糙
    equipmentsmaterialbrown.alpha=0.5;
    equipments.forEach(function(it){
        let meshid=it.ID;
        let mesh = scene.getMeshById(meshid);
        if(mesh!=null){
          if(it.Info=="报警."){
            console.log("报警.",mesh);
            mesh.material= equipmentsmaterialred;
          }
          else if(it.Info=="柜门."){
            console.log("柜门.",mesh);
            mesh.material=equipmentsmaterial2;
          }
          else if(it.Info=="电磁阀."){
            mesh.material= equipmentsmaterialred;
          }
          else if(it.Info=="气动球阀.中"||it.Info=="气动球阀.下"){
            mesh.material= equipmentsmaterialred;
          }
          else if(it.Info=="气动球阀.上"){
            mesh.material= equipmentsmaterialblack;
          }
          else if(it.Info=="大桶."){
            mesh.material= equipmentsmaterialblue2;
          }
          else if(it.Info=="桶."){
            mesh.material= equipmentsmaterialblue1;
          }
          else if(it.Info=="棕."){
            mesh.material= equipmentsmaterialbrown;
          }
          else{
            mesh.material=equipmentsmaterial1;
          }
        }

    })
}
//flowing流动方案-粒子效果
let countnum = 1;
function makeparticle(
  mesh,
  particleSystem,
  color1,
  color2,
  colorDead,
  minLifeTime = 0.75,
  maxLifeTime = 1
) {
  countnum++;
  //Texture of each particle
  particleSystem.particleTexture = new BABYLON.Texture(
    "/texture/flare.png",
    scene
  );
  // Where the particles come from
  particleSystem.emitter = mesh; //设置emitter发射器
  // Colors of all particles
  particleSystem.color1 = color1;
  particleSystem.color2 = color2;
  particleSystem.colorDead = colorDead;
  // Size of each particle (random between...
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.3;
  // Life time of each particle (random between...
  particleSystem.minLifeTime = minLifeTime;
  particleSystem.maxLifeTime = maxLifeTime;
  particleSystem.minEmitBox = new BABYLON.Vector3(0.08, 0.08, 0.08); //控制盒子
  particleSystem.maxEmitBox = new BABYLON.Vector3(-0.08, -0.08, -0.08);
  // Emission rate
  particleSystem.emitRate = 10000;
  // Speed
  particleSystem.minEmitPower = 0.1;
  particleSystem.maxEmitPower = 0.3;
  particleSystem.updateSpeed = 0.005;
  //gravity
  particleSystem.gravity=new BABYLON.Vector3(0,-0.2,0);
}
const slide = function (dist, movdirection) {
  //after covering dist apply turn
  this.dist = dist;
  this.movdirection = movdirection; //正在沿movaxis移动
};
function moveparticle(track, mesh, x, y, z, time) {
  setTimeout(function () {
    let distance = 0;
    let step = 2;
    let p = 0;
    scene.onBeforeRenderObservable.add(() => {
      if (track[p].movdirection === "left") {
        mesh.movePOV(-step, 0, 0);
      }
      if (track[p].movdirection === "right") {
        mesh.movePOV(step, 0, 0);
      }
      if (track[p].movdirection === "up") {
        mesh.movePOV(0, step, 0);
      }
      if (track[p].movdirection === "down") {
        mesh.movePOV(0, -step, 0);
      }
      if (track[p].movdirection === "front") {
        mesh.movePOV(0, 0, step);
      }
      if (track[p].movdirection === "behind") {
        mesh.movePOV(0, 0, -step);
      }

      distance += step;
      if (distance > track[p].dist) {
        // sphere.rotate(track044[p].rotaxis, track044[p].turn, BABYLON.Space.LOCAL);
        // particleSystem.gravity = track044[p].gravity;
        p += 1;
        p %= track.length;
        if (p === 0) {
          distance = 0;
          mesh.position = new BABYLON.Vector3(x, y, z); //reset to initial conditions
          // sphere.rotation = BABYLON.Vector3.Zero();//prevents error accumulation
        }
      }
    });
  }, time);
}
//发射器们：
let sphere = BABYLON.MeshBuilder.CreateSphere(
  "sphere",
  { diameter: 0.01, segments: 8 },
  scene
);
// sphere.material = new BABYLON.StandardMaterial("mat", scene);
// sphere.material.wireframe = true;
sphere.position = new BABYLON.Vector3(51, 25, 91);
let sphere004cl1 = sphere.clone("sphere004cl1");
sphere004cl1.position = new BABYLON.Vector3(51, 25, 91);
let sphere008 = sphere.clone("sphere008");
sphere008.position = new BABYLON.Vector3(3.5, 27.8, 71.8);
let sphere008cl1 = sphere008.clone("sphere008cl1");
let sphere049 = sphere.clone("sphere008");
sphere049.position = new BABYLON.Vector3(-8, 9.57, 79.6);
let sphere049cl1 = sphere049.clone("sphere049cl1");
let sphere053 = sphere.clone("sphere053");
sphere053.position = new BABYLON.Vector3(25.3, 27.6, 61.4);
let sphere053cl1 = sphere053.clone("sphere053cl1");
let sphere053cl2 = sphere053.clone("sphere053cl2");
let sphere053cl3 = sphere053.clone("sphere053cl3");
let sphere053_2 = sphere.clone("sphere053");
sphere053_2.position = new BABYLON.Vector3(-94.3, 130.4, -0.1);
let sphere053_2cl1 = sphere053_2.clone("sphere053cl1");
let sphere053_2cl2 = sphere053_2.clone("sphere053cl2");
let sphere053_2cl3 = sphere053_2.clone("sphere053cl3");
let sphere041 = sphere.clone("sphere041");
sphere041.position = new BABYLON.Vector3(-71.05, 25.64, 35.54);
let sphere041cl1 = sphere041.clone("sphere041cl1");
let sphere041cl2 = sphere041.clone("sphere041cl2");
let sphere041cl3 = sphere041.clone("sphere041cl3");
let sphere042 = sphere.clone("sphere042");
sphere042.position = new BABYLON.Vector3(-81, 161.5, 41.4);
let sphere042cl1 = sphere042.clone("sphere042cl1");
let sphere042cl2 = sphere042.clone("sphere042cl2");
let sphere042cl3 = sphere042.clone("sphere042cl3");
var sphere051 = sphere.clone("sphere051");
sphere051.position = new BABYLON.Vector3(-96.67, 100.2, -17.83);
var sphere051cl1 = sphere051.clone("sphere051cl1");
var sphere051cl2 = sphere051.clone("sphere051cl2");
var sphere051cl3 = sphere051.clone("sphere051cl3");
var sphere020 = sphere.clone("sphere020");
sphere020.position = new BABYLON.Vector3(-73.47, 56.6, -39.93);
var sphere02152 = sphere.clone("sphere02152");
sphere02152.position = new BABYLON.Vector3(-104.3, 142.8, 50.64);
var sphere02152cl1 = sphere02152.clone("sphere02152cl1");
var sphere02152cl2 = sphere02152.clone("sphere02152cl2");
var sphere02152cl3 = sphere02152.clone("sphere02152cl3");
var sphere00552 = sphere.clone("sphere00552");
sphere00552.position = new BABYLON.Vector3(-104.267, 142.802, -48.2834);
var sphere00552cl1 = sphere00552.clone("sphere00552cl1");
var sphere00552cl2 = sphere00552.clone("sphere00552cl2");
var sphere00552cl3 = sphere00552.clone("sphere00552cl3");
// let sphere053cl6=sphere053.clone("sphere053cl6");

const track044 = []; //管道Brep.044的轨迹
track044.push(new slide(5.8, "up")); //first side length 6
track044.push(new slide(5.8 + 1, "front")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8 + 1 + 14.5, "right")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8 + 1 + 14.5 + 28, "front")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8 + 1 + 14.5 + 28 + 6, "right")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8 + 1 + 14.5 + 28 + 6 + 3.3, "down")); //最后一条
//all sides cover

//创建一个绿色的粒子系统
let particleSystem1 = new BABYLON.ParticleSystem("particles1", 10000, scene); //自动给每个粒子系统编号
makeparticle(
  sphere,
  particleSystem1,
  new BABYLON.Color4(0.04, 0.63, 0.02),
  new BABYLON.Color4(0.14, 0.74, 0.09),
  new BABYLON.Color4(0.13, 0.55, 0.13, 0.8)
);
moveparticle(track044, sphere, 51, 25, 91, 0);

let particleSystem2 = new BABYLON.ParticleSystem("particles2", 10000, scene); //自动给每个粒子系统编号
//创建一个绿色的粒子系统
makeparticle(
  sphere004cl1,
  particleSystem2,
  new BABYLON.Color4(0.04, 0.63, 0.02),
  new BABYLON.Color4(0.14, 0.74, 0.09),
  new BABYLON.Color4(0.13, 0.55, 0.13, 0.8)
);
moveparticle(track044, sphere004cl1, 51, 25, 91, 7500); //间隔时间

const track008 = []; //管道Brep.008的轨迹
track008.push(new slide(2, "up")); //first side length 6
track008.push(new slide(2 + 16.9, "behind")); //at finish of second side distance covered is 18+9
// track008.push(new sli23.4+96.5+0.2,"down")); //at finish of second side distance covered is 18+9
track008.push(new slide(2 + 16.9 + 27, "left")); //at finish of second side distance covered is 18+9
track008.push(new slide(2 + 16.9 + 27 + 18, "front")); //at finish of second side distance covered is 18+9
track008.push(new slide(2 + 16.9 + 27 + 18 + 3.5, "down")); //最后一条共70.33
let particleSystem3 = new BABYLON.ParticleSystem(`particles3`, 10000, scene); //自动给每个粒子系统编号
let particleSystem4 = new BABYLON.ParticleSystem(`particles4`, 10000, scene); //自动给每个粒子系统编号
//创建一个绿色的粒子系统
makeparticle(
  sphere008,
  particleSystem3,
  new BABYLON.Color4(0.17, 0.97, 0.02),
  new BABYLON.Color4(0.6, 0.93, 0.57),
  new BABYLON.Color4(0, 0.2, 0, 0.8)
);
moveparticle(track008, sphere008, 3.5, 27.8, 71.8, 0);
makeparticle(
  sphere008cl1,
  particleSystem4,
  new BABYLON.Color4(0.17, 0.97, 0.02),
  new BABYLON.Color4(0.6, 0.93, 0.57),
  new BABYLON.Color4(0, 0.2, 0, 0.8)
);
moveparticle(track008, sphere008cl1, 3.5, 27.8, 71.8, 8000);
const track049 = []; //管道Brep.049的轨迹
track049.push(new slide(3.5, "right")); //first side length 6
track049.push(new slide(3.5 + 21.2, "up")); //at finish of second side distance covered is 18+9
track049.push(new slide(3.5 + 21.2 + 10.2, "behind")); //at finish of second side distance covered is 18+9
// track049.push(new sli3.54.1.2+22+10.2+0,"down")); //at finish of second side distance covered is 18+9
track049.push(new slide(3.5 + 21.2 + 10.2 + 0 + 47, "left")); //at finish of second side distance covered is 18+9
track049.push(new slide(3.5 + 21.2 + 10.2 + 0 + 47 + 23.3, "front"));
track049.push(new slide(3.5 + 21.2 + 10.2 + 0 + 47 + 23.3 + 2.5, "right"));
track049.push(new slide(3.5 + 21.2 + 10.2 + 0 + 47 + 23.3 + 2.5 + 3.5, "down")); //最后一条共70.3

let particleSystem5 = new BABYLON.ParticleSystem(`particles5`, 10000, scene);
let particleSystem6 = new BABYLON.ParticleSystem(`particles6`, 10000, scene);
//创建一个紫色的粒子系统
makeparticle(
  sphere049,
  particleSystem5,
  new BABYLON.Color4(0.68, 0, 1),
  new BABYLON.Color4(0.77, 0.24, 0.93),
  new BABYLON.Color4(0.71, 0.44, 0.89)
);
moveparticle(track049, sphere049, -8, 9.57, 79.6, 0);
makeparticle(
  sphere049cl1,
  particleSystem6,
  new BABYLON.Color4(0.68, 0, 1),
  new BABYLON.Color4(0.77, 0.24, 0.93),
  new BABYLON.Color4(0.71, 0.44, 0.89)
);
moveparticle(track049, sphere049cl1, -8, 9.57, 79.6, 6000);

const track053_2=[];
track053_2.push(new slide(3, "down")); //first side length 6
track053_2.push(new slide(3 + 22, "right")); //at finish of second side distance covered is 18+9
track053_2.push(new slide(3 + 22 + 8.5, "up")); //at finish of second side distance covered is 18+9
track053_2.push(new slide(3 + 22 + 8.5 + 16.5, "right")); //at finish of second side distance covered is 18+9
track053_2.push(new slide(3 + 22 + 8.5 + 16.5 + 104, "down")); //at finish of second side distance covered is 18+9
track053_2.push(new slide(3 + 22 + 8.5 + 16.5 + 104 + 39.5, "behind"));
track053_2.push(new slide(3 + 22 + 8.5 + 16.5 + 104 + 39.5 + 159.5 , "left"));
track053_2.push(new slide(3 + 22 + 8.5 + 16.5 + 104 + 39.5 + 159.5 + 20, "behind"));
track053_2.push(new slide(3 + 22 + 8.5 + 16.5 + 104 + 39.5 + 159.5 + 20 + 3.5, "down")); //最后一条 共59.3
let particleSystem32 = new BABYLON.ParticleSystem(`particles7`, 10000, scene);
let particleSystem33 = new BABYLON.ParticleSystem(`particles8`, 10000, scene);
let particleSystem34 = new BABYLON.ParticleSystem(`particles9`, 10000, scene);
let particleSystem35 = new BABYLON.ParticleSystem(`particles10`, 10000, scene);

//创建一个绿色的粒子系统
makeparticle(
  sphere053_2,
  particleSystem32,
  new BABYLON.Color4(0.17, 0.97, 0.02),
  new BABYLON.Color4(0.6, 0.93, 0.57),
  new BABYLON.Color4(0, 0.2, 0, 0.8)
);
moveparticle(track053_2, sphere053_2, -94.3, 130.4, -0.1, 1000);
makeparticle(
  sphere053_2cl1,
  particleSystem33,
  new BABYLON.Color4(0.17, 0.97, 0.02),
  new BABYLON.Color4(0.6, 0.93, 0.57),
  new BABYLON.Color4(0, 0.2, 0, 0.8)
);
moveparticle(track053_2, sphere053_2cl1, -94.3, 130.4, -0.1, 6000);
makeparticle(
  sphere053_2cl2,
  particleSystem34,
  new BABYLON.Color4(0.17, 0.97, 0.02),
  new BABYLON.Color4(0.6, 0.93, 0.57),
  new BABYLON.Color4(0, 0.2, 0, 0.8)
);
moveparticle(track053_2, sphere053_2cl2, -94.3, 130.4, -0.1, 12000);
makeparticle(
  sphere053_2cl3,
  particleSystem35,
  new BABYLON.Color4(0.17, 0.97, 0.02),
  new BABYLON.Color4(0.6, 0.93, 0.57),
  new BABYLON.Color4(0, 0.2, 0, 0.8)
);
moveparticle(track053_2, sphere053_2cl3, -94.3, 130.4, -0.1, 18000);

const track053 = []; //管道Brep.053的轨迹
track053.push(new slide(3.5, "up")); //first side length 6
track053.push(new slide(3.5 + 20, "front")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5 + 20 + 158.3, "right")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5 + 20 + 158.3 + 41.4, "front")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5 + 20 + 158.3 + 41.4 + 104.2, "up")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5 + 20 + 158.3 + 41.4 + 104.2 + 17.4, "left"));
track053.push(new slide(3.5 + 20 + 158.3 + 41.4 + 104.2 + 17.4 + 10, "down"));
track053.push(new slide(3.5 + 20 + 158.3 + 41.4 + 104.2 + 17.4 + 10 + 21.3, "left"));
track053.push(new slide(3.5 + 20 + 158.3 + 41.4 + 104.2 + 17.4 + 10 + 21.3 + 4.5, "up")); //最后一条 共59.3
let particleSystem7 = new BABYLON.ParticleSystem(`particles7`, 10000, scene);
let particleSystem8 = new BABYLON.ParticleSystem(`particles8`, 10000, scene);
let particleSystem9 = new BABYLON.ParticleSystem(`particles9`, 10000, scene);
let particleSystem10 = new BABYLON.ParticleSystem(`particles10`, 10000, scene);

//创建一个紫色的粒子系统
makeparticle(
  sphere053,
  particleSystem7,
  new BABYLON.Color4(0.68, 0, 1),
  new BABYLON.Color4(0.77, 0.24, 0.93),
  new BABYLON.Color4(0.71, 0.44, 0.89)
);
moveparticle(track053, sphere053, 25.3, 27.6, 61.4, 1000);
makeparticle(
  sphere053cl1,
  particleSystem8,
  new BABYLON.Color4(0.68, 0, 1),
  new BABYLON.Color4(0.77, 0.24, 0.93),
  new BABYLON.Color4(0.71, 0.44, 0.89)
);
moveparticle(track053, sphere053cl1, 25.3, 27.6, 61.4, 6000);
makeparticle(
  sphere053cl2,
  particleSystem9,
  new BABYLON.Color4(0.68, 0, 1),
  new BABYLON.Color4(0.77, 0.24, 0.93),
  new BABYLON.Color4(0.71, 0.44, 0.89)
);
moveparticle(track053, sphere053cl2, 25.3, 27.6, 61.4, 12000);
makeparticle(
  sphere053cl3,
  particleSystem10,
  new BABYLON.Color4(0.68, 0, 1),
  new BABYLON.Color4(0.77, 0.24, 0.93),
  new BABYLON.Color4(0.71, 0.44, 0.89)
);
moveparticle(track053, sphere053cl3, 25.3, 27.6, 61.4, 18000);

const track041 = []; //管道Brep.041的轨迹
track041.push(new slide(81, "up")); //first side length 6
track041.push(new slide(81 + 73.94, "front")); //at finish of second side distance covered is 18+9
track041.push(new slide(81 + 73.94 + 54.7, "up")); //at finish of second side distance covered is 18+9
track041.push(new slide(81 + 73.94 + 54.7 + 12.6, "right")); //at finish of second side distance covered is 18+9
var particleSystem11 = new BABYLON.ParticleSystem(`particles11`, 10000, scene);
var particleSystem12 = new BABYLON.ParticleSystem(`particles12`, 10000, scene);
var particleSystem13 = new BABYLON.ParticleSystem(`particles13`, 10000, scene);
var particleSystem14 = new BABYLON.ParticleSystem(`particles14`, 10000, scene);
//创建一个蓝色的粒子系统
makeparticle(
  sphere041,
  particleSystem11,
  new BABYLON.Color4(0, 0.22, 1),
  new BABYLON.Color4(0.11, 0.19, 0.89),
  new BABYLON.Color4(0.44, 0.54, 0.85)
);
moveparticle(track041, sphere041, -71.1, 25.64, 35.54, 1000);
makeparticle(
  sphere041cl1,
  particleSystem12,
  new BABYLON.Color4(0, 0.22, 1),
  new BABYLON.Color4(0.11, 0.19, 0.89),
  new BABYLON.Color4(0.44, 0.54, 0.85)
);
moveparticle(track041, sphere041cl1, -71.1, 25.64, 35.54, 6000);
makeparticle(
  sphere041cl2,
  particleSystem13,
  new BABYLON.Color4(0, 0.22, 1),
  new BABYLON.Color4(0.11, 0.19, 0.89),
  new BABYLON.Color4(0.44, 0.54, 0.85)
);
moveparticle(track041, sphere041cl2, -71.1, 25.64, 35.54, 12000);
makeparticle(
  sphere041cl3,
  particleSystem14,
  new BABYLON.Color4(0, 0.22, 1),
  new BABYLON.Color4(0.11, 0.19, 0.89),
  new BABYLON.Color4(0.44, 0.54, 0.85)
);
moveparticle(track041, sphere041cl3, -71.1, 25.64, 35.54, 18000);

const track042 = [];//管道Brep.042的轨迹
track042.push(new slide(7,"left"));  //first side length 6
track042.push(new slide(7+57,"down")); //at finish of second side distance covered is 18+9
track042.push(new slide(7+57+31,"front")); //at finish of second side distance covered is 18+9
track042.push(new slide(7+57+31+40,"right")); //at finish of second side distance covered is 18+9
track042.push(new slide(7+57+31+40+72.98,"down")); //at finish of second side distance covered is 18+9
var particleSystem15=new BABYLON.ParticleSystem(`particles15`,10000,scene);
var particleSystem16=new BABYLON.ParticleSystem(`particles16`,10000,scene);
var particleSystem17=new BABYLON.ParticleSystem(`particles17`,10000,scene);
var particleSystem18=new BABYLON.ParticleSystem(`particles18`,10000,scene);
//创建一个蓝色的粒子系统
makeparticle(
  sphere042,
  particleSystem15,
  new BABYLON.Color4(0, 0.22, 1),
  new BABYLON.Color4(0.11, 0.19, 0.89),
  new BABYLON.Color4(0.44, 0.54, 0.85)
);
moveparticle(track042, sphere042, -81, 161.5, 41.4, 1000);
makeparticle(
  sphere042cl1,
  particleSystem16,
  new BABYLON.Color4(0, 0.22, 1),
  new BABYLON.Color4(0.11, 0.19, 0.89),
  new BABYLON.Color4(0.44, 0.54, 0.85)
);
moveparticle(track042, sphere042cl1, -81, 161.5, 41.4, 6000);
makeparticle(
  sphere042cl2,
  particleSystem17,
  new BABYLON.Color4(0, 0.22, 1),
  new BABYLON.Color4(0.11, 0.19, 0.89),
  new BABYLON.Color4(0.44, 0.54, 0.85)
);
moveparticle(track042, sphere042cl2, -81, 161.5, 41.4, 12000);
makeparticle(
  sphere042cl3,
  particleSystem18,
  new BABYLON.Color4(0, 0.22, 1),
  new BABYLON.Color4(0.11, 0.19, 0.89),
  new BABYLON.Color4(0.44, 0.54, 0.85)
);
moveparticle(track042, sphere042cl3, -81, 161.5, 41.4, 18000);

const track051 = []; //管道Brep.051的轨迹
track051.push(new slide(7.8, "down")); //first side length 6
track051.push(new slide(7.8 + 28, "front")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8 + 28 + 32, "left")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8 + 28 + 32 + 68, "down")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8 + 28 + 32 + 68 + 13.26, "behind")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8 + 28 + 32 + 68 + 13.26 + 7.95, "right")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8 + 28 + 32 + 68 + 13.26 + 7.95 + 2.28, "down")); //at finish of second side distance covered is 18+9
var particleSystem19 = new BABYLON.ParticleSystem(`particles19`, 10000, scene);
var particleSystem20 = new BABYLON.ParticleSystem(`particles20`, 10000, scene);
var particleSystem21 = new BABYLON.ParticleSystem(`particles21`, 10000, scene);
var particleSystem22 = new BABYLON.ParticleSystem(`particles22`, 10000, scene);
//创建一个黄色的粒子系统
makeparticle(
  sphere051,
  particleSystem19,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track051, sphere051, -96.67, 100.2, -17.83, 1000);
makeparticle(
  sphere051cl1,
  particleSystem20,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track051, sphere051cl1, -96.67, 100.2, -17.83, 6000);
makeparticle(
  sphere051cl2,
  particleSystem21,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track051, sphere051cl2, -96.67, 100.2, -17.83, 12000);
makeparticle(
  sphere051cl3,
  particleSystem22,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track051, sphere051cl3, -96.67, 100.2, -17.83, 18000);

const track020 = []; //管道Brep.020的轨迹
track020.push(new slide(6.2, "behind")); //first side length 6
track020.push(new slide(6.2 + 9.4, "left")); //at finish of second side distance covered is 18+9
track020.push(new slide(6.2 + 9.4 + 13.5, "front")); //at finish of second side distance covered is 18+9
var particleSystem23 = new BABYLON.ParticleSystem(`particles23`, 10000, scene);
//创建一个黄色的粒子系统
makeparticle(
  sphere020,
  particleSystem23,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44),
  0.2,
  0.25
);
moveparticle(track020, sphere020, -73.47, 56.6, -39.93, 1000);

const track02152 = []; //管道Brep.021+Brep.052的轨迹
track02152.push(new slide(3.5, "behind")); //first side length 6
track02152.push(new slide(3.5 + 36, "down")); //at finish of second side distance covered is 18+9
track02152.push(new slide(3.5 + 36 + 110, "front")); //at finish of second side distance covered is 18+9
track02152.push(new slide(3.5 + 36 + 110 + 40, "left")); //at finish of second side distance covered is 18+9
track02152.push(new slide(3.5 + 36 + 110 + 40 + 82.2, "down")); //at finish of second side distance covered is 18+9
// track02152.push(new slide(3.5+36+110+42.2+83+1,"left")); //at finish of second side distance covered is 18+9
track02152.push(new slide(3.5 + 36 + 110 + 40 + 82.2 + 26, "behind")); //at finish of second side distance covered is 18+9
track02152.push(new slide(3.5 + 36 + 110 + 40 + 82.2 + 26 + 8.8, "right")); //at finish of second side distance covered is 18+9
track02152.push(new slide(3.5 + 36 + 110 + 40 + 82.2 + 26 + 8.8 + 2.2, "down")); //at finish of second side distance covered is 18+9
var particleSystem24 = new BABYLON.ParticleSystem(`particles24`, 10000, scene);
var particleSystem25 = new BABYLON.ParticleSystem(`particles25`, 10000, scene);
var particleSystem26 = new BABYLON.ParticleSystem(`particles26`, 10000, scene);
var particleSystem27 = new BABYLON.ParticleSystem(`particles27`, 10000, scene);
//创建一个黄色的粒子系统
makeparticle(
  sphere02152,
  particleSystem24,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track02152, sphere02152, -104.3, 142.8, 50.64, 1000);
makeparticle(
  sphere02152cl1,
  particleSystem25,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track02152, sphere02152cl1, -104.3, 142.8, 50.64, 6000);
makeparticle(
  sphere02152cl2,
  particleSystem26,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track02152, sphere02152cl2, -104.3, 142.8, 50.64, 12000);
makeparticle(
  sphere02152cl3,
  particleSystem27,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track02152, sphere02152cl3, -104.3, 142.8, 50.64, 18000);

const track00552 = []; //管道Brep.021+Brep.052的轨迹
track00552.push(new slide(5.9, "front")); //first side length 6
track00552.push(new slide(5.9 + 36, "down")); //at finish of second side distance covered is 18+9
track00552.push(new slide(5.9 + 36 + 40, "left")); //at finish of second side distance covered is 18+9
track00552.push(new slide(5.9 + 36 + 40 + 82, "down")); //at finish of second side distance covered is 18+9
// track00552.push(new sli5.9e(65.5+42+83+1,"left")); //at finish of second side distance covered is 18+9
track00552.push(new slide(5.9 + 36 + 40 + 82 + 24.5, "behind")); //at finish of second side distance covered is 18+9
track00552.push(new slide(5.9 + 36 + 40 + 82 + 24.5 + 8.8, "right")); //at finish of second side distance covered is 18+9
track00552.push(new slide(5.9 + 36 + 40 + 82 + 24.5 + 8.8 + 2.2, "down")); //at finish of second side distance covered is 18+9
var particleSystem28 = new BABYLON.ParticleSystem(`particles28`, 10000, scene);
var particleSystem29 = new BABYLON.ParticleSystem(`particles29`, 10000, scene);
var particleSystem30 = new BABYLON.ParticleSystem(`particles30`, 10000, scene);
var particleSystem31 = new BABYLON.ParticleSystem(`particles31`, 10000, scene);
//创建一个黄色的粒子系统
makeparticle(
  sphere00552,
  particleSystem28,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track00552, sphere00552, -104.267, 142.802, -48.2834, 1000);
makeparticle(
  sphere00552cl1,
  particleSystem29,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track00552, sphere00552cl1, -104.267, 142.802, -48.2834, 6000);
makeparticle(
  sphere00552cl2,
  particleSystem30,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track00552, sphere00552cl2, -104.267, 142.802, -48.2834, 12000);
makeparticle(
  sphere00552cl3,
  particleSystem31,
  new BABYLON.Color4(0.85, 1, 0),
  new BABYLON.Color4(0.77, 0.89, 0.11),
  new BABYLON.Color4(0.81, 0.85, 0.44)
);
moveparticle(track00552, sphere00552cl3, -104.267, 142.802, -48.2834, 18000);

function particlestart() {
  particleSystem1.start(); //Brep044
  // particleSystem2.start();
  particleSystem3.start(); //Brep008
  // particleSystem4.start();
  particleSystem5.start(); //Brep049
  // particleSystem6.start();
  particleSystem7.start(); //Brep053
  particleSystem8.start();
  particleSystem9.start();
  particleSystem10.start();
  particleSystem11.start(); //Brep041
  particleSystem12.start();
  particleSystem13.start();
  particleSystem14.start();
  particleSystem15.start(); //Brep042
  particleSystem16.start();
  particleSystem17.start();
  particleSystem18.start();
  particleSystem19.start(); //Brep051
  particleSystem20.start();
  particleSystem21.start();
  particleSystem22.start();
  particleSystem23.start(); //Brep020
  particleSystem24.start(); //Brep02152
  particleSystem25.start();
  particleSystem26.start();
  particleSystem27.start();
  particleSystem28.start(); //Brep00552
  particleSystem29.start();
  particleSystem30.start();
  particleSystem31.start();
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
function alphachange(mesh,labelName){//楼板透明度改变
    if((labelName==="Brep")||labelName==="Brep.091"||(labelName==="Brep.092")){
        let myclapboardMaterial=new BABYLON.PBRMaterial("myclapboardMaterial", scene);
        myclapboardMaterial.albedoColor=new BABYLON.Color3.White(); // 反射颜色
        myclapboardMaterial.metallic=0.2 // 金属
        myclapboardMaterial.roughness=0.8 // 粗糙
        // if(mesh.isVisible===true){
        if(mesh.alpha==1){
            myclapboardMaterial.alpha=0;
            mesh.material = myclapboardMaterial;
            mesh.alpha=0;
            // mesh.isVisible=false;
        }
        else{
            myclapboardMaterial.alpha=1;
            mesh.material = clapboardbegin;
            mesh.alpha=1;
            // mesh.isVisible=true
        }
        console.log("isVisible",mesh.isVisible)

    }
}
function flowProcess(ProcessName){
  if(ProcessName=="fillCO2"){
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
        mesh.material= equipmentsmaterialgreen_alpha
      })
      let Equipments_12=["Mesh.3791","10QN003"];
      Equipments_12.forEach(function(it){
        let mesh = scene.getMeshById(it);
        mesh.material= equipmentsmaterialyellow
      })
      //柜外管道流向改变
      particleSystem32.stop();//053_2
      particleSystem33.stop();
      particleSystem34.stop();
      particleSystem35.stop();
      particleSystem7.start(); //Brep053
      particleSystem8.start();
      particleSystem9.start();
      particleSystem10.start();

      //管道变色(二氧化碳管道变氢气管道)
      let pipe3=scene.getMeshById("Brep.053");
      let carbonmaterial= new BABYLON.PBRMaterial("carbonmaterial", scene); //创建pbr 二氧化碳管道材料
      carbonmaterial.albedoColor=new BABYLON.Color3.Purple(); // 反射颜色
      carbonmaterial.metallic=0.5 // 金属
      carbonmaterial.roughness=0.5 // 粗糙
      carbonmaterial.alpha=0.3;
      pipe3.material = carbonmaterial;
  }
  if(ProcessName=="exhaustH2"){
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
      mesh.material= equipmentsmaterialgreen_alpha
    })
    let Equipments_13=["Mesh.3798","Mesh.3791","Mesh.3691","Mesh.4092","10QN003"];
    Equipments_13.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialgreen
    })
    //柜外管道流向改变
    particleSystem7.stop(); //Brep053
    particleSystem8.stop();
    particleSystem9.stop();
    particleSystem10.stop();
    particleSystem32.start();//053_2
    particleSystem33.start();
    particleSystem34.start();
    particleSystem35.start();
    //管道变色(二氧化碳管道变氢气管道)
    let pipe1=scene.getMeshById("Brep.053");
    let hydrogenmaterial = new BABYLON.PBRMaterial("hydrogenmaterial", scene); //创建pbr 氢气管道材料
    hydrogenmaterial.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    hydrogenmaterial.metallic=1 // 金属
    hydrogenmaterial.roughness=0.5 // 粗糙
    hydrogenmaterial.alpha=0.3;
    pipe1.material = hydrogenmaterial;
}
  if(ProcessName=="fillH2fromPowerPlant"){
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
    })
    let Equipments_12=["Mesh.3691","Mesh.3798","Mesh.4092"];
    Equipments_12.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialyellow
    })
    //柜外管道流动重新启动
    particleSystem7.start(); //Brep053
    particleSystem8.start();
    particleSystem9.start();
    particleSystem10.start();
  }
  if(ProcessName=="fillH2fromConfluence"){
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
    })
    let Equipments_12=["Mesh.3691","Mesh.3798","Mesh.4092"];
    Equipments_12.forEach(function(it){
      let mesh = scene.getMeshById(it);
      mesh.material= equipmentsmaterialyellow
    })
    //柜外管道流动重新启动
    particleSystem7.start(); //Brep053
    particleSystem8.start();
    particleSystem9.start();
    particleSystem10.start();
  }
  if(ProcessName=="operationNormally"){
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
    })
    //柜外管道流动暂停
    particleSystem7.stop(); //Brep053
    particleSystem8.stop();
    particleSystem9.stop();
    particleSystem10.stop();
  }
  if(ProcessName=="purificationH2"){
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
    })
  }
  if(ProcessName=="makeH2"){
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
    })
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
  scene.onBeforeRenderObservable.add(() => {

      if(direction==2){
          materialSphere3.diffuseTexture.vOffset += -0.2;
      }
      else if(direction==1){
          materialSphere3.diffuseTexture.vOffset += 0.2;
      }
      else if(direction==3){
          materialSphere3.diffuseTexture.uOffset += -0.2;
      }
      else if(direction==4){
          materialSphere3.diffuseTexture.uOffset += 0.2;
    }
  })
}

BABYLON.SceneLoader.ImportMesh(
    "",
    "model/",
    "modelv18d.glb",
    scene,
    function (Meshes) {
        console.log("Meshes:",Meshes)
        changematerial(Meshes);
        particlestart();
        flowProcess("fillCO2");
        // flowProcess("exhaustH2");
        // flowProcess("fillH2fromPowerPlant");
        flowProcess("fillH2fromConfluence");
        flowProcess("purificationH2");
        flowProcess("makeH2");
        // flowProcess("operationNormally")
        let importedMesh = Meshes[0];
        // console.log(Meshes);
        importedMesh.getChildren().forEach(function (mesh){
            //仅为json文件中存在的设备绑定事件
            if(getJson(mesh.id) !== '暂无设备信息'){
                childMesh.push(mesh);
                mesh.actionManager = actionManager;
                modelsPosition.set(mesh.id,mesh.position);
            }else {
                mesh.actionManeger = nullManager;
            }
            // if(getPipeJson(mesh.id) !== '暂无设备信息'){
            //     childMesh.push(mesh);
            //     mesh.actionManager = nullManager;
            // }else {
            //     mesh.actionManeger = nullManager;
            // }
        });
        console.log("modeldocument",document.getElementById("model"))
        // window.onload = function () {
          document.getElementById("model").appendChild(canvas);
        // };
        // engine.snapshotRenderingMode = BABYLON.Constants.SNAPSHOTRENDERING_STANDARD;
        // engine.snapshotRendering = true;
        // console.log("here")
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

export function createWarningMessage(modelID, url) {
  let warningModel = scene.getMeshById(modelID);

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
    window.open(url, "_blank");
  });
  clonedIcon.addEventListener("mouseover", function () {
    //createLabel();
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
    resetCamera();
    let mesh = scene.getMeshById(modelID);
    highLightLayer.addMesh(mesh, BABYLON.Color3.Blue());
    camera.setPosition(new BABYLON.Vector3(modelPosition.x, 30, -45));

    const targetPosition = (modelPosition.scale(2)).subtract(camera.position)
    camera.setTarget(targetPosition.add(new BABYLON.Vector3(0, 1, 0)));
    console.log(modelPosition);
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
  // setWarningPosition(warningModels);
  //
  // //计算帧率
  // let fps = engine.getFps().toFixed();
  //
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
});
