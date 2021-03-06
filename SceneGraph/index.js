import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';


function main() {
    const canvas = document.getElementById('c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const gui = new GUI();

    // 카메라 세팅
    const cameraSetting = {
        fov: 40,
        aspect: 2,
        near: 0.1,
        far: 1000,
    };

    // 카메라 객체 생성
    const camera = new THREE.PerspectiveCamera(
        cameraSetting.fov,
        cameraSetting.aspect,
        cameraSetting.near,
        cameraSetting.far
    );
    camera.position.set(0, 150, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    // Scene 객체 생성
    const scene = new THREE.Scene();

    // 광원 추가
    {
        const color = 0xffffff;
        const intensity = 3;
        const light = new THREE.PointLight(color, intensity);
        scene.add(light);
    }

    // 회전 값을 업데이트 할 객체들
    const objects = [];

    // 하나의 geometry로 모든 태양, 지구 , 달을 생성.
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;

    // 원 geometry 생성 - 기하학
    const sphereGeometry = new THREE.SphereBufferGeometry(
        radius,
        widthSegments,
        heightSegments
    );

    // 태양계라는 빈 Object3D 객체 생성
    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    objects.push(solarSystem);

    // 태양 객체
    /**
     * MeshPhongMaterial의 emissive(방사성) 속성(property)을 노랑으로 지정합니다. 퐁-메터리얼의
     * emissive 속성은 빛을 반사하지 않는 표면 색상으로, 대신 광원에 해당 색상이 더해집니다.
     */
    const sunMaterial = new THREE.MeshPhongMaterial({
        emissive: 0xffff00,
    });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // 태양의 크기를 키움. 지역 공간 자체를 5배 키움. 지구도 5배가 됨..
    // scene.add(sunMesh);
    solarSystem.add(sunMesh);
    objects.push(sunMesh);

    // 지구 궤도 (지구계?)
    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);

    // 지구 객체
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233ff,
        emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.position.x = 10;
    // scene.add(earthMesh);
    // sunMesh.add(earthMesh);
    solarSystem.add(earthMesh);
    objects.push(earthMesh);

    // 달 궤도
    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    // 달 객체
    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);

    class AxisGridHelper {
        constructor(node, units = 10) {
            const axes = new THREE.AxesHelper();
            axes.material.depthTest = false;
            axes.renderOrder = 2; // after the grid
            node.add(axes);

            const grid = new THREE.GridHelper(units, units);
            grid.material.depthTest = false;
            grid.renderOrder = 1;
            node.add(grid);

            this.grid = grid;
            this.axes = axes;
            this.visible = false;
        }
        get visible() {
            return this._visible;
        }
        set visible(v) {
            this._visible = v;
            this.grid.visible = v;
            this.axes.visible = v;
        }
    }

    function makeAxisGrid(node, label, units) {
        const helper = new AxisGridHelper(node, units);
        gui.add(helper, 'visible').name(label);
    }

    makeAxisGrid(solarSystem, 'solarSystem', 26);
    makeAxisGrid(sunMesh, 'sunMesh');
    makeAxisGrid(earthOrbit, 'earthOrbit');
    makeAxisGrid(earthMesh, 'earthMesh');
    makeAxisGrid(moonOrbit, 'moonOrbit');
    makeAxisGrid(moonMesh, 'moonMesh');

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        objects.forEach((obj) => {
            obj.rotation.y = time;
        });
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();