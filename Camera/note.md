## Camera

---
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