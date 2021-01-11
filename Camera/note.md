## Camera

---

### PerspectiveCamera(원근 카메라) - 절두체를 이용한
앞선 예제에서 썼던 카메라(자주 사용되는)는 'PerspectiveCamera(원근카메라)'입니다.
이 카메라는 멀리 있는 물체를 상대적으로 작게 보이도록 해줍니다.

<br>
PerspectiveCamera는 4가지 속성으로 절두체(frustum)을 만듭니다.<br>
near: 절두체가 어디서 시작할 지 결정하는 속성
far: 절두체의 끝
fov: 시야각(field of view)으로 near와 카메라의 거리에 따라 절두체의 높이를 계산해 적용.
aspect: 절두체의 너비에 관여하는 비율. 

** 절두체:  직각뿔을 평행하게 깎은 것.

![frustum](https://ko.wikipedia.org/wiki/%EC%A0%88%EB%91%90%EC%B2%B4#/media/%ED%8C%8C%EC%9D%BC:Square_frustum.png)

* 카메라 절두체를 시각화
```
const cameraHelper = new THREE.CameraHelper(camera);

scene.add(cameraHelper);
```


* THREE.js 의 가위 함수(Scissor function)을 이용해 같은 장면 2개와 카메라 2개를 렌더링 할 수 있습니다.
---
```
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

    render(){
        ...
        // 기존 카메라 렌더링
         const aspect = setScissorForElement(view1Elem);

        ...
        // 두 번째 카메라 렌더링
        const aspect = setScissorForElement(view2Elem);

    }

```

* issue

near을 0.0000000000001 로 설정하고  far를 1000000000000으로 설정하면 다 보이지 않을까?
이 질문에 GPU는 어떤 물체가 앞에 있거나 다른 물체의 뒤에 있을 때만 정밀도가 높습니다.
정밀도는 near와 far 사이에 퍼져 있는데, 기본적으로 카메라에 가까울 수록 정밀도가 높고 멀수록 
낮아집니다.

구 20개를 한줄로 세우고 near=0.0000000000001 , far= 100으로 최대 설정하면 뒤의 구체들은
렌더링이 깨지는 현상이 생기는데 z-파이팅(z-fighting)의 한 예입니다.

컴퓨터의 GPU가 어떤 픽셀이 앞이고 어떤 픽셀을 뒤로 보내야 할 지 결정할 정밀도가 모자랄 때 발생하는 현상입니다.

```
const renderer = new THREE.WebGLRenderer({
  canvas,
  logarithmicDepthBuffer: true,
});
```

### logarithmicDepthBuffer 을 지양해야하는 이유
- logarithmicDepthBuffer 설정으로 해결할 수 있지만, 데스크탑은 거의 이 기능을 지원하지만 모바일 기기는 거의 지원하지 x
- 훨씬 성능이 나쁘다..


따라서 near를 작게 far를 멀게 하다보면 또 같은 문제에 직면할 수 있으므로 
카메라의 near와 far를 설정할 때 고민을 많이 해야 합니다.

---

###  OrthographicCamera (정사영 카메라)

두 번째로 자주 사용하는 카메라인 OrthographicCamera입니다. 절두체 대신 left, right, top, bottom, near, far로 육면체를 정의해서 사용합니다.

주로 게임 엔진 에디터 등같이 3d 모델링 결과물의 상,하,좌,우,앞,뒤를 렌더링 시 사용합니다.

