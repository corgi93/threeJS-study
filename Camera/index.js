import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
    }
    get min() {
        return this.obj[this.minProp];
    }
    set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
        return this.obj[this.maxProp];
    }
    set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min; // this will call the min setter
    }
}

function main() {
    const canvas = document.querySelector('#c');
    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const scene = new THREE.Scene();

    const cameraSetting = {
        fov: 45, // 시야각 40도
        aspect: 2,
        near: 0.1,
        far: 100,
    };
    // 카메라 객체 생성
    // PerspectiveCamera(원근카메라) 세팅
    const camera = new THREE.PerspectiveCamera(
        cameraSetting.fov,
        cameraSetting.aspect,
        cameraSetting.near,
        cameraSetting.far
    );
    const cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper);


    camera.position.set(0, 10, 20);

    const camera2 = new THREE.PerspectiveCamera(
        60, // 시야각(fov)
        2, // 비율(aspect)
        0.1, // near
        500, // far
    )
    camera2.position.set(40, 10, 30);
    camera2.lookAt(0, 5, 0);

    function updateCamera() {
        camera.updateProjectionMatrix();
    }

    const gui = new GUI();
    // gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
    gui.add(camera, 'fov', 1, 180);

    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    // gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    // gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');
    const controls = new OrbitControls(camera, view1Elem);
    controls.target.set(0, 5, 0);
    controls.update();


    // camera2에 대한 control
    const controls2 = new OrbitControls(camera2, view2Elem);
    controls2.target.set(0, 5, 0);
    controls2.update();



    scene.background = new THREE.Color('black'); {
        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
    } {
        const cubeSize = 4;
        const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
        const mesh = new THREE.Mesh(cubeGeo, cubeMat);
        mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
        scene.add(mesh);
    } {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
        scene.add(mesh);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }

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

    // Three.js의 가위함수로 화면 자르기
    function setScissorForElement(elem) {
        const canvasRect = canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();

        // canvas에 대응하는 사각형을 구하기
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);

        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);

        // canvas의 일부분만 렌더링하도록 scissor 적용
        const positiveYUpBottom = canvasRect.height - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);

        //  비율 반환 (return the aspect)
        return width / height;
    }

    function render() {

        resizeRendererToDisplaySize(renderer);

        // 가위 활성화
        renderer.setScissorTest(true);

        // 기존 화면 렌더링
        {
            const aspect = setScissorForElement(view1Elem);

            // 비율에 따라 카메라 조정
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            cameraHelper.update();

            // 기존 화면에서 가이드라인(CameraHelper)이 노출되지 않도록 설정
            cameraHelper.visible = false;

            scene.background.set(0x000000);

            // 렌더링
            renderer.render(scene, camera);
        }

        // 두 번째 카메라 렌더링
        {
            const aspect = setScissorForElement(view2Elem);

            // 비율에 따라 카메라 조정
            camera2.aspect = aspect;
            camera2.updateProjectionMatrix();

            // 가이드라인 활성화
            cameraHelper.visible = true;

            scene.background.set(0x000040);

            renderer.render(scene, camera2);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();