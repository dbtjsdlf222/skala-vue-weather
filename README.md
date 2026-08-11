# SKALA Vue Weather Lab

Vue 3를 처음 학습하면서 기본 문법부터 컴포넌트 통신, Vue Router, Pinia, 외부 API 연동까지 단계별로 확장한 날씨 대시보드 프로젝트입니다.

하나의 완성 화면만 만드는 대신 학습 과정을 1~6번 메뉴로 분리했습니다. 각 화면은 앞 단계의 개념을 바탕으로 새로운 기능을 추가하며, 마지막 화면에서는 Open-Meteo API로 전국 17개 시·도의 실제 현재 날씨를 조회합니다.

## 프로젝트 목표

- Vue를 처음 배우는 사람도 코드의 실행 순서를 따라갈 수 있도록 작성
- 같은 날씨 데이터를 기본 문법, 검색, 컴포넌트, Router, Store 순서로 반복 학습
- 수업 예제를 그대로 끝내지 않고 사용자 기능과 디자인을 단계별로 개선
- 마지막 단계에서 Mock 데이터와 실제 API 데이터의 차이를 직접 확인

## 학습 진행 순서

```text
1. ref, v-for, v-if, 이벤트
              ↓
2. v-model, input, filter를 이용한 검색
              ↓
3. Props, Emit, Slot을 이용한 컴포넌트 분리
              ↓
4. Vue Router의 Query, Params, 상세 페이지
              ↓
5. Pinia의 State, Getter, Action
              ↓
6. async/await, fetch, 외부 날씨 API
```

## 주요 기능

- Vue Router 기반 6개 학습 화면 전환
- 배열과 `v-for`를 이용한 날씨 카드 출력
- 날씨 카드 선택 및 온도 증가·감소
- 도시 이름과 날씨 상태를 이용한 실시간 복합 검색
- Props와 Emit을 이용한 부모·자식 컴포넌트 통신
- 관심 도시 등록 및 해제
- URL Query와 검색어 동기화
- 동적 Route를 이용한 도시 상세 페이지
- 상세 화면의 이전·다음 도시 이동
- Pinia 기반 섭씨·화씨 단위 변경
- Pinia 기반 선택 도시 및 다크 모드 관리
- 전국 17개 시·도 실시간 검색
- Open-Meteo API 기반 현재 기온·습도·풍속 조회
- 로딩, 오류, 검색 결과 없음 상태 처리
- 데스크톱과 모바일에 대응하는 반응형 UI
- 존재하지 않는 URL을 처리하는 404 화면

## 화면별 구현 상세

### 1. 기본 날씨

`Mockup.vue`에서 연습용 날씨 배열을 `ref`로 선언하고 `v-for`로 반복 출력합니다.

각 카드에는 다음 기능을 추가했습니다.

- 날씨 상태에 따른 아이콘 표시
- 25℃ 기준 더움·추움 배지 표시
- 클릭한 카드 테두리 강조
- `-1℃`, `+1℃` 버튼으로 온도 변경
- 카드 클릭과 상세보기 버튼 클릭을 `.stop`으로 분리
- 전체 도시 개수와 선택 도시 안내 문구 표시

온도 변경은 배열 안의 도시 객체를 함수에 전달하는 방식으로 구현했습니다.

```js
function changeTemperature(item, amount) {
  item.temp = item.temp + amount
}
```

### 2. 실시간 검색

도시 이름과 날씨 상태를 함께 검색할 수 있습니다.

- `v-model`로 검색어와 선택 상태 연결
- `@input`으로 입력 즉시 검색 실행
- `filter()`로 조건에 맞는 도시만 반환
- 검색 결과 개수 표시
- 초기화 버튼으로 검색 조건 복원
- 결과가 없으면 Empty 메시지 표시

검색 조건은 도시명과 날씨 상태가 모두 일치하도록 작성했습니다.

```js
const nameMatches = weather.name.includes(searchText.value)
const statusMatches =
  statusFilter.value === '전체' ||
  weather.status === statusFilter.value

return nameMatches && statusMatches
```

### 3. 컴포넌트 통신

큰 화면을 다음과 같은 작은 컴포넌트로 분리했습니다.

| 컴포넌트 | 역할 |
|---|---|
| `Parent.vue` | 검색 상태, 관심 도시, 날씨 배열 관리 |
| `SearchBar.vue` | 검색어 입력 및 변경 이벤트 전달 |
| `Card.vue` | 날씨 정보 출력 및 사용자 이벤트 전달 |
| `BaseDashboardCard.vue` | Slot 기반 공통 박스 레이아웃 |

데이터와 이벤트의 방향을 구분했습니다.

```text
Parent → Props → SearchBar, Card
Parent ← Emit  ← SearchBar, Card
```

Card는 도시 정보를 Props로 받고, 관심 도시 버튼을 누르면 부모에게 이벤트를 전달합니다.

```vue
<Card
  :city-item="item"
  :is-favorite="favoriteCityIds.includes(item.id)"
  @toggle-favorite="toggleFavorite(item.id)"
/>
```

### 4. Vue Router

Vue Router를 사용해 목록과 상세 화면을 분리했습니다.

- `RouterLink`로 메뉴 이동
- `RouterView`에 현재 URL의 View 출력
- `router.push()`로 상세 페이지 이동
- `/weather/:cityId`에서 도시 ID 전달
- `route.params.cityId`로 도시 ID 읽기
- 검색어를 `?search=` Query에 반영
- 상세 화면에서 이전·다음 도시 순환 이동
- Catch-all Route로 404 화면 처리

검색어가 변경되면 현재 URL에도 검색어가 기록됩니다.

```js
watch(searchQuery, function (newQuery) {
  router.push({
    path: route.path,
    query: {
      search: newQuery || undefined,
    },
  })
})
```

### 5. Pinia 상태 관리

`configStore.js`에서 여러 컴포넌트가 공유할 상태를 관리합니다.

| Store 값 | 구분 | 역할 |
|---|---|---|
| `unit` | State | 섭씨 또는 화씨 저장 |
| `darkMode` | State | 밝은 화면 또는 어두운 화면 저장 |
| `selectedCity` | State | 사용자가 마지막으로 선택한 도시 저장 |
| `unitSymbol` | Getter | 현재 단위에 맞는 ℃ 또는 ℉ 계산 |
| `toggleUnit()` | Action | 섭씨와 화씨 전환 |
| `toggleDarkMode()` | Action | 다크 모드 전환 |
| `selectCity()` | Action | 선택 도시 변경 |

화씨 변환 공식은 다음과 같습니다.

```js
fahrenheit = Math.round((celsius * 9) / 5 + 32)
```

다크 모드 상태는 최상위 `App.vue`에서 사용하므로 5번 화면에서 변경한 테마가 다른 메뉴에서도 유지됩니다.

### 6. 실제 날씨 API

Open-Meteo API를 사용해 실제 현재 날씨를 조회합니다.

- API 키와 회원가입 없이 실행
- 전국 17개 시·도 배열 제공
- 지역명 실시간 검색
- 지역 카드 클릭 시 해당 좌표로 API 요청
- 왼쪽 지역 목록과 오른쪽 날씨 정보의 2단 레이아웃
- 기온·습도·풍속·상태를 작은 정보 칸으로 구분
- 현재 기온, 습도, 풍속, 날씨 상태 표시
- 첫 화면 진입 시 서울 날씨 자동 조회
- 요청 중 로딩 메시지 표시
- 요청 실패 시 오류 메시지 표시

도 지역은 시·도청 소재지 좌표를 대표값으로 사용합니다.

| 지역 | 기준 위치 |
|---|---|
| 경기 | 수원 |
| 강원 | 춘천 |
| 충북 | 청주 |
| 충남 | 홍성 |
| 전북 | 전주 |
| 전남 | 무안 |
| 경북 | 안동 |
| 경남 | 창원 |
| 제주 | 제주 |

API 요청 흐름은 다음과 같습니다.

```text
지역 카드 클릭
    ↓
getWeather(region) 실행
    ↓
위도와 경도로 API URL 생성
    ↓
fetch()로 GET 요청
    ↓
response.json()으로 JSON 변환
    ↓
weather ref에 필요한 값 저장
    ↓
Vue가 화면 자동 업데이트
```

실제 요청에서는 선택한 지역의 위도와 경도를 URL에 연결하고, 응답 데이터 중 화면에 필요한 값만 저장합니다.

```js
const response = await fetch(url)
const data = await response.json()

weather.value = {
  name: region.name,
  temperature: data.current.temperature_2m,
  humidity: data.current.relative_humidity_2m,
  windSpeed: data.current.wind_speed_10m,
  status: getWeatherStatus(data.current.weather_code),
}
```

화면은 데스크톱에서 왼쪽 지역 검색 영역과 오른쪽 날씨 정보 영역을 같은 비율로 배치했습니다. 화면 폭이 좁아지면 한 열로 변경해 지역 선택 영역 아래에 날씨 결과가 표시됩니다.

## 기술 스택

| 구분 | 기술 | 사용 목적 |
|---|---|---|
| UI 프레임워크 | Vue 3 | Composition API와 `<script setup>` 기반 화면 구성 |
| 빌드 도구 | Vite | 개발 서버, HMR, 프로덕션 빌드 |
| 라우팅 | Vue Router | 메뉴 이동, Query, Params, 404 Route |
| 상태 관리 | Pinia | 온도 단위, 테마, 선택 도시 공유 |
| HTTP 통신 | Fetch API | Open-Meteo 날씨 데이터 요청 |
| 외부 API | Open-Meteo | 현재 기온, 습도, 풍속, 날씨 코드 제공 |
| 스타일 | CSS | 카드형 UI, 다크 모드, 반응형 레이아웃 |

## 실행 방법

Node.js `20.19.0` 이상 또는 `22.12.0` 이상 환경을 권장합니다.

### 1. 프로젝트 폴더 이동

```bash
cd skala-vue-weather
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

터미널에 표시된 로컬 주소를 브라우저에서 엽니다.

```text
http://localhost:5173
```

### 4. 배포용 빌드

```bash
npm run build
```

### 5. 빌드 결과 미리보기

```bash
npm run preview
```

Open-Meteo는 이 프로젝트에서 API 키를 사용하지 않으므로 별도의 `.env` 설정이 필요하지 않습니다.

## 프로젝트 구조

```text
skala-vue-weather/
├── index.html                     # Vue 애플리케이션이 들어갈 HTML
├── package.json                   # 패키지와 npm 명령 관리
├── vite.config.js                 # Vue 플러그인과 @ 경로 별칭 설정
├── README.md
└── src/
    ├── main.js                    # Vue 앱 생성, Pinia와 Router 등록
    ├── App.vue                    # 공통 헤더, 메뉴, RouterView, 다크 모드
    ├── assets/
    │   ├── main.css               # body와 #app 기본 스타일
    │   └── exercise.css           # 메뉴, 카드, 반응형, 다크 모드 스타일
    ├── router/
    │   └── index.js               # URL과 View 연결
    ├── stores/
    │   └── configStore.js         # 단위, 테마, 선택 도시 상태
    ├── views/
    │   ├── Basic.vue              # 1번 기본 날씨 화면
    │   ├── Search.vue             # 2번 실시간 검색 화면
    │   ├── Component.vue          # 3번 컴포넌트 조립 화면
    │   ├── Router.vue             # 4번 Router 목록 화면
    │   ├── Detail.vue             # 도시 ID 기반 상세 화면
    │   ├── Store.vue              # 5번 Pinia 화면
    │   ├── Api.vue                # 6번 전국 실제 날씨 API 화면
    │   └── NotFound.vue           # 정의되지 않은 URL 처리
    └── components/
        └── weather/
            ├── Mockup.vue         # 기본 날씨 카드와 온도 조작
            ├── Parent.vue         # 자식 컴포넌트 상태 관리
            ├── SearchBar.vue      # Props와 Emit 기반 검색창
            ├── Card.vue           # 재사용 날씨 카드
            ├── BaseDashboardCard.vue # Slot 기반 공통 레이아웃
            └── UnitToggler.vue    # Pinia 단위와 테마 변경
```

## Route 구성

| URL | Route name | View | 설명 |
|---|---|---|---|
| `/` | - | Redirect | `/basic`으로 이동 |
| `/basic` | `Basic` | `Basic.vue` | 배열과 이벤트 기초 |
| `/search` | `Search` | `Search.vue` | 실시간 복합 검색 |
| `/component` | `Component` | `Component.vue` | Props, Emit, Slot |
| `/router` | `Router` | `Router.vue` | 도시 목록과 Query |
| `/store` | `Store` | `Store.vue` | Pinia 상태 관리 |
| `/api` | `Api` | `Api.vue` | 전국 실제 날씨 |
| `/weather/:cityId` | `Detail` | `Detail.vue` | 도시 ID 기반 상세 |
| `/:pathMatch(.*)*` | `NotFound` | `NotFound.vue` | 404 화면 |

## 전체 데이터 흐름

```text
사용자 입력 또는 버튼 클릭
        ↓
View 또는 Component의 함수 실행
        ↓
ref 상태 변경 또는 Pinia Action 호출
        ↓
필요한 경우 fetch로 외부 API 요청
        ↓
응답 JSON에서 화면에 필요한 값 저장
        ↓
v-if, v-for, 보간법으로 화면 출력
        ↓
상태 변경을 감지한 Vue가 화면 자동 업데이트
```

각 영역의 역할은 다음과 같습니다.

- **View**: URL에 대응하는 페이지와 페이지 상태 관리
- **Component**: 재사용할 수 있는 작은 화면과 사용자 이벤트 처리
- **Router**: URL과 View 연결, 상세 페이지 이동
- **Pinia Store**: 여러 컴포넌트가 공유하는 상태 관리
- **API**: 서버에서 실제 날씨 데이터 제공
- **CSS**: 공통 디자인, 선택 상태, 다크 모드, 반응형 처리

## 화면 설계

- 모든 메뉴에서 같은 헤더와 내비게이션을 사용해 현재 학습 위치를 쉽게 확인
- 선택된 메뉴, 도시, 지역 카드는 색상과 테두리로 구분
- 버튼과 정보 카드를 둥근 형태로 통일
- 로딩, 오류, 검색 결과 없음 상태를 각각 다른 메시지로 표시
- 6번 화면은 지역 선택과 결과 확인이 동시에 가능하도록 좌우 분할
- 모바일에서는 카드 수와 열 개수를 줄이는 반응형 레이아웃 적용

## 적용한 Vue 개념

### 반응형 상태

- `ref`: 검색어, 배열, 선택 도시, 로딩, 오류 메시지 저장
- `computed`: 검색 결과와 단위 기호처럼 기존 값으로 계산되는 데이터
- `watch`: 검색어 변경을 감지해 URL Query 변경
- `watchEffect`: 사용하는 반응형 값을 자동으로 추적
- `onMounted`: 화면 진입 시 초기 데이터 설정 또는 API 호출

### Template 문법

- `{{ value }}`: 데이터 출력
- `v-model`: 입력 요소와 데이터 연결
- `v-for`: 배열 반복 출력
- `v-if / v-else-if / v-else`: 상태별 화면 출력
- `:class`: 상태에 따른 CSS 클래스 변경
- `@click / @input / @change`: 사용자 이벤트 처리
- `.stop`: 이벤트가 부모 요소로 전달되는 것을 차단

### 컴포넌트 통신

- Props: 부모가 자식에게 데이터 전달
- Emit: 자식이 부모에게 사용자 행동 전달
- Slot: 부모가 공통 컴포넌트 내부에 화면 내용 전달

## 직접 개선한 내용

수업의 기본 날씨 예제에서 다음 항목을 직접 확장했습니다.

1. 한 화면에 있던 예제를 여섯 개 Route로 분리
2. 기본 카드에 아이콘, 선택 상태, 온도 조작 기능 추가
3. 단순 도시 검색을 실시간 복합 필터로 개선
4. Card 컴포넌트에 관심 도시 Props와 Emit 추가
5. 상세 페이지에 이전·다음 도시 순환 이동 추가
6. Pinia Store에 다크 모드와 선택 도시 상태 추가
7. 전국 17개 시·도의 실제 날씨 API 연결
8. 로딩, 오류, Empty 상태를 구분해 사용자에게 표시
9. 전체 화면을 카드형 반응형 디자인으로 개선
10. Vue 초보자가 실행 흐름을 이해할 수 있도록 소스 코드에 주석 추가

## 문제 해결 및 개선 과정

| 처음 상태 | 발견한 문제 | 개선 방법 |
|---|---|---|
| 모든 예제가 한 화면에 있음 | 학습 내용이 섞이고 화면이 길어짐 | 6개 Route로 나누고 공통 메뉴 추가 |
| 도시 이름만 검색 | 원하는 날씨 상태를 함께 찾기 어려움 | 도시명과 상태를 동시에 확인하는 복합 필터 적용 |
| 카드 내용을 부모에서 반복 작성 | 같은 UI가 중복됨 | `Card.vue`와 `BaseDashboardCard.vue`로 분리 |
| 컴포넌트 내부에서만 상태 사용 | 다른 화면과 설정 공유가 어려움 | Pinia Store에서 단위, 테마, 선택 도시 관리 |
| 고정된 연습 데이터만 표시 | 실제 데이터 흐름을 확인할 수 없음 | Open-Meteo API와 `async/await` 연결 |
| API 목록과 결과가 세로로 길게 배치 | 지역을 바꿀 때 결과 비교가 불편함 | 왼쪽 선택, 오른쪽 결과의 2단 레이아웃으로 변경 |

## 현재 구현 범위와 향후 개선

- 1~5번 화면은 Vue 문법 학습을 위한 Mock 데이터를 사용합니다.
- 6번 도 지역의 날씨는 시·도 전체 평균이 아니라 시·도청 소재지의 대표 좌표 기준입니다.
- 날씨 코드는 학습 수준에 맞춰 맑음, 구름, 비, 눈, 흐림으로 단순 분류했습니다.
- Pinia 상태는 메모리에 저장되므로 새로고침하면 초기값으로 돌아갑니다.
- 다음 단계에서는 Local Storage 저장, 위치 기반 조회, 예보 데이터, API 요청 로직 분리를 추가할 수 있습니다.

## 검증

다음 항목을 확인했습니다.

- `npm run build` 성공
- 도시 이름과 날씨 상태 검색 정상 동작
- 관심 도시 등록 및 해제 정상 동작
- 상세 페이지 및 이전·다음 도시 이동 정상 동작
- Pinia 단위 변경과 다크 모드 정상 동작
- 정의되지 않은 URL의 404 화면 연결
- 브라우저 콘솔 오류 없음

## 참고

- [README 구성 참고 프로젝트 - Baek-sohyeon/skala-vue](https://github.com/Baek-sohyeon/skala-vue)
- [Vue 공식 문서](https://vuejs.org/)
- [Vue Router 공식 문서](https://router.vuejs.org/)
- [Pinia 공식 문서](https://pinia.vuejs.org/)
- [Vite 공식 문서](https://vite.dev/)
- [Open-Meteo API 문서](https://open-meteo.com/en/docs)
