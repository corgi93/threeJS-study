# Three.js의 재질 - Material

Three.js에 기본으로 제공하는 재질(materials) 몇 개가 있다.
재질은 물체가 scene에 어떤 식으로 나타날 지 결정하는 요소.
<br>

재질의 속성을 정하는 방법 2가지.
1. 생성자를 호출할 때 값을 넘겨줌

```
const material = new THREE.MeshPhongMaterial({
    color: 0xFF0000,
    flatShading : true,
})
```

2. 객체 생성 후 뒤에 바꾸는 방법

```
const material = new THREE.MeshPhongMaterial();
material.color.setHSL(0, 1, .5);  // 빨강
material.flatShading = true;
```

* hsl 색상 모델 외에 rgb , hex 등 다양한 방법으로 색 지정 가능.

```
material.color.set(0x00FFFF);    // CSS의 #RRGGBB 형식
material.color.set(cssString);   /* CSS 색상 문자열, 예를 들어 'purple', '#F32',
material.color.set('purple');                                 
material.color.set('rgb(255, 127, 64)'); 
material.color.set('hsl(180, 50%, 25%)');                               
material.color.set(someColor)    // THREE.Color에 정의된 static 색상
material.color.setHSL(h, s, l)   // hsl 색상, 0부터 1까지
material.color.setRGB(r, g, b)   // rgb 색상, 0부터 1까지
``` 


## Three.js의 기본 재질들

### MeshBasicMaterial
광원의 영향을 받지 않음. 

### MeshLambertMaterial 
정점에서만 광원을 계산

### MeshPhongMaterial
앞선 예제에서 계속 사용한 재질. 픽셀 하나하나 전부 광원을 계산.
반사점(물체가 빛을 받을 때 물체에 나타나는 밝은 점. 역주)도 지원

- shininess 속성 : 반사점의 밝기를 조절할 수 있다. (기본값 30)

tip)

MeshBasicMaterial({ color : 'purple' }) <br>
MeshLambertMaterial({ color : 'black' , emissive : 'purple' }) <br>
MeshPhongMaterial({ color : 'black' , emissive : 'purple' , shininess : 0 })

Lamber는 color를 블랙을 해주면<br>
Phong은 color를 블랙으로 해주고, shiniess를 0으로 해주면<br>
위의 3가지는 모두 BasicMaterial처럼 입체감이 사라진다. <br>


### why?
왜 3가지로 분리했냐면 재질이 정교할수록 gpu부담이 커짐.
광원 효과가 없다면 MeshBasicMaterial을 사용하도록 한다.

### MeshToonMaterial 과 MeshPhongMaterial의 차이점
둘은 유사해 보이는데 Toon은 그라이언트 맵을 사용한다. 부드러운 쉐이딩이 특징이고 카툰 느낌을 준다.


실제 세계처럼 물체를 구현하기 위해서는 '물리 기반 렌더링(Physically Based Renndering) - PBR' 을 사용해야 한다.

- MeshStandardMaterial (줄여서 Standard)
 Phong과 다른 점은 속성이 다르다는 것. <br>
 Phong은 shininess를 사용하고 <br>
 Standard는 roughness와 metalness 두 가지 속성을 사용<br>
    - roughness : 0-1 사이 값을 가짐. shininess의 반대. 낮을수록 번들번들 거림 빛 반사가 높아짐.
    - metalness : 0-1 사이 값을 가짐. 얼마나 금속 재질에 가깝나. 0은 아예 금속이 x. 1은 완전 금속처럼 보임


### 빠른 성능 순서 
MeshBasicMaterial - MeshLambertMaterial - MeshPhongMaterial - MeshStandardmaterial - MeshPhysicalMaterial

줄여서

Basic - Lambert - Phong - Standard - Physical

오른쪽으로 갈수록 더 리얼한 결과물을 얻지만 gpu 부담이 너무 커질 수 있으므로 저사양 지원을 위해 코드 최적화에 신경써야 한다.


### Material 클래스의 재질 속성

- flatShading : 물체를 각지게 표현할 지 (true / false. default는 false)
- side : 어떤 면을 렌더링할 지 여부. 

THREE.FrontSide (앞면)/ THREE.BackSide (뒷면) / THREE.DoubleSide (양면)

3D로 렌더링한 물체는 대부분 불투명한 고체라서, 뒷면은 굳이 렌더링할 필요가 없다. 면이나 고체가 아닌 경우 뒤가 보이도록 렌더링 할 경우에 DoubleSide로 지정해준다.