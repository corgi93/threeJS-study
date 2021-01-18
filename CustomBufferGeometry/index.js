import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

/*
BufferGeometry는 일반 geometry에 비해 쓰시 어렵지만
일반적으로 초기화 속도가 빠르고 메모리 점유율이 낮습니다. 성능적으로 좋다.

1000개의 정도면 geometry로 생성해 렌더링하는 게 좋지만, 10000개 이상의 객체를 렌더링 할 거라면
성능적인 이슈를 고려해 BufferGeometry를 사용하는 게 좋을 수 있다.

사실 geometry는 BufferGeometry의 추상화 한 것. 내부적으로는 BufferGeometry로 변경됨.
*/
function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });

    // camera 생성
    const cameraSettings = {
        fov: 75,
        aspect: 2, // canvas 디폴트 값
        near: 0.1,
        far: 100,
    };
    const camera = new THREE.PerspectiveCamera(
        cameraSettings.fov,
        cameraSettings.aspect,
        cameraSettings.near,
        cameraSettings.far
    );
    camera.position.z = 5;

    // scene 생성
    const scene = new THREE.Scene();

    // light 생성
    {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const vertices = [
        // front
        { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] }, // 0
        { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] }, // 1
        { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] }, // 2
        { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] }, // 3

        // right
        { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] }, // 4
        { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] }, // 5
        { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] }, // 6
        { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] }, // 7
        // back
        { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] }, // 8
        { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] }, // 9
        { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] }, // 10
        { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] }, // 11
        // left
        { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] }, // 12
        { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] }, // 13
        { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] }, // 14
        { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] }, // 15
        // top
        { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0] }, // 16
        { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] }, // 17
        { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] }, // 18
        { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1] }, // 19
        // bottom
        { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0] }, // 20
        { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] }, // 21
        { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] }, // 22
        { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1] }, // 23
    ];

    const positions = [];
    const normals = [];
    const uvs = [];
    for (const vertex of vertices) {
        positions.push(...vertex.pos);
        normals.push(...vertex.norm);
        uvs.push(...vertex.uv);
    }

    // 커스텀 geometry
    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(
            new Float32Array(positions),
            positionNumComponents
        )
    );
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(
            new Float32Array(normals),
            normalNumComponents
        )
    );
    geometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
    );
    // 각 꼭지점 데이터의 idx값 36개 - 삼각형이 12개이므로 - 를 넘겨줌.
    geometry.setIndex([
        0, 1, 2, 2, 1, 3, // 앞쪽
        4, 5, 6, 6, 5, 7, // 오른쪽
        8, 9, 10, 10, 9, 11, // 뒤쪽
        12, 13, 14, 14, 13, 15, // 왼쪽
        16, 17, 18, 18, 17, 19, // 상단
        20, 21, 22, 22, 21, 23, // 하단
    ]);


    const loader = new THREE.TextureLoader();
    const texture = loader.load(
        'https://threejsfundamentals.org/threejs/resources/images/star.png'
    );

    // 큐브 객체생성
    function makeInstance(geometry, color, x) {
        // color를 넣는게 아니라 추가로 재질 생성시 vertexColos 속성을 사용한다고 명시해야 faces들의 컬러를 적용할 수 있다
        const material = new THREE.MeshPhongMaterial({ color, map: texture });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;
        return cube;
    }

    const cubes = [
        makeInstance(geometry, 0x44ff44, 0),
        makeInstance(geometry, 0x4444ff, -4),
        makeInstance(geometry, 0xff4444, 4),
    ];

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
            const speed = 1 + ndx * 0.1;
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