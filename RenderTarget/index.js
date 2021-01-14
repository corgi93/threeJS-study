import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const rtWidth = 800;
    const rtHeight = 800;
    const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);


    // render target 의 가로세로비 (aspect)를 canvas가 아닌 렌더 타겟 자체 사이즈로 구현
    const renderTargetSetting = {
        fov: 75,
        aspect: rtWidth / rtHeight,
        near: 0.1,
        far: 5
    }


    // render target 카메라
    const rtCamera = new THREE.PerspectiveCamera(
        renderTargetSetting.fov,
        renderTargetSetting.aspect,
        renderTargetSetting.near,
        renderTargetSetting.far
    );

    rtCamera.position.z = 2;

    // render target에 대한 scene생성
    const rtScene = new THREE.Scene();
    rtScene.background = new THREE.Color('yellow');


    // 조명 생성
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        rtScene.add(light);
    }

    // 정육면체 3개 생성
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        rtScene.add(cube);

        cube.position.x = x;

        return cube;
    }

    const rtCubes = [
        makeInstance(geometry, 0x22aa88, 0),
        makeInstance(geometry, 0xff0000, -1.5),
        makeInstance(geometry, 0xaa8844, 1.5),
    ];

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const material = new THREE.MeshPhongMaterial({
        map: renderTarget.texture,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

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

        // rotate all the cubes in the render target scene
        rtCubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        // draw render target scene to render target
        renderer.setRenderTarget(renderTarget);
        renderer.render(rtScene, rtCamera);
        renderer.setRenderTarget(null);

        // rotate the cube in the scene
        cube.rotation.x = time;
        cube.rotation.y = time * 1.1;

        // render the scene to the canvas
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();