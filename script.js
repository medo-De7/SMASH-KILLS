import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();

const controls = new PointerLockControls(camera, document.body);

// تفعيل قفل الماوس عند الضغط على الشاشة
document.addEventListener('click', () => {
    controls.lock();
});

scene.add(controls.getObject()); // إضافة الكاميرا للمشهد

window.addEventListener('mousedown', () => {
    const bulletData = {
        position: camera.position,
        direction: camera.getWorldDirection(new THREE.Vector3()),
        type: 'Pistol' // هنا نحدد نوع السلاح
    };
    socket.emit('shoot', bulletData);
});