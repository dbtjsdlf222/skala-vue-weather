// 애플리케이션 전체에 적용할 CSS를 불러옵니다.
import './assets/main.css'

// createApp은 Vue 애플리케이션을 만드는 함수입니다.
import { createApp } from 'vue'
// createPinia는 여러 컴포넌트가 공유할 Store를 만듭니다.
import { createPinia } from 'pinia'

// App은 가장 상위에 있는 Vue 컴포넌트입니다.
import App from './App.vue'
// router에는 URL과 화면의 연결 정보가 들어 있습니다.
import router from './router'

// App.vue를 기준으로 Vue 애플리케이션을 생성합니다.
const app = createApp(App)

// 생성한 애플리케이션에 Pinia와 Router를 등록합니다.
app.use(createPinia())
app.use(router)

// index.html의 <div id="app"> 안에 Vue 화면을 출력합니다.
app.mount('#app')
