import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import OverviewPage from '../pages/overview.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Overview',
    component: OverviewPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
