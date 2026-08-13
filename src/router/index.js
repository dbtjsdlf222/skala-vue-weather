import { createRouter, createWebHistory } from "vue-router";

import Index from "../views/practice/Index.vue";
import Search from "../views/practice/Search.vue";
import Component from "../views/practice/Component.vue";
import RouterPage from "../views/practice/Router.vue";
import Store from "../views/practice/Store.vue";
import Api from "../views/practice/Api.vue";
import Api2 from "../views/practice/Api2.vue";
import Detail from "../views/practice/Detail.vue";
import About from "../views/practice/About.vue";
import BallcastLayout from "../views/baseball/BallcastLayout.vue";
import BallcastDashboard from "../views/baseball/pages/Dashboard.vue";
import BallcastSchedule from "../views/baseball/pages/Schedule.vue";
import BallcastStadiums from "../views/baseball/pages/Stadiums.vue";
import BallcastRecords from "../views/baseball/pages/Records.vue";
import BallcastOperations from "../views/baseball/pages/Operations.vue";
import Error404 from "../views/Error404.vue";

const routes = [
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/",
    name: "Index",
    component: Index,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
  {
    path: "/component",
    name: "Component",
    component: Component,
  },
  {
    path: "/router",
    name: "Router",
    component: RouterPage,
  },
  {
    path: "/store",
    name: "Store",
    component: Store,
  },
  {
    path: "/api",
    name: "Api",
    component: Api,
  },
  {
    path: "/api2",
    name: "Api2",
    component: Api2,
  },
  {
    path: "/weather",
    name: "Detail",
    component: Detail,
  },
  {
    path: "/ballcast",
    component: BallcastLayout,
    redirect: "/ballcast/dashboard",
    children: [
      {
        path: "dashboard",
        name: "BallcastDashboard",
        component: BallcastDashboard,
        meta: { title: "통합 대시보드" },
      },
      {
        path: "schedule",
        name: "BallcastSchedule",
        component: BallcastSchedule,
        meta: { title: "경기 일정 관리" },
      },
      {
        path: "stadiums",
        name: "BallcastStadiums",
        component: BallcastStadiums,
        meta: { title: "구장별 기상 관제" },
      },
      {
        path: "records",
        name: "BallcastRecords",
        component: BallcastRecords,
        meta: { title: "팀 기록 분석" },
      },
      {
        path: "operations",
        name: "BallcastOperations",
        component: BallcastOperations,
        meta: { title: "경기 운영 관리" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Error404",
    component: Error404,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 페이지 이동 전 출발지와 목적지를 콘솔에서 확인한다.
router.beforeEach((to, from) => {
  console.log("router.beforeEach", to, from);
});

// 야구 사이트에서는 현재 메뉴 이름을 브라우저 탭 제목에 표시한다.
router.afterEach((to) => {
  if (to.path.startsWith("/ballcast")) {
    document.title = `BALLCAST | ${to.meta.title || "야구 경기 운영"}`;
    return;
  }

  document.title = "SK Weather";
});

export default router;
