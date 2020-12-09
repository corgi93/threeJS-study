import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

function main() {
    const canvas = document.getElementById('primary-model');

    // renderer 객체 생성 후 canvas에 그림.
    const renderer = new THREE.WebGLRenderer({ canvas });

    // 카메라 세팅
    const cameraSetting = {
        fov: 40,
        aspect: 2,
        near: 0.5,
        far: 1000,
    };

    const camera = new THREE.PerspectiveCamera(
        cameraSetting.fov,
        cameraSetting.aspect,
        cameraSetting.near,
        cameraSetting.far
    );
    camera.position.z = 100;

    // scene 생성
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    // light
    {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    // geometry 객체를 만들어 보자 (실린더)

    /* geometry 세팅 값 json */
    const settings = {
        cylinder: {
            radiusTop: 6,
            radiusBottom: 6,
            height: 10,
            radialSegments: 4,
        },
        tube: {
            radius: 5,
            tubeRadius: 2,
            radialSegments: 8,
            tubularSegments: 24,
        },
        sphere: {
            radius: 7,
            widthSegments: 12,
            heightSegments: 8,
        },
        verticalCube: {
            verticalsOfCube: [-1, -1, -1, 1, -1, -1,
                1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1,
                1, 1, 1, -1, 1, 1,
            ],
            indicesOfFaces: [
                2, 1, 0, 0, 3, 2,
                0, 4, 7, 7, 3, 0,
                0, 1, 5, 5, 4, 0,
                1, 2, 6, 6, 5, 1,
                2, 3, 7, 7, 6, 2,
                4, 5, 6, 6, 7, 4,
            ],
            radius: 5,
            detail: 2,
        },
        flattube: {
            innderRadius: 2,
            outerRadius: 7,
            segments: 18,
        },
        font: {
            loader: new THREE.FontLoader(),
            text: 'maxst',
            load: () => {
                this.loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', (font) => {
                    const text = 'maxst';
                    const geometry = new THREE.TextBufferGeometry(text, {
                        font: font,
                        size: 3,
                        height: 1,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 0.15,
                        bevelSize: 0.3,
                        bevelSegments: 5,
                    })
                    return geometry
                })
            }
        }
    };

    // 객체 생성
    const grometry = {
        cylinder: new THREE.CylinderBufferGeometry(
            settings.cylinder.radiusTop,
            settings.cylinder.radiusBottom,
            settings.cylinder.height,
            settings.cylinder.radialSegments
        ),
        tube: new THREE.TorusBufferGeometry(
            settings.tube.radius,
            settings.tube.tubeRadius,
            settings.tube.radialSegments,
            settings.tube.tubularSegments
        ),
        sphere: new THREE.SphereBufferGeometry(
            settings.sphere.radius,
            settings.sphere.widthSegments,
            settings.sphere.heightSegments
        ),
        verticalCube: new THREE.PolyhedronBufferGeometry(
            settings.verticalCube.verticalsOfCube,
            settings.verticalCube.indicesOfFaces,
            settings.verticalCube.radius,
            settings.verticalCube.detail
        ),
        flattube: new THREE.RingBufferGeometry(
            settings.flattube.innderRadius,
            settings.flattube.outerRadius,
            settings.flattube.segments,
        ),
        font: settings.font.load
    };

    // font 객체 따로 추가.
    const loader = new THREE.FontLoader();
    loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', (font) => {
        const text = 'maxst|jin';
        const geometry = new THREE.TextBufferGeometry(text, {
            font: font,
            size: 3,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5,
        })
        objects.push(createMaterial(geometry, 0xf0f333, 20, 20));
    });


    // material 생성 함수
    function createMaterial(geometry, color, x, y) {
        const material = new THREE.MeshPhongMaterial({ color });
        const instance = new THREE.Mesh(geometry, material);

        scene.add(instance);
        instance.position.x = x;
        instance.position.y = y;
        return instance;
    }

    const objects = [
        createMaterial(grometry.cylinder, 0xfe00ff, 0, 0),
        createMaterial(grometry.tube, 0xff0000, -20, 10),
        createMaterial(grometry.sphere, 0x0000ff, 20, -10),
        createMaterial(grometry.verticalCube, 0xf4ffe3, 40, -20),
        createMaterial(grometry.flattube, 0x4e5eff, -40, 20),

    ];


    // 디스플레이되는 크기로 리사이징. css로 디스플레이 사이즈 만큼 키워서 렌더링 되도록 해야함.
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

        objects.forEach((obj, ndx) => {
            const speed = 0.5 + ndx * 0.1;
            const rot = time * speed;
            obj.rotation.x = rot;
            obj.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();