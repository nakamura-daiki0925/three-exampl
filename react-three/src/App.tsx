import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { DragControls, OrbitControls } from 'three/examples/jsm/Addons.js';

export const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const Width = mount.clientWidth;
    const Height = mount.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const camera = new THREE.PerspectiveCamera(50, Width/Height, 0.1, 1000);
    camera.position.set(0, 20, 30);
    

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
    renderer.setSize(Width, Height);
    renderer.setClearColor(0x222222);
    mount.appendChild(renderer.domElement);
    
    // 地球メッシュ
    const loader = new THREE.TextureLoader();
    const earthTex = loader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 16),
      new THREE.MeshStandardMaterial({ map: earthTex })
    );
    earth.position.y = 10;
    camera.lookAt(earth.position);
    scene.add(earth);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    scene.add(directionalLight);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(2000, 20);
    scene.add(gridHelper);

    const orbitControls = new OrbitControls(camera,renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minPolarAngle = 0;
    orbitControls.maxPolarAngle = Math.PI * 0.48;


    const draggable: THREE.Object3D[] = [earth];
    const dragControls = new DragControls(draggable,camera,renderer.domElement);

    dragControls.addEventListener('dragstart',() => orbitControls.enabled = false)
    dragControls.addEventListener('drag',() => orbitControls.enabled = false)
    dragControls.addEventListener('dragend',() => orbitControls.enabled = true)


    const animate =()=> {
      earth.rotation.x += 0.01;
      requestAnimationFrame(animate);
      orbitControls.update();
      renderer.render(scene, camera);
    }
    animate();
    
    return () => {
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      earth.geometry.dispose();
      (earth.material as THREE.Material).dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};