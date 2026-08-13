# SKALA 날씨 연구소 & BALLCAST

Vue 3 문법을 단계별로 연습한 날씨 프로젝트와 날씨에 따른 야구 경기 취소 가능성을 확인하는 BALLCAST 과제를 하나의 애플리케이션으로 구성했습니다.

- 배포 주소: [https://temporary-snappy-zither-11sb6zn.vercel.app](https://temporary-snappy-zither-11sb6zn.vercel.app)
- GitHub: [https://github.com/dbtjsdlf222/skala-vue-weather](https://github.com/dbtjsdlf222/skala-vue-weather)

화면 오른쪽 위 토글을 사용하면 `Vue 문법 실습`과 `과제` 화면을 전환할 수 있습니다.

## 프로젝트 목적

- Vue의 기본 문법부터 Router, Pinia, API 통신까지 순서대로 연습
- Props, Emit, Slot을 이용해 화면을 작은 컴포넌트로 분리
- Axios로 실제 날씨 API를 요청하고 로딩과 오류 상태 처리
- 날씨 데이터를 생활 정보와 야구 경기 운영 정보로 가공
- ESLint와 Vite 빌드로 제출 전 코드 상태 확인

## 주요 화면

### Vue 문법 실습

| 번호 | 화면 | 학습 내용 |
|---|---|---|
| 1 | 기본 | `ref`, `v-for`, `v-if`, 이벤트 처리 |
| 2 | 검색 | `v-model`, `computed`, 배열 `filter()` |
| 3 | 컴포넌트 | Props, Emit, Slot, Element Plus 알림창 |
| 4 | Router | Query String, 상세 페이지, 이전·다음 이동 |
| 5 | Store | Pinia State와 Action, 섭씨·화씨 전환, 다크 모드 |
| 6 | API1 | Axios와 Open-Meteo를 이용한 전국 날씨 조회 |
| 7 | API2 | Axios와 OpenWeatherMap을 이용한 GET·POST·PUT·DELETE |

### 1. 기본

더미 날씨 배열을 반복 출력하고 선택한 카드와 검색 결과를 반응형으로 표시합니다.

- `ref`로 검색어, 선택 도시, 안내 문구 관리
- `v-for`로 도시 카드 반복 출력
- `v-if`로 검색 결과가 없을 때 안내 문구 출력
- 카드 클릭 이벤트로 선택 상태 변경

### 2. 검색

검색어와 날씨 상태를 입력받아 조건에 맞는 도시만 보여줍니다.

```js
// 원본 배열은 변경하지 않고 검색 조건에 맞는 새 배열을 만든다.
const result = computed(() => {
  return cityList.filter((item) => {
    return item.name.includes(search.value)
  })
})
```

`computed`는 검색어가 변경될 때마다 결과를 다시 계산하므로 별도의 검색 버튼 없이 화면이 바로 갱신됩니다.

### 3. 컴포넌트

날씨 화면을 역할에 따라 나누고 부모와 자식의 데이터 흐름을 연습했습니다.

| 컴포넌트 | 역할 |
|---|---|
| `Parent.vue` | 검색어, 검색 결과, 관심 도시 상태 관리 |
| `SearchBar.vue` | `v-model` 입력값을 Emit으로 부모에게 전달 |
| `Card.vue` | Props로 도시를 받고 선택·상세·관심 이벤트 전달 |
| `BaseBoard.vue` | Slot으로 전달받은 내용을 공통 박스에 출력 |

```text
Parent -> Props -> SearchBar, Card
Parent <- Emit  <- SearchBar, Card
Parent -> Slot  -> BaseBoard
```

상세보기는 브라우저 기본 `alert` 대신 Element Plus의 `ElMessageBox`를 사용했습니다.

### 4. Router

검색어와 선택 도시 ID를 Query String에 저장합니다.

```text
/router?search=서울
/weather?cityId=city_01
```

- `useRoute()`로 현재 Query 값 읽기
- `useRouter()`와 `router.push()`로 주소 이동
- 검색어를 `?search=`와 동기화
- 상세 페이지에서 도시 순서를 기준으로 이전·다음 이동
- 정의되지 않은 주소는 `Error404.vue`로 연결

### 5. Store

`configStore.js`에서 여러 화면이 공유할 설정을 관리합니다.

| State | 역할 |
|---|---|
| `unit` | 섭씨 또는 화씨 단위 저장 |
| `darkMode` | 밝은 화면과 어두운 화면 상태 저장 |
| `selectedCity` | 마지막으로 선택한 도시 저장 |

화씨는 `섭씨 × 9 / 5 + 32` 공식으로 계산합니다.

### 6. API1

Open-Meteo API에서 선택한 지역의 현재 날씨를 가져옵니다. 이 API는 별도 키가 필요하지 않습니다.

- 지역명과 기준 위치 검색
- 선택 지역 변경을 `watch`로 감지
- `watch(..., { immediate: true })`로 첫 화면에서 즉시 요청
- 현재 기온, 습도, 풍속, 날씨 상태, 강수 확률 표시
- 요청 중, 요청 실패, 검색 결과 없음 상태 구분

받아온 날씨를 다시 계산해 자취 생활에 필요한 정보도 보여줍니다.

- 빨래 추천
- 환기 가능 여부
- 대청소 추천
- 불쾌지수
- 집콕 추천

### 7. API2

OpenWeatherMap의 현재 날씨 API와 개인 측정소 API를 Axios로 요청합니다.

| 버튼 | HTTP Method | 동작 |
|---|---|---|
| 현재 날씨 GET | `GET` | 입력한 위도와 경도의 현재 날씨 조회 |
| 측정소 등록 | `POST` | 새로운 개인 측정소 생성 |
| 측정소 목록 | `GET` | 계정에 등록된 측정소 조회 |
| 선택 측정소 수정 | `PUT` | 측정소 이름과 위치 수정 |
| 선택 측정소 삭제 | `DELETE` | 선택한 측정소 삭제 |

입력창과 알림창에는 Element Plus의 `ElInput`, `ElInputNumber`, `ElMessage`, `ElMessageBox`를 사용했습니다. 샘플 데이터 5개를 제공해 교수자가 위치 값을 직접 입력하지 않아도 요청을 확인할 수 있게 했습니다.

개발 환경에서는 Vite 프록시가 `/openweather-stations` 요청을 OpenWeatherMap으로 전달하고, 배포 환경에서는 `vercel.json`의 Rewrite가 같은 역할을 합니다.

## BALLCAST 과제

BALLCAST는 날씨에 따라 야구 경기가 취소될 가능성을 확인하는 경기 운영 대시보드입니다. 화면을 크게 채우는 별도 레이아웃과 하위 Router를 사용했습니다.

### 화면 구성

| 메뉴 | 주요 기능 |
|---|---|
| 통합 대시보드 | 실시간 구장 날씨, 취소 가능성, 예상 스코어, 양 팀 기록, 직관 준비 정보 |
| 경기 일정 | 날짜·검색어·위험 단계 필터, 운영 타임라인 |
| 구장 날씨 | 구장별 날씨 카드, 선택 구장 상세 관측, 비교표 |
| 팀 기록 | 샘플 시즌 순위와 두 팀의 승률·최근 흐름 비교 |
| 운영 관리 | 취소 계산 기준, 경기 전 체크리스트, 운영 로그 |

### 날씨 자동 조회

대시보드가 열리면 5개 구장의 위도와 경도로 OpenWeatherMap API를 요청합니다.

```text
화면 진입
  -> 5개 구장의 현재 날씨를 Promise.all()로 요청
  -> 강수량, 습도, 풍속 저장
  -> 경기별 취소 가능성 다시 계산
  -> 5분마다 자동 갱신
  -> 다른 화면으로 이동하면 타이머 종료
```

API 요청에 실패하면 처음 준비한 샘플 날씨를 유지해 화면 전체가 비어 있지 않도록 처리했습니다.

### 취소 가능성 계산

취소 가능성은 복잡한 인공지능 모델이 아니라 수업에서 배운 조건문으로 계산합니다.

```text
기본값 5점
  + 시간당 강수량 점수
  + 습도 점수
  + 풍속 점수
  = 취소 가능성(최대 95%)
```

- 60% 이상: 취소 위험
- 30% 이상: 진행 주의
- 30% 미만: 정상 예상
- 돔구장: 날씨와 관계없이 2%로 표시

이 값은 실습을 위한 참고 지표이며 실제 경기 취소 발표가 아닙니다. 예상 스코어와 팀 기록도 공식 실시간 기록이 아닌 더미 데이터입니다.

### 브라우저 저장

관심 경기와 알림 설정은 `localStorage`에 저장합니다. 같은 브라우저에서는 새로고침해도 설정이 유지되지만, 브라우저 데이터를 삭제하거나 다른 브라우저를 사용하면 공유되지 않습니다.

## 기술 스택

| 구분 | 기술 | 사용 목적 |
|---|---|---|
| Frontend | Vue 3 | Composition API와 `<script setup>` 기반 화면 구현 |
| Build | Vite | 개발 서버와 프로덕션 빌드 |
| Router | Vue Router | 실습 페이지와 BALLCAST 하위 페이지 연결 |
| Store | Pinia | 단위, 테마, 선택 도시 공유 |
| HTTP | Axios | Open-Meteo와 OpenWeatherMap 요청 |
| UI | Element Plus | Select, Switch, Input, Progress, Message, Dialog |
| Code Check | ESLint | Vue와 JavaScript 문법 및 코드 규칙 검사 |
| Hosting | Vercel | 정적 사이트 배포와 SPA/API Rewrite |

## 실행 방법

### 1. 프로젝트 설치

```bash
# 프로젝트 폴더로 이동한다.
cd skala-vue-weather

# package-lock.json에 기록된 패키지를 설치한다.
npm ci
```

Node.js는 `20.19.0` 이상 또는 `22.12.0` 이상을 사용합니다.

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 OpenWeatherMap API 키를 입력합니다.

```dotenv
# OpenWeatherMap 현재 날씨와 개인 측정소 요청에 사용한다.
VITE_OPENWEATHER_API_KEY=발급받은_API_KEY
```

`.env.local`은 `.gitignore`에 포함되어 GitHub에 올라가지 않습니다. 다만 `VITE_`로 시작하는 값은 Vite 빌드 후 브라우저 코드에 포함되므로 서버용 비밀 키 보관 방식으로 사용할 수는 없습니다.

### 3. 개발 서버 실행

```bash
# 기본 개발 서버를 실행한다.
npm run dev
```

외부 기기에서도 접속해야 한다면 다음과 같이 실행합니다.

```bash
# 같은 네트워크의 다른 기기에서도 접속할 수 있게 연다.
npm run dev -- --host 0.0.0.0
```

### 4. 검사와 빌드

```bash
# ESLint로 코드 오류와 규칙 위반을 확인한다.
npm run lint

# 제출 또는 배포할 프로덕션 파일을 생성한다.
npm run build

# 생성된 dist 결과를 로컬에서 미리 확인한다.
npm run preview
```

## 프로젝트 구조

```text
skala-vue-weather/
├── index.html
├── package.json
├── eslint.config.js               # ESLint 설정
├── vite.config.js                 # Vue 설정과 개발용 API 프록시
├── vercel.json                    # SPA와 배포용 API Rewrite
└── src/
    ├── App.vue                    # 실습·과제 전환과 실습 메뉴
    ├── main.js                    # Vue, Pinia, Router 등록
    ├── assets/
    │   ├── exercise.css           # Vue 실습 화면 스타일
    │   └── assignment.css         # BALLCAST 공통 스타일
    ├── components/
    │   ├── weather/               # 날씨 실습 컴포넌트
    │   └── baseball/              # 경기 일정과 요약 카드
    ├── data/
    │   ├── data.js                # 도시, 지역, API2 샘플 데이터
    │   └── baseball/baseballData.js # 야구 경기 더미 데이터
    ├── router/index.js            # 전체 Route 설정
    ├── stores/configStore.js      # Pinia 공통 상태
    ├── utils/baseball/weatherRisk.js # 취소 가능성 계산 함수
    └── views/
        ├── practice/              # 1~7번 Vue 실습 화면
        ├── baseball/              # BALLCAST Layout과 5개 페이지
        └── Error404.vue           # 존재하지 않는 주소 처리
```

## Route 구성

### Vue 문법 실습

| URL | 화면 |
|---|---|
| `/` | 1. 기본 |
| `/search` | 2. 검색 |
| `/component` | 3. 컴포넌트 |
| `/router` | 4. Router |
| `/weather?cityId=city_01` | 도시 상세 |
| `/store` | 5. Store |
| `/api` | 6. API1 |
| `/api2` | 7. API2 |

### BALLCAST

| URL | 화면 |
|---|---|
| `/ballcast/dashboard` | 통합 대시보드 |
| `/ballcast/schedule` | 경기 일정 |
| `/ballcast/stadiums` | 구장 날씨 |
| `/ballcast/records` | 팀 기록 |
| `/ballcast/operations` | 운영 관리 |

## 구현하면서 확인한 점

1. Props는 부모에서 자식으로 데이터를 보내고 Emit은 자식의 행동을 부모에게 알릴 때 사용했습니다.
2. Slot은 공통 박스 디자인 안에 서로 다른 내용을 넣을 때 사용했습니다.
3. `computed`는 원본 상태로 검색 결과나 통계처럼 새로운 값을 계산할 때 사용했습니다.
4. `watch`는 검색어와 URL을 맞추거나 선택 지역 변경 시 API를 호출할 때 사용했습니다.
5. `onMounted`와 `onUnmounted`를 이용해 BALLCAST 자동 갱신 타이머를 시작하고 종료했습니다.
6. 개발 서버의 프록시는 Vercel 배포에서 동작하지 않으므로 `vercel.json`에 같은 Rewrite를 추가했습니다.

## 구현 범위와 주의사항

- 날씨는 각 지역 전체 평균이 아니라 코드에 저장된 대표 좌표 기준입니다.
- BALLCAST의 취소 가능성은 강수량, 습도, 풍속을 이용한 단순 규칙 기반 계산입니다.
- 경기 일정, 예상 점수, 팀 성적, 운영 로그는 화면 실습을 위한 더미 데이터입니다.
- 실제 경기 진행 여부는 KBO와 구단의 공식 발표를 확인해야 합니다.
- API2의 측정소 등록·수정·삭제는 OpenWeatherMap 계정의 실제 측정소 데이터에 적용됩니다.
- OpenWeatherMap API 키 상태나 계정 권한에 따라 개인 측정소 CRUD 요청이 실패할 수 있습니다.

## 검증

제출 전 다음 명령으로 확인합니다.

```bash
# 코드 규칙을 검사한다.
npm run lint

# 프로덕션 빌드가 가능한지 확인한다.
npm run build
```

## 참고 자료

- [Vue 3 공식 문서](https://vuejs.org/)
- [Vue Router 공식 문서](https://router.vuejs.org/)
- [Pinia 공식 문서](https://pinia.vuejs.org/)
- [Axios 공식 문서](https://axios-http.com/)
- [Element Plus 공식 문서](https://element-plus.org/)
- [Open-Meteo API 문서](https://open-meteo.com/en/docs)
- [OpenWeatherMap API 문서](https://openweathermap.org/api)
