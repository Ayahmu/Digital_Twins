//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data1 from '../public/json/HydrogenSysInfo.json'
import data2 from '../public/json/pipe.json'
import {camera_config} from './config.js';
import {getJson, getPDF} from "./connect.js";

//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex = "3";

window.onload = function (){
    document.getElementById("model").appendChild(canvas);
}
// //将canvas添加到body中
// document.body.appendChild(canvas);

export let objectArray;
export let pipeArray;
let idToDoor = {};
idToDoor["Mesh.2971"] = 0;
idToDoor["Mesh.1898"] = 1;
idToDoor["Mesh.633"] = 2;
//读取json数据

function MyObject(ID, Name, Info, Manual, Url, State, SpareParts, LocID, Animation) {
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
objectArray = data1.map(jsonObject => new MyObject(
    jsonObject.ID,
    jsonObject.Name,
    jsonObject.Info,
    jsonObject.Manual,
    jsonObject.Url,
    jsonObject.State,
    jsonObject.SpareParts,
    jsonObject.LocID,
    jsonObject.Animation
));
pipeArray = data2.map(jsonObject => new MyObject(
    jsonObject.ID,
    jsonObject.Name,
    jsonObject.Info,
    jsonObject.Manual,
    jsonObject.Url,
    jsonObject.LocID,
    jsonObject.Animation
));


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
const engine = new BABYLON.Engine(canvas,true,{stencil:true});


//创建场景
const scene = new BABYLON.Scene(engine,false);
// const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("texture/hdr/environment.env", scene);
let hdrTexture = new BABYLON.HDRCubeTexture("texture/hdr/env3.hdr", scene, 1024);
scene.environmentTexture = hdrTexture;
scene.createDefaultSkybox(hdrTexture, true);
scene.environmentIntensity = 0.4;

let initTarget = new BABYLON.Vector3(-37.95875211948178, 73.00066611807962, 64.42490800253104); // 相机目标点
let initPos = new BABYLON.Vector3(-37.99717668174966, 86.58864238456036, 333.38193590224483);

// 创建相机
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,                // 相机水平旋转角度
    0,                // 相机垂直旋转角度
    10,               // 相机旋转半径
    new BABYLON.Vector3(-37.95875211948178, 73.00066611807962, 64.42490800253104), // 相机目标点
    scene             // 相机所在场景
);
// 设置相机的灵敏度
camera.panningSensibility = camera_config.camera_panningSensibility; // 增加平移灵敏度
camera.wheelPrecision = 1 / camera_config.camera_wheelPrecision;
camera.inertia = 0; //设置为0以禁用移动和旋转的惯性
camera.panningInertia = 0;

camera.position = new BABYLON.Vector3(-37.99717668174966, 86.58864238456036, 333.38193590224483
);

//将相机附加到画布上,
camera.attachControl(canvas);


//创建高亮层
let highLightLayer = new BABYLON.HighlightLayer('highLightLayer',scene,{camera:camera});

//添加鼠标监听事件
const actionManager = new BABYLON.ActionManager(scene);
//未注册json的模型事件
const nullManager = new BABYLON.ActionManager(scene);

let childMesh = [];

//模型数组
let models = []

actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,//鼠标悬停触发
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    removeLabel(rmLabelBuild);
                    highLight(event.meshUnderPointer,event.meshUnderPointer.id);
                    console.log(event.meshUnderPointer.id)
                    // createLabel(event);
                    break;
            }
        }
    )
)
nullManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,//鼠标单机触发
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    // console.log(event.meshUnderPointer.id)
                    break;
            }
        }
    )
)

actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger, //鼠标移走触发
        function (event){
            switch (event.meshUnderPointer.id){
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
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    opendoor(event.meshUnderPointer,event.meshUnderPointer.id);
                    alphachange(event.meshUnderPointer,event.meshUnderPointer.id);
                    displayLabel(event);
                    let pickInfo = scene.pick(scene.pointerX, scene.pointerY);

                    if (pickInfo.hit) {
                        // 鼠标点击位置的世界坐标
                        clickPos = pickInfo.pickedPoint;
                        console.log("鼠标点击位置的世界坐标:", clickPos);
                        console.log("点击模型世界坐标:", event.meshUnderPointer.position)
                    }
                    break;
            }
        }
    )
);

let intervalID;
function displayLabel(event){
    let infoLabelElm = document.getElementById("info-label");

    document.addEventListener('click',function (event){
        if(infoLabelElm.style.display === 'block' && !infoLabelElm.contains(event.target)){
            infoLabelElm.style.display = 'none';
        }
    })

    setTimeout(()=>{
        infoLabelElm.style.display = 'block';
    },10)


    let nameElm = document.getElementById("modelName");
    let idElm = document.getElementById("modelID");
    let infoElm = document.getElementById("modelInfo");
    let stateElm = document.getElementById("modelState");
    let manualElm = document.getElementById("modelManual");
    let spareElm = document.getElementById("modelSpare");

    let targetModel = objectArray[idToIndexMap1[event.meshUnderPointer.id]]

    nameElm.innerHTML = "设备名称:   " + targetModel.Name;
    idElm.innerHTML = "设备编号:    " + targetModel.ID;
    infoElm.innerHTML = "设备描述:  " + targetModel.Info;
    stateElm.innerHTML = "设备状态:  " + targetModel.State;
    manualElm.innerHTML = "设备资料:    " + targetModel.Manual;
    spareElm.innerHTML = "备件信息:  " + targetModel.SpareParts;

    manualElm.onclick = function (){
        getPDF(targetModel.Manual);
    }

    if(!intervalID){
        intervalID = setInterval(()=>{
            setUiPosition(infoLabelElm, event.meshUnderPointer, 20, -10, true);
        },100);
    }else {
        clearInterval(intervalID);
        intervalID = undefined;
    }


}

let rmLabelBuild = []

let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
advancedTexture.renderScale = 1;

let selectMesh, selectName;
let clickPos;
function highLight(mesh, labelName) {
    if((labelName!="Brep")&&labelName!="Brep.091"&&(labelName!="Brep.092")){
        selectMesh = mesh;
        selectName = labelName;
        highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
        models.push(mesh);
    }
}

let targetPosCamera, targetPosMesh;
targetPosCamera = new BABYLON.Vector3(-100,-100,-100);
targetPosMesh= new BABYLON.Vector3(-100,-105,-100);



function resetCamera(){
    camera.rotation = new BABYLON.Vector3(0, 0, 0);

    camera.position = initPos;
    camera.setTarget(initTarget);
    camera.inertia = 0; //设置为0以禁用移动和旋转的惯性

    console.log("Camera reset");
}
export {
    resetCamera
}


function removeLabel(arr) {
    //清除面板
    for (let i = 0; i < arr.length; i++) {
        arr[i].dispose();
    }
    //清除高光
    models.forEach((mesh)=>{
        highLightLayer.removeMesh(mesh);
    })
    models = [];
    rmLabelBuild = [];
}
function changematerial(){
    // 管道透明
    //氢气管道
    let pipe1=scene.getMeshById("Brep.044");
    let pipe2=scene.getMeshById("Brep.008");
    let hydrogenmaterial = new BABYLON.PBRMaterial("hydrogenmaterial", scene); //创建pbr 氢气管道材料
    hydrogenmaterial.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
    hydrogenmaterial.metallic=1 // 金属
    hydrogenmaterial.roughness=0.5 // 粗糙
    hydrogenmaterial.alpha=0.3;
    pipe1.material = hydrogenmaterial;
    pipe2.material = hydrogenmaterial;
    //二氧化碳管道
    let pipe3=scene.getMeshById("Brep.049");
    let pipe4=scene.getMeshById("Brep.053");
    let carbonmaterial= new BABYLON.PBRMaterial("carbonmaterial", scene); //创建pbr 二氧化碳管道材料
    carbonmaterial.albedoColor=new BABYLON.Color3.Purple(); // 反射颜色
    carbonmaterial.metallic=0.5 // 金属
    carbonmaterial.roughness=0.5 // 粗糙
    carbonmaterial.alpha=0.3;
    pipe3.material = carbonmaterial;
    pipe4.material = carbonmaterial;
    //水管道
    let pipe5=scene.getMeshById("Brep.041");
    let pipe6=scene.getMeshById("Brep.042");
    let watermaterial= new BABYLON.PBRMaterial("watermaterial", scene); //创建pbr 二氧化碳管道材料
    watermaterial.albedoColor=new BABYLON.Color3.Blue(); // 反射颜色
    watermaterial.metallic=0.5 // 金属
    watermaterial.roughness=0.5 // 粗糙
    watermaterial.alpha=0.3;
    pipe5.material = watermaterial;
    pipe6.material = watermaterial;
    //油管
    let pipe7=scene.getMeshById("Brep.051");
    let pipe8=scene.getMeshById("Brep.020");
    let pipe9=scene.getMeshById("Brep.021");
    let pipe10=scene.getMeshById("Brep.005");
    let pipe11=scene.getMeshById("Brep.052");
    let oilmaterial= new BABYLON.PBRMaterial("oilmaterial", scene); //创建pbr 二氧化碳管道材料
    oilmaterial.albedoColor=new BABYLON.Color3.Yellow(); // 反射颜色
    oilmaterial.metallic=0.5; // 金属
    oilmaterial.roughness=0.5; // 粗糙
    oilmaterial.alpha=0.3;
    pipe7.material = oilmaterial;
    pipe8.material = oilmaterial;
    pipe9.material = oilmaterial;
    pipe10.material = oilmaterial;
    pipe11.material = oilmaterial;
    //隔板材质
    let clapboard1=scene.getMeshById("Brep");
    let clapboard2=scene.getMeshById("Brep.091");
    let clapboard3=scene.getMeshById("Brep.092");
    let myclapboardMaterial=new BABYLON.PBRMaterial("myclapboardMaterial", scene);
    myclapboardMaterial.albedoColor=new BABYLON.Color3.White(); // 反射颜色
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
    door1.ifopen=0;
    door2.ifopen=0;
    door3.ifopen=0;
}
//flowing流动方案-粒子效果
let countnum=1;
function makeparticle(mesh,particleSystem,color1,color2,colorDead,minLifeTime=0.75,maxLifeTime=1){
    countnum++;
    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("/texture/flare.png", scene);
    // Where the particles come from
    particleSystem.emitter = mesh;//设置emitter发射器
    // Colors of all particles
    particleSystem.color1 = color1;
    particleSystem.color2 = color2;
    particleSystem.colorDead = colorDead;
    // Size of each particle (random between...
    particleSystem.minSize = 0.3;
    particleSystem.maxSize = 0.5;
    // Life time of each particle (random between...
    particleSystem.minLifeTime = minLifeTime;
    particleSystem.maxLifeTime = maxLifeTime;
    particleSystem.minEmitBox = new BABYLON.Vector3(0.08, 0.08, 0.08); //控制盒子
    particleSystem.maxEmitBox = new BABYLON.Vector3(-0.08, -0.08, -0.08);
    // Emission rate
    particleSystem.emitRate = 1000;
    // Speed
    particleSystem.minEmitPower = 0.1;
    particleSystem.maxEmitPower = 0.3;
    particleSystem.updateSpeed = 0.005;
}
const slide = function (dist,movdirection) { //after covering dist apply turn
    this.dist = dist;
    this.movdirection=movdirection;//正在沿movaxis移动
}
function moveparticle(track,mesh,x,y,z,time){
    setTimeout(function(){
        let distance = 0;
        let step = 2;
        let p = 0;
        scene.onBeforeRenderObservable.add(() => {
            if(track[p].movdirection==="left"){
                mesh.movePOV(-step, 0, 0);
            }
            if(track[p].movdirection==="right"){
                mesh.movePOV(step, 0, 0);
            }
            if(track[p].movdirection==="up"){
                mesh.movePOV(0, step, 0);
            }
            if(track[p].movdirection==="down"){
                mesh.movePOV(0, -step, 0);
            }
            if(track[p].movdirection==="front"){
                mesh.movePOV(0, 0, step);
            }
            if(track[p].movdirection==="behind"){
                mesh.movePOV(0, 0, -step);
            }

            distance += step;
            if (distance > track[p].dist) {
                // sphere.rotate(track044[p].rotaxis, track044[p].turn, BABYLON.Space.LOCAL);
                // particleSystem.gravity = track044[p].gravity;
                p +=1;
                p %= track.length;
                if (p === 0) {
                    distance = 0;
                    mesh.position = new BABYLON.Vector3(x, y, z); //reset to initial conditions
                    // sphere.rotation = BABYLON.Vector3.Zero();//prevents error accumulation
                }
            }
        });
    },time);

}
//发射器们：
let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:0.01, segments: 8}, scene);
// sphere.material = new BABYLON.StandardMaterial("mat", scene);
// sphere.material.wireframe = true;
sphere.position=new BABYLON.Vector3(51, 25, 91);
let sphere004cl1=sphere.clone("sphere004cl1");
sphere004cl1.position=new BABYLON.Vector3(51, 25, 91);
let sphere008=sphere.clone("sphere008");
sphere008.position=new BABYLON.Vector3(3.5, 27.8, 71.8);
let sphere008cl1=sphere008.clone("sphere008cl1");
let sphere049=sphere.clone("sphere008");
sphere049.position=new BABYLON.Vector3(-8, 9.57, 79.6);
let sphere049cl1=sphere049.clone("sphere049cl1");
let sphere053=sphere.clone("sphere053");
sphere053.position=new BABYLON.Vector3(25.3, 27.6, 61.4);
let sphere053cl1=sphere053.clone("sphere053cl1");
let sphere053cl2=sphere053.clone("sphere053cl2");
let sphere053cl3=sphere053.clone("sphere053cl3");
let sphere041=sphere.clone("sphere041");
sphere041.position=new BABYLON.Vector3(-71.05, 25.64, 35.54);
let sphere041cl1=sphere041.clone("sphere041cl1");
let sphere041cl2=sphere041.clone("sphere041cl2");
let sphere041cl3=sphere041.clone("sphere041cl3");
let sphere042=sphere.clone("sphere042");
sphere042.position=new BABYLON.Vector3(-81,161.5,41.4);
let sphere042cl1=sphere042.clone("sphere042cl1");
let sphere042cl2=sphere042.clone("sphere042cl2");
let sphere042cl3=sphere042.clone("sphere042cl3");
var sphere051=sphere.clone("sphere051");
sphere051.position=new BABYLON.Vector3(-96.67,100.2,-17.83);
var sphere051cl1=sphere051.clone("sphere051cl1");
var sphere051cl2=sphere051.clone("sphere051cl2");
var sphere051cl3=sphere051.clone("sphere051cl3");
var sphere020=sphere.clone("sphere020");
sphere020.position=new BABYLON.Vector3(-73.47,56.6,-39.93);
var sphere02152=sphere.clone("sphere02152");
sphere02152.position=new BABYLON.Vector3(-104.3,142.8,50.64);
var sphere02152cl1=sphere02152.clone("sphere02152cl1");
var sphere02152cl2=sphere02152.clone("sphere02152cl2");
var sphere02152cl3=sphere02152.clone("sphere02152cl3");
var sphere00552=sphere.clone("sphere00552");
sphere00552.position=new BABYLON.Vector3(-104.267,142.802,-48.2834);
var sphere00552cl1=sphere00552.clone("sphere00552cl1");
var sphere00552cl2=sphere00552.clone("sphere00552cl2");
var sphere00552cl3=sphere00552.clone("sphere00552cl3");
// let sphere053cl6=sphere053.clone("sphere053cl6");


const track044 = [];//管道Brep.044的轨迹
track044.push(new slide(5.8,"up"));  //first side length 6
track044.push(new slide(5.8+1,"front")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8+1+14.5,"right")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8+1+14.5+28,"front")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8+1+14.5+28+6,"right")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8+1+14.5+28+6+3.3,"down")); //最后一条
//all sides cover


//创建一个绿色的粒子系统
let particleSystem1=new BABYLON.ParticleSystem("particles1",10000,scene);//自动给每个粒子系统编号
makeparticle(sphere,particleSystem1,
    new BABYLON.Color4(0.04, 0.63, 0.02),
    new BABYLON.Color4(0.14, 0.74, 0.09),
    new BABYLON.Color4(0.13, 0.55, 0.13, 0.8));
moveparticle(track044,sphere,51, 25, 91, 0);

let particleSystem2=new BABYLON.ParticleSystem("particles2",10000,scene);//自动给每个粒子系统编号
//创建一个绿色的粒子系统
makeparticle(sphere004cl1,particleSystem2,
    new BABYLON.Color4(0.04, 0.63, 0.02),
    new BABYLON.Color4(0.14, 0.74, 0.09),
    new BABYLON.Color4(0.13, 0.55, 0.13, 0.8));
moveparticle(track044,sphere004cl1,51, 25, 91,7500);//间隔时间

const track008 = [];//管道Brep.008的轨迹
track008.push(new slide(3.4,"up"));  //first side length 6
track008.push(new slide(3.4+16.5,"behind")); //at finish of second side distance covered is 18+9
track008.push(new slide(3.4+16.5+0.2,"down")); //at finish of second side distance covered is 18+9
track008.push(new slide(3.4+16.5+0.2+27.1,"left")); //at finish of second side distance covered is 18+9
track008.push(new slide(3.4+16.5+0.2+27.1+18.3,"front")); //at finish of second side distance covered is 18+9
track008.push(new slide(3.4+16.5+0.2+27.1+18.3+3.5,"down")); //最后一条共70.3

let particleSystem3=new BABYLON.ParticleSystem(`particles3`,10000,scene);//自动给每个粒子系统编号
let particleSystem4=new BABYLON.ParticleSystem(`particles4`,10000,scene);//自动给每个粒子系统编号
//创建一个绿色的粒子系统
makeparticle(sphere008,particleSystem3,
    new BABYLON.Color4(0.17, 0.97, 0.02),
    new BABYLON.Color4(0.6, 0.93, 0.57),
    new BABYLON.Color4(0, 0.2, 0, 0.8));
moveparticle(track008,sphere008,3.5, 27.8, 71.8,0);
makeparticle(sphere008cl1,particleSystem4,
    new BABYLON.Color4(0.17, 0.97, 0.02),
    new BABYLON.Color4(0.6, 0.93, 0.57),
    new BABYLON.Color4(0, 0.2, 0, 0.8));
moveparticle(track008,sphere008cl1,3.5, 27.8, 71.8,8000);
const track049 = [];//管道Brep.049的轨迹
track049.push(new slide(4.3,"right"));  //first side length 6
track049.push(new slide(4.3+22,"up")); //at finish of second side distance covered is 18+9
track049.push(new slide(4.3+22+10.2,"behind")); //at finish of second side distance covered is 18+9
// track049.push(new slide(4.3+22+10.2+0,"down")); //at finish of second side distance covered is 18+9
track049.push(new slide(4.3+22+10.2+0+46,"left")); //at finish of second side distance covered is 18+9
track049.push(new slide(4.3+22+10.2+0+46+23.3,"front"));
track049.push(new slide(4.3+22+10.2+0+46+23.3+2.5,"right"));
track049.push(new slide(4.3+22+10.2+0+46+23.3+2.5+3.5,"down")); //最后一条共70.3

let particleSystem5=new BABYLON.ParticleSystem(`particles5`,10000,scene);
let particleSystem6=new BABYLON.ParticleSystem(`particles6`,10000,scene);
//创建一个紫色的粒子系统
makeparticle(sphere049,particleSystem5,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track049,sphere049,-8, 9.57, 79.6,0);
makeparticle(sphere049cl1,particleSystem6,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track049,sphere049cl1,-8, 9.57, 79.6,6000);

const track053 = [];//管道Brep.053的轨迹
track053.push(new slide(3.5,"up"));  //first side length 6
track053.push(new slide(3.5+20,"front")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5+20+158.8,"right")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5+20+158.8+41,"front")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5+20+158.8+41+104.2,"up")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5+20+158.8+41+104.2+17.4,"left"));
track053.push(new slide(3.5+20+158.8+41+104.2+17.4+9.6,"down"));
track053.push(new slide(3.5+20+158.8+41+104.2+17.4+9.6+20.9,"left"));
track053.push(new slide(3.5+20+158.8+41+104.2+17.4+9.6+20.9+4.3,"up")); //最后一条 共59.3
let particleSystem7=new BABYLON.ParticleSystem(`particles7`,10000,scene);
let particleSystem8=new BABYLON.ParticleSystem(`particles8`,10000,scene);
let particleSystem9=new BABYLON.ParticleSystem(`particles9`,10000,scene);
let particleSystem10=new BABYLON.ParticleSystem(`particles10`,10000,scene);

//创建一个紫色的粒子系统
makeparticle(sphere053,particleSystem7,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track053,sphere053,25.3, 27.6, 61.4,1000);
makeparticle(sphere053cl1,particleSystem8,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track053,sphere053cl1,25.3, 27.6, 61.4,6000);
makeparticle(sphere053cl2,particleSystem9,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track053,sphere053cl2,25.3, 27.6, 61.4,12000);
makeparticle(sphere053cl3,particleSystem10,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track053,sphere053cl3,25.3, 27.6, 61.4,18000);

const track041 = [];//管道Brep.041的轨迹
track041.push(new slide(81.06,"up"));  //first side length 6
track041.push(new slide(81.06+73.94,"front")); //at finish of second side distance covered is 18+9
track041.push(new slide(81.06+73.94+54.7,"up")); //at finish of second side distance covered is 18+9
track041.push(new slide(81.06+73.94+54.7+12.6,"right")); //at finish of second side distance covered is 18+9
var particleSystem11=new BABYLON.ParticleSystem(`particles11`,10000,scene);
var particleSystem12=new BABYLON.ParticleSystem(`particles12`,10000,scene);
var particleSystem13=new BABYLON.ParticleSystem(`particles13`,10000,scene);
var particleSystem14=new BABYLON.ParticleSystem(`particles14`,10000,scene);
//创建一个蓝色的粒子系统
makeparticle(sphere041,particleSystem11,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track041,sphere041,-71.1, 25.64, 35.54,1000);
makeparticle(sphere041cl1,particleSystem12,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track041,sphere041cl1,-71.1, 25.64, 35.54,6000);
makeparticle(sphere041cl2,particleSystem13,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track041,sphere041cl2,-71.1, 25.64, 35.54,12000);
makeparticle(sphere041cl3,particleSystem14,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track041,sphere041cl3,-71.1, 25.64, 35.54,18000);

const track042 = [];//管道Brep.042的轨迹
track042.push(new slide(7,"left"));  //first side length 6
track042.push(new slide(7+56.9,"down")); //at finish of second side distance covered is 18+9
track042.push(new slide(7+56.9+30.9,"front")); //at finish of second side distance covered is 18+9
track042.push(new slide(7+56.9+30.9+38.4,"right")); //at finish of second side distance covered is 18+9
track042.push(new slide(7+56.9+30.9+38.4+72.98,"down")); //at finish of second side distance covered is 18+9
var particleSystem15=new BABYLON.ParticleSystem(`particles15`,10000,scene);
var particleSystem16=new BABYLON.ParticleSystem(`particles16`,10000,scene);
var particleSystem17=new BABYLON.ParticleSystem(`particles17`,10000,scene);
var particleSystem18=new BABYLON.ParticleSystem(`particles18`,10000,scene);
//创建一个蓝色的粒子系统
makeparticle(sphere042,particleSystem15,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track042,sphere042,-81,161.5,41.4,1000);
makeparticle(sphere042cl1,particleSystem16,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track042,sphere042cl1,-81,161.5,41.4,6000);
makeparticle(sphere042cl2,particleSystem17,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track042,sphere042cl2,-81,161.5,41.4,12000);
makeparticle(sphere042cl3,particleSystem18,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track042,sphere042cl3,-81,161.5,41.4,18000);

const track051 = [];//管道Brep.051的轨迹
track051.push(new slide(7.8,"down"));  //first side length 6
track051.push(new slide(7.8+28.6,"front")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8+28.6+32.22,"left")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8+28.6+32.22+68.5,"down")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8+28.6+32.22+68.5+13.26,"behind")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8+28.6+32.22+68.5+13.26+7.95,"right")); //at finish of second side distance covered is 18+9
track051.push(new slide(7.8+28.6+32.22+68.5+13.26+7.95+2.28,"down")); //at finish of second side distance covered is 18+9
var particleSystem19=new BABYLON.ParticleSystem(`particles19`,10000,scene);
var particleSystem20=new BABYLON.ParticleSystem(`particles20`,10000,scene);
var particleSystem21=new BABYLON.ParticleSystem(`particles21`,10000,scene);
var particleSystem22=new BABYLON.ParticleSystem(`particles22`,10000,scene);
    //创建一个黄色的粒子系统
makeparticle(sphere051,particleSystem19,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track051,sphere051,-96.67,100.2,-17.83,1000);
makeparticle(sphere051cl1,particleSystem20,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track051,sphere051cl1,-96.67,100.2,-17.83,6000);
makeparticle(sphere051cl2,particleSystem21,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track051,sphere051cl2,-96.67,100.2,-17.83,12000);
makeparticle(sphere051cl3,particleSystem22,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track051,sphere051cl3,-96.67,100.2,-17.83,18000);

const track020 = [];//管道Brep.020的轨迹
track020.push(new slide(6.67,"behind"));  //first side length 6
track020.push(new slide(6.67+9,"left")); //at finish of second side distance covered is 18+9
track020.push(new slide(6.67+9+13.3,"front")); //at finish of second side distance covered is 18+9
var particleSystem23=new BABYLON.ParticleSystem(`particles23`,10000,scene);
    //创建一个黄色的粒子系统
makeparticle(sphere020,particleSystem23,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44),0.5,1);
moveparticle(track020,sphere020,-73.47,56.6,-39.93,1000);

const track02152 = [];//管道Brep.021+Brep.052的轨迹
track02152.push(new slide(4.24,"behind"));  //first side length 6
track02152.push(new slide(4.24+35.5,"down")); //at finish of second side distance covered is 18+9
track02152.push(new slide(4.24+35.5+110.5,"front")); //at finish of second side distance covered is 18+9
track02152.push(new slide(4.24+35.5+110.5+40,"left")); //at finish of second side distance covered is 18+9
track02152.push(new slide(4.24+35.5+110.5+40+83.23,"down")); //at finish of second side distance covered is 18+9
track02152.push(new slide(4.24+35.5+110.5+40+83.23+1,"left")); //at finish of second side distance covered is 18+9
track02152.push(new slide(4.24+35.5+110.5+40+83.23+1+25.6,"behind")); //at finish of second side distance covered is 18+9
track02152.push(new slide(4.24+35.5+110.5+40+83.23+1+25.6+8.8,"right")); //at finish of second side distance covered is 18+9
track02152.push(new slide(4.24+35.5+110.5+40+83.23+1+25.6+8.8+2.2,"down")); //at finish of second side distance covered is 18+9
var particleSystem24=new BABYLON.ParticleSystem(`particles24`,10000,scene);
var particleSystem25=new BABYLON.ParticleSystem(`particles25`,10000,scene);
var particleSystem26=new BABYLON.ParticleSystem(`particles26`,10000,scene);
var particleSystem27=new BABYLON.ParticleSystem(`particles27`,10000,scene);
    //创建一个黄色的粒子系统
makeparticle(sphere02152,particleSystem24,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track02152,sphere02152,-104.3,142.8,50.64,1000);
makeparticle(sphere02152cl1,particleSystem25,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track02152,sphere02152cl1,-104.3,142.8,50.64,6000);
makeparticle(sphere02152cl2,particleSystem26,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track02152,sphere02152cl2,-104.3,142.8,50.64,12000);
makeparticle(sphere02152cl3,particleSystem27,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track02152,sphere02152cl3,-104.3,142.8,50.64,18000);

const track00552 = [];//管道Brep.021+Brep.052的轨迹
track00552.push(new slide(7.3,"front"));  //first side length 6
track00552.push(new slide(7.3+35.5,"down")); //at finish of second side distance covered is 18+9
track00552.push(new slide(7.3+35.5+40,"left")); //at finish of second side distance covered is 18+9
track00552.push(new slide(7.3+35.5+40+83.23,"down")); //at finish of second side distance covered is 18+9
track00552.push(new slide(7.3+35.5+40+83.23+1,"left")); //at finish of second side distance covered is 18+9
track00552.push(new slide(7.3+35.5+40+83.23+1+25.6,"behind")); //at finish of second side distance covered is 18+9
track00552.push(new slide(7.3+35.5+40+83.23+1+25.6+8.8,"right")); //at finish of second side distance covered is 18+9
track00552.push(new slide(7.3+35.5+40+83.23+1+25.6+8.8+2.2,"down")); //at finish of second side distance covered is 18+9
var particleSystem28=new BABYLON.ParticleSystem(`particles28`,10000,scene);
var particleSystem29=new BABYLON.ParticleSystem(`particles29`,10000,scene);
var particleSystem30=new BABYLON.ParticleSystem(`particles30`,10000,scene);
var particleSystem31=new BABYLON.ParticleSystem(`particles31`,10000,scene);
    //创建一个黄色的粒子系统
makeparticle(sphere00552,particleSystem28,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track00552,sphere00552,-104.267,142.802,-48.2834,1000);
makeparticle(sphere00552cl1,particleSystem29,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track00552,sphere00552cl1,-104.267,142.802,-48.2834,6000);
makeparticle(sphere00552cl2,particleSystem30,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track00552,sphere00552cl2,-104.267,142.802,-48.2834,12000);
makeparticle(sphere00552cl3,particleSystem31,
    new BABYLON.Color4(0.85, 1, 0),
    new BABYLON.Color4(0.77, 0.89, 0.11),
    new BABYLON.Color4(0.81, 0.85, 0.44));
moveparticle(track00552,sphere00552cl3,-104.267,142.802,-48.2834,18000);


function particlestart(){
    particleSystem1.start();//Brep044
    // particleSystem2.start();
    particleSystem3.start();//Brep008
    // particleSystem4.start();
    particleSystem5.start();//Brep049
    // particleSystem6.start();
    particleSystem7.start();//Brep053
    particleSystem8.start();
    particleSystem9.start();
    particleSystem10.start();
    particleSystem11.start();//Brep041
    particleSystem12.start();
    particleSystem13.start();
    particleSystem14.start();
    particleSystem15.start();//Brep042
    particleSystem16.start();
    particleSystem17.start();
    particleSystem18.start();
    particleSystem19.start();//Brep051
    particleSystem20.start();
    particleSystem21.start();
    particleSystem22.start();
    particleSystem23.start();//Brep020
    particleSystem24.start();//Brep02152
    particleSystem25.start();
    particleSystem26.start();
    particleSystem27.start();
    particleSystem28.start();//Brep00552
    particleSystem29.start();
    particleSystem30.start();
    particleSystem31.start();
}
function opendoor(mesh,labelName){//开门/关门
    if((labelName=="Mesh.633")||(labelName=="Mesh.1898")||(labelName=="Mesh.2971")){
        console.log("mesh.ifopen",labelName,mesh.ifopen)
        if(mesh.ifopen==0){
            mesh.rotate(BABYLON.Axis.Y,-Math.PI*3/4,BABYLON.Space.LOCAL);
            mesh.ifopen=1;
        }
        else{
            mesh.rotate(BABYLON.Axis.Y,Math.PI*3/4,BABYLON.Space.LOCAL);
            mesh.ifopen=0;
        }
        
    }
    
    // selectMesh.setPivotPoint(new BABYLON.Vector3(-6, 0, 0));
    
}
function alphachange(mesh,labelName){//楼板透明度改变
    if((labelName=="Brep")||labelName=="Brep.091"||(labelName=="Brep.092")){
        let myclapboardMaterial=new BABYLON.PBRMaterial("myclapboardMaterial", scene);
        myclapboardMaterial.albedoColor=new BABYLON.Color3.White(); // 反射颜色
        myclapboardMaterial.metallic=0.2 // 金属
        myclapboardMaterial.roughness=0.8 // 粗糙
        if(mesh.alpha==1){
            myclapboardMaterial.alpha=0.3;
            mesh.material = myclapboardMaterial;
            mesh.alpha=0.3;
        }
        else{
            myclapboardMaterial.alpha=1;
            mesh.material = myclapboardMaterial;
            mesh.alpha=1;
        }
        
    }
}
BABYLON.SceneLoader.ImportMesh(
    "",
    "model/",
    "modelv10d.glb",
    scene,
    function (Meshes) {
        console.log("Meshes:",Meshes)
        changematerial();
        particlestart();
        let importedMesh = Meshes[0];
        // console.log(Meshes);
        importedMesh.getChildren().forEach(function (mesh){
            //仅为json文件中存在的设备绑定事件
            if(getJson(mesh.id) !== '暂无设备信息'){
                childMesh.push(mesh);
                mesh.actionManager = actionManager;
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
    });

let inputManager = new BABYLON.ArcRotateCameraInputsManager(camera);
inputManager.addMouseWheel();
inputManager.addPointers();

camera.inputs = inputManager;

//鼠标按下时取消绑定事件,防止卡顿
scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
        case BABYLON.PointerEventTypes.POINTERWHEEL:
            childMesh.forEach(function (mesh){
                if(!mesh.actionManager)
                    return
                mesh.actionManager = null;
            })
            break;
        case BABYLON.PointerEventTypes.POINTERUP:
            camera.inputs.clear();
            camera.inputs = inputManager;
            childMesh.forEach(function (mesh){
                if(mesh.actionManager)
                    return
                mesh.actionManager = actionManager;
            })
            break;
        case BABYLON.PointerEventTypes.POINTERPICK:
            childMesh.forEach(function (mesh){
                if(mesh.actionManager)
                    return
                mesh.actionManager = actionManager;
            })
            break;
    }
});

//报警设备Map,便于图标跟随
let warningModels = new Map();

export function createWarningMessage(modelID,url){
    let warningModel = scene.getMeshById(modelID);

    //生成报警图标
    let bellElement = document.getElementById("bell")
    let clonedIcon = bellElement.cloneNode(true);
    //标签id为模型id
    clonedIcon.id = modelID;
    bellElement.parentNode.appendChild(clonedIcon);

    //设置报警的必要样式
    clonedIcon.style.display = 'block';
    clonedIcon.style.position = 'absolute';
    clonedIcon.style.zIndex = 2;

    //报警图标对应模型
    warningModels.set(clonedIcon, warningModel)

    //取消默认点击事件
    let inputElement = clonedIcon.querySelector("input");
    inputElement.addEventListener("click", function(event){
        event.preventDefault();
    });
    inputElement.addEventListener("click", function(){
        // createWarningLabel(modelID,warningModel);
        window.open(url,"_blank")
    });
    clonedIcon.addEventListener("mouseover", function (){
        //createLabel();
    });
    
    setWarningPosition(warningModels);
}

export function deleteWarningMessage(modelID){
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
function setWarningPosition(warningModels){
    warningModels.forEach(function (value, key){
        if(!value){
            return;
        }
        setInterval(()=>{
            setUiPosition(key,value,0,0,false);
        },100);
    });
}

export function searchModel(modelID){
    removeLabel(rmLabelBuild);
    for(let mesh of childMesh){
        if(mesh.id === modelID){
            highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
            models.push(mesh);
            camera.position.x = mesh.position.x;
            camera.position.y = 30;
            camera.position.z = -45;
            camera.setTarget(mesh.getAbsolutePosition());
            // camera.radius = 50;
            console.log(modelID);
            return;
        }
    }
    alert("未查找到指定设备");
}

function setUiPosition(element, model, topOffset, leftOffset, isLabel){
    let modelPosition = model.getAbsolutePosition();
    const transformMatrix = BABYLON.Matrix.Identity();
    transformMatrix.multiply(worldMatrix);
    let screenPosition = BABYLON.Vector3.Project(modelPosition, transformMatrix, scene.getTransformMatrix(), viewport);

    if(isLabel){
        let top,left;
        if(screenPosition.y * 100 - topOffset < 0){
            top = 0;
        }else if(screenPosition.y * 100 - topOffset > 40){
            top = 40;
        }else {
            top = screenPosition.y * 100 - topOffset;
        }
        if(screenPosition.x * 100 - leftOffset < 25){
            left = 25;
        }else if(screenPosition.x * 100 - leftOffset > 55){
            left = 55;
        }else {
            left = screenPosition.x * 100 - leftOffset;
        }
        element.style.top = top + "%"
        element.style.left = left + "%"
    }else {
        element.style.top = screenPosition.y * 100 - topOffset + "%"
        element.style.left = screenPosition.x * 100 - leftOffset + "%"
    }
}


scene.registerBeforeRender(function(){

    // setWarningPosition(warningModels);
    //
    // //计算帧率
    // let fps = engine.getFps().toFixed();
    //
    // let fpsDisplay = document.getElementById("fpsDisplay");
    // fpsDisplay.innerHTML = "FPS:" + fps;
})

//渲染场景
engine.runRenderLoop(() => {
    scene.render();
    // console.log(camera.position);
})

//监听窗口大小改变
window.addEventListener("resize",() => {
    engine.resize();
});
