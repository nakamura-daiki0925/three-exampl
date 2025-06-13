import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { Sky } from 'three/addons/objects/Sky.js';




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

// === 黄色ボックス ===
const boxGeo = new THREE.BoxGeometry(20, 20, 20);
const boxMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
const box = new THREE.Mesh(boxGeo, boxMat);
box.position.set(30, 10, 0); // Y=10で床の上に置く
scene.add(box);
objects.push(box);

// === 円錐 ===
const coneGeo = new THREE.ConeGeometry(5, 20, 32);
const coneMat = new THREE.MeshStandardMaterial({ color: 0x228833 });
const cone = new THREE.Mesh(coneGeo, coneMat);
cone.position.set(-30, 10, 0);
scene.add(cone);
objects.push(cone);

// === 地面 ===
const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// ===空設定===
const sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );

const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 14; //空の霞み
skyUniforms['rayleigh'].value = 0.5; //レイリー散乱

const sun = new THREE.Vector3();
const phi = THREE.MathUtils.degToRad(9); // 高度
const theta = THREE.MathUtils.degToRad(0); // 方角
sun.setFromSphericalCoords(1, phi, theta);
skyUniforms['sunPosition'].value.copy(sun);

// === ライトと補助表示 ===
scene.add(new THREE.DirectionalLight(0xffffff, 1));
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
scene.add(new THREE.AxesHelper(50));
scene.add(new THREE.GridHelper(200, 20));

// === カメラ操作
orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minPolarAngle = 0;               // 上にどこまで行けるか
orbitControls.maxPolarAngle = Math.PI * 0.48; // 約86度（制限ぎりぎり）


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
  const intersects = raycaster.intersectObjects(objects); 

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
function hideRadialMenu() {
  const buttons = document.getElementById("radial-buttons")?.children || [];
  [...buttons].forEach((btn) => (btn.style.display = "none"));
}

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
  dragControls.objects = []; 
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
