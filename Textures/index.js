import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });


    // 카메라 세팅
    const cameraSetting = {
        fov: 40, // 시야각 40도
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
    camera.position.z = 10;

    // 씬 생성
    const scene = new THREE.Scene();

    // geomatry 생성
    const boxSetting = {
        width: 1,
        height: 1,
        depth: 1
    }
    const geometry = new THREE.BoxGeometry(
        boxSetting.width,
        boxSetting.height,
        boxSetting.depth
    );

    const cubes = []; // 큐브를 돌릴 배열
    const loader = new THREE.TextureLoader();

    const material = new THREE.MeshBasicMaterial({
        map: loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg'),
    });

    // 메시 생성
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cubes.push(cube);



    // flowerCube
    const materials = [
        new THREE.MeshBasicMaterial({ map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-2.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-3.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-5.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-6.jpg') }),
    ];
    const flowerCube = new THREE.Mesh(geometry, materials)
    flowerCube.position.x = 2;
    scene.add(flowerCube);
    cubes.push(flowerCube);

    // 다른 로더 생성
    // const loader = []

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

        cubes.forEach((cube, ndx) => {
            const speed = .2 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
main();