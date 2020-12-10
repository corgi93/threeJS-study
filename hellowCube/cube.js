import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

function main() {
    const canvas = document.getElementById('cube');
    /*  1. Renderer 객체 생성 - 렌더러는 다양한 종류가 있음. 
        나중엔 WebGL2Renderer , WebGPURenderer가 대체할 예정.
        3차원을 canvas에 그려줄 WebGL인 WebGLRenderer을 사용.
     */
    const renderer = new THREE.WebGLRenderer({ canvas });

    /* 2. 카메라 생성.
       fov : field of view (시야각). 대부분 three.js는 radians로 받는데 원근 카메라는 특이하게 degrees로 인자 받음
       
       aspect : canvas 가로 세로 비율
       near과  far : 카메라 앞에 렌더링 되는 공간 범위를 지정하는 요소.
       이 공간 바깥의 요소는 짤리고, 렌더링 되지 x.
       */

    // 이 4가지 속성은 하나의 절두체(frustum)을 만듦.
    const cameraSetting = {
        fov: 70,
        aspect: 2,
        near: 0.1,
        far: 5,
    };

    const camera = new THREE.PerspectiveCamera(
        cameraSetting.fov,
        cameraSetting.aspect,
        cameraSetting.near,
        cameraSetting.far
    );
    // 기본 설정으로 -z축 +y축. 즉 아래를 봅니다.
    camera.position.z = 2;

    /**
     * 3. scene 생성
     * Scene를 만들자. Scene은 씬 그래프에서 가장 상단에 위치한 요소.
     * 뭔가를 화면에 렌더링하려면 Scene에 먼저 추가해야함.
     */
    const scene = new THREE.Scene();

    /**
     * 광원 질감 만들기
     */

    {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        // Scenec 그래프에 추가
        scene.add(light);
    }

    /**
     * 4. 기하학 객체 만들기
     */

    const boxSetting = {
        width: 1,
        height: 1,
        depth: 1,
    };

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({ color });

        // Geometry(물체의 형태)와 Material(물체의 색. 질감 등)을 이용해 Mesh를 만듦.
        // Mesh는 Geometry, Material 외에도 물체의 위치, 방향, 크기 등을 담은 객체.
        const cube = new THREE.Mesh(geometry, material);
        // Scenec 그래프에 추가
        scene.add(cube);
        cube.position.x = x;

        return cube;
    }

    // 정육면체인 BoxGeometry 객체를 생성.
    const geometry = new THREE.BoxGeometry(
        boxSetting.width,
        boxSetting.height,
        boxSetting.depth
    );

    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];

    // 다음으로 Material을 만들고 색을 지정.
    // MeshBasicMaterial은 광원에 반응하지 않으니, 광원에 반응하는
    // MeshPhongMaterial로 바꿉니다(phong은 광원 반사 모델을 처음 개발한 사람 이름)
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

    // renderer의 render 메서드에 Scene과 Camera를 넘겨주면 화면을 렌더링할 수 있습니다.
    renderer.render(scene, camera);

    // 한면만 보이는 객체를 움직여서 3D인 것을 확인하자
    function render(time) {
        time *= 0.001; // convert time to seconds
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