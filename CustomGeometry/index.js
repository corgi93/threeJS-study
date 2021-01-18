import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

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

    // 커스텀 geometry
    const geometry = new THREE.Geometry();
    geometry.vertices.push(
        /*
              6------7
          2---|--3   |
          |   |  |   |
          |   4--|---5
          0------1
        */
        new THREE.Vector3(-1, -1, 1), // 0
        new THREE.Vector3(1, -1, 1), // 1
        new THREE.Vector3(-1, 1, 1), // 2
        new THREE.Vector3(1, 1, 1), // 3
        new THREE.Vector3(-1, -1, -1), // 4
        new THREE.Vector3(1, -1, -1), // 5
        new THREE.Vector3(-1, 1, -1), // 6
        new THREE.Vector3(1, 1, -1), // 7

    );

    // 위에서 꼭지점으로 형태를 잡아줬으면 한 면에 삼각형 2개로 면(face)을 만들어야 합니다.
    // 꼭지점의 idx를 넘길 때는 순서에 유의.

    geometry.faces.push(
        /*
         2------3
         |    / |
         |  /   |
         0 -----1
        앞쪽의 예시.        
         */
        // 앞쪽
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        // 오른쪽
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        // 뒷쪽
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        // 왼쪽
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        // 상단
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        // 하단
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1)
    );
    // geometry.faces[0].color = geometry.faces[1].color = new THREE.Color('red');
    // geometry.faces[2].color = geometry.faces[3].color = new THREE.Color('yellow');
    // geometry.faces[4].color = geometry.faces[5].color = new THREE.Color('green');
    // geometry.faces[6].color = geometry.faces[7].color = new THREE.Color('cyan');
    // geometry.faces[8].color = geometry.faces[9].color = new THREE.Color('blue');
    // geometry.faces[10].color = geometry.faces[11].color = new THREE.Color('magenta');

    geometry.faceVertexUvs[0].push(
        // front
        [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)], [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)],
        // right
        [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)], [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)],
        // back
        [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)], [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)],
        // left
        [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)], [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)],
        // top
        [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)], [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)],
        // bottom
        [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)], [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)],
    );

    geometry.computeFaceNormals();
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');



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