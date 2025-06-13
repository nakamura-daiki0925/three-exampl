import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";

// let scene, camera, renderer, orbitControls, dragControls;
// let objects = [];
// let selected = null;

// // シーン作成
// scene = new THREE.Scene();

// // カメラ作成
// camera = new THREE.PerspectiveCamera(
//   50,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// camera.position.set(10, 10, 200);

// // レンダラー作成
// renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // 地球儀テクスチャとメッシュ作成
// const texture = new THREE.TextureLoader().load("./textures/earth.jpg");
// const geometry = new THREE.SphereGeometry(10, 64, 32);
// const material = new THREE.MeshPhysicalMaterial({ map: texture });

// const ballMesh = new THREE.Mesh(geometry, material);
// ballMesh.position.set(0, 0.5, 0); // Y = 0.5 固定
// scene.add(ballMesh);
// objects.push(ballMesh);

// // ライト
// const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
// scene.add(directionalLight);

// // 軸とグリッドヘルパー
// const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper);

// const gridHelper = new THREE.GridHelper(1000, 20);
// scene.add(gridHelper);

// // OrbitControls（カメラ操作）
// orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.enableDamping = true;


// // DragControls（オブジェクト操作）
// dragControls = new DragControls(objects, camera, renderer.domElement);

// // Raycaster 用意
// const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // XZ 平面（Y=0）
// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// // マウス位置を取得
// window.addEventListener("mousemove", (event) => {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// });

// window.addEventListener("click", (event) => {
//   const mouse = new THREE.Vector2(
//     (event.clientX / window.innerWidth) * 2 - 1,
//     -(event.clientY / window.innerHeight) * 2 + 1
//   );

//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObject(ballMesh);


//   console.log("交差数:", intersects.length); // ← デバッグ追加


//   if (intersects.length > 0) {
//     console.log("🟢 クリック成功！ボタン表示へ");
//     showRadialMenu(ballMesh.position);
//   } else {
//     console.log("⚪️ ヒットしなかった");
//     hideRadialMenu();
//   }
  
// });

// function showRadialMenu(position3D) {
//   const vector = position3D.clone().project(camera);

//   const screenX = (vector.x + 1) / 2 * window.innerWidth;
//   const screenY = (-vector.y + 1) / 2 * window.innerHeight;

//   console.log('📍screenX:', screenX, 'screenY:', screenY);

//   const centerX = screenX;
//   const centerY = screenY;

//   const radius = 60;
//   const icons = radialButtons.children;

//   icons.forEach((button, i) => {
//     const angle = (i / icons.length) * Math.PI * 2;
//     const x = centerX + radius * Math.cos(angle);
//     const y = centerY + radius * Math.sin(angle);
//     button.style.left = `${x}px`;
//     button.style.top = `${y}px`;
//     button.style.display = "block";
//   });
// }
// function hideRadialMenu() {
//   radialButtons.children.forEach((btn) => (btn.style.display = "none"));
// }

// const radialButtons = document.getElementById('radial-buttons');
// console.log('✅ radialButtons:', radialButtons); // nullならNG
// console.log('✅ 子要素数:', radialButtons?.children?.length);



// // ドラッグ開始 → カメラ操作無効化
// dragControls.addEventListener("dragstart", (event) => {
//   selected = event.object;
//   orbitControls.enabled = false;
// });

// // ドラッグ中 → 平面と交差する位置にスナップ
// dragControls.addEventListener("drag", () => {
//   raycaster.setFromCamera(mouse, camera);
//   const intersectPoint = new THREE.Vector3();
//   const hit = raycaster.ray.intersectPlane(plane, intersectPoint);

//   if (hit && selected) {
//     selected.position.x = intersectPoint.x;
//     selected.position.z = intersectPoint.z;
//     selected.position.y = 0.5; // Yは固定

//     console.log(
//       `🌍 地球儀位置: x=${selected.position.x.toFixed(2)}, z=${selected.position.z.toFixed(2)}`
//     );
//   }
// });



// // ドラッグ終了 → カメラ操作再開
// dragControls.addEventListener("dragend", () => {
//   selected = null;
//   orbitControls.enabled = true;
// });

// // レンダリングループ
// function animate() {
//   requestAnimationFrame(animate);
//   orbitControls.update();
//   renderer.render(scene, camera);
// }
// animate();


// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { DragControls } from "three/examples/jsm/controls/DragControls.js";

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { DragControls } from "three/examples/jsm/controls/DragControls.js";

let scene, camera, renderer, orbitControls, dragControls;
let selected = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const objects = [];

let isSelected = false;

// === シーン構築 ===
scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 20, 60);

renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === 地球儀 ===
const texture = new THREE.TextureLoader().load("./textures/earth.jpg");
const geometry = new THREE.SphereGeometry(10, 64, 32);
const material = new THREE.MeshStandardMaterial({ map: texture });
const ballMesh = new THREE.Mesh(geometry, material);
ballMesh.position.set(0, 10, 0);
scene.add(ballMesh);
objects.push(ballMesh);


const boxGeo = new THREE.BoxGeometry(20, 20, 20);
const boxMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
const box = new THREE.Mesh(boxGeo, boxMat);
box.position.set(30, 10, 0); // Y=10で床の上に置く
scene.add(box);
objects.push(box);

const coneGeo = new THREE.ConeGeometry(5, 20, 32);
const coneMat = new THREE.MeshStandardMaterial({ color: 0x228833 });
const cone = new THREE.Mesh(coneGeo, coneMat);
cone.position.set(-30, 10, 0);
scene.add(cone);
objects.push(cone);

const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);



// === ライトと補助表示 ===
scene.add(new THREE.DirectionalLight(0xffffff, 1));
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
scene.add(new THREE.AxesHelper(50));
scene.add(new THREE.GridHelper(200, 20));

// === カメラ操作
orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minPolarAngle = 0;               // 上にどこまで行けるか（0 = 天頂）
orbitControls.maxPolarAngle = Math.PI * 0.48; // 約86度（制限ぎりぎり）
     // 下にどこまで行けるか（π/2 = 水平まで）


// === ドラッグ制御（最初は空）
dragControls = new DragControls([], camera, renderer.domElement);

// === 平面
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

// === マウス位置追跡
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// === クリック時の選択制御
window.addEventListener("click", (event) => {
  const clickMouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(clickMouse, camera);
  const intersects = raycaster.intersectObjects(objects); // ✅ ここが重要！

  if (intersects.length > 0) {
    selected = intersects[0].object;
    isSelected = true;
    dragControls.objects = [selected];
    showRadialMenu(selected.position);
  } else {
    selected = null;
    isSelected = false;
    dragControls.objects = [];
    hideRadialMenu();
  }
});

// === ドラッグイベント
dragControls.addEventListener("dragstart", () => {
  orbitControls.enabled = false;
  hideRadialMenu();
});

dragControls.addEventListener("drag", () => {
  raycaster.setFromCamera(mouse, camera);
  const intersectPoint = new THREE.Vector3();
  const hit = raycaster.ray.intersectPlane(plane, intersectPoint);
  if (hit && selected) {
    selected.position.x = intersectPoint.x;
    selected.position.z = intersectPoint.z;
    selected.position.y = 10;
  }
  
});

dragControls.addEventListener("dragend", () => {
  orbitControls.enabled = true;
  dragControls.objects = []; // ドラッグ無効化
  isSelected = false;
});

// === radial menu 表示
function showRadialMenu(position3D) {
  const radialButtons = document.getElementById("radial-buttons");
  if (!radialButtons) return;

  const vector = position3D.clone().project(camera);
  const centerX = (vector.x + 1) / 2 * window.innerWidth;
  const centerY = (-vector.y + 1) / 2 * window.innerHeight;
  const radius = 60;
  const buttons = radialButtons.children;

  [...buttons].forEach((button, i) => {
    const angle = (i / buttons.length) * Math.PI * 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.display = "block";
  });
}

function hideRadialMenu() {
  const buttons = document.getElementById("radial-buttons")?.children || [];
  [...buttons].forEach((btn) => (btn.style.display = "none"));
}

// === ウィンドウリサイズ対応
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === アニメーション
function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
}
animate();
