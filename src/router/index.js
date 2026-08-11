// createRouter는 Router를 만들고, createWebHistory는 일반적인 URL 방식을 사용합니다.
import { createRouter, createWebHistory } from 'vue-router'

// 각 URL에서 보여줄 View 컴포넌트를 불러옵니다.
import Basic from '../views/Basic.vue'
import Search from '../views/Search.vue'
import Component from '../views/Component.vue'
import RouterPage from '../views/Router.vue'
import Store from '../views/Store.vue'
import Api from '../views/Api.vue'
import Detail from '../views/Detail.vue'
import NotFound from '../views/NotFound.vue'

// routes 배열에 URL(path)과 화면(component)의 연결 관계를 작성합니다.
const routes = [
  {
    // 사용자가 첫 주소로 들어오면 /basic으로 이동합니다.
    path: '/',
    redirect: '/basic',
  },
  {
    // /basic 주소에서는 Basic.vue를 보여줍니다.
    path: '/basic',
    name: 'Basic',
    component: Basic,
  },
  {
    // /search 주소에서는 Search.vue를 보여줍니다.
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    // /component 주소에서는 Component.vue를 보여줍니다.
    path: '/component',
    name: 'Component',
    component: Component,
  },
  {
    // /router 주소에서는 Router.vue를 보여줍니다.
    path: '/router',
    name: 'Router',
    component: RouterPage,
  },
  {
    // /store 주소에서는 Store.vue를 보여줍니다.
    path: '/store',
    name: 'Store',
    component: Store,
  },
  {
    // /api 주소에서는 실제 날씨 API 화면을 보여줍니다.
    path: '/api',
    name: 'Api',
    component: Api,
  },
  {
    // :cityId는 city_01처럼 주소에 따라 달라지는 값입니다.
    path: '/weather/:cityId',
    name: 'Detail',
    component: Detail,
  },
  {
    // 위 주소들과 일치하지 않으면 NotFound.vue를 보여줍니다.
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

// 위에서 작성한 routes 배열을 이용해 Router를 생성합니다.
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

// main.js에서 사용할 수 있도록 router를 내보냅니다.
export default router
