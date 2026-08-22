import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import RecycleReuseView from '../views/RecycleReuseView.vue'
import MapView from '../views/MapView.vue'
import EventsView from '../views/EventsView.vue'
import LearnView from '../views/LearnView.vue'
import ContactView from '../views/ContactView.vue'
import AboutView from '../views/AboutView.vue'
import AccountView from '../views/AccountView.vue'
import AdminView from '../views/AdminView.vue'

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
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
