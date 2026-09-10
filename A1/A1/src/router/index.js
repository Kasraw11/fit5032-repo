import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import RecycleReuseView from '../views/RecycleReuseView.vue'
import MapView from '../views/MapView.vue'
import EventsView from '../views/EventsView.vue'
import LearnView from '../views/LearnView.vue'
import ContactView from '../views/ContactView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccountView from '../views/AccountView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminUsersView from '../views/admin/AdminUsersView.vue'
import AdminEventsView from '../views/admin/AdminEventsView.vue'
import AdminLocationsView from '../views/admin/AdminLocationsView.vue'
import SignUpView from '../views/SignUpView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/recycle-reuse',
    name: 'recycle-reuse',
    component: RecycleReuseView,
  },
  {
    path: '/locations',
    name: 'locations',
    component: MapView,
  },
  {
    path: '/events',
    name: 'events',
    component: EventsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/learn',
    name: 'learn',
    component: LearnView,
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsersView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/events',
    name: 'admin-events',
    component: AdminEventsView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/locations',
    name: 'admin-locations',
    component: AdminLocationsView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))

  if (to.meta.requiresAuth && !currentUser) {
    return '/account/login'
  }

  if (to.meta.requiresAdmin && currentUser.role !== 'admin') {
    return '/account'
  }
})

export default router
