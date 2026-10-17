import { createRouter, createWebHistory } from 'vue-router'
import { currentUser, waitForAuthReady, checkAdminRole } from '@/authentication'

import HomeView from '../views/HomeView.vue'
import RecycleReuseView from '../views/RecycleReuseView.vue'

import MapView from '../views/MapView.vue'

import EventsView from '../views/EventsView.vue'

import LearnView from '../views/learn/LearnView.vue'
import AZRecyclingView from '../views/learn/AZRecyclingView.vue'
import LearnRulesView from '../views/learn/RecyclingRulesView.vue'
import LearnDonationView from '../views/learn/DonationGuideView.vue'
import BatteriesElectronicView from '../views/learn/a-z-recycling/BatteriesElectronicView.vue'
import PackagingLabelsView from '../views/learn/a-z-recycling/PackagingLabelsView.vue'
import CompostingView from '../views/learn/a-z-recycling/CompostingView.vue'
import BinCollectionView from '../views/learn/bin-collection/BinCollectionView.vue'
import CollectionDaysView from '../views/learn/bin-collection/CollectionDaysView.vue'
import BinContentsView from '../views/learn/bin-collection/BinContentsView.vue'
import LandfillBinView from '../views/learn/bin-collection/LandfillBinView.vue'
import RecyclingBinView from '../views/learn/bin-collection/RecyclingBinView.vue'
import FoodGardenWasteBinView from '../views/learn/bin-collection/FoodGardenWasteBinView.vue'
import BinPlacementView from '../views/learn/bin-collection/BinPlacementView.vue'
import BinCareView from '../views/learn/bin-collection/BinCareView.vue'
import ReduceReuseView from '../views/learn/ReduceReuseView.vue'

import ContactView from '../views/ContactView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccountView from '../views/AccountView.vue'
import ProfileView from '../views/account/ProfileView.vue'
import MyEventsView from '../views/account/MyEventsView.vue'
import ReportsView from '../views/account/ReportsView.vue'

import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminLocationsView from '../views/admin/AdminLocationsView.vue'
import AdminRecycleReuseView from '../views/admin/AdminRecycleReuseView.vue'
import AdminStatsView from '../views/admin/AdminStatsView.vue'
import AdminReportsView from '../views/admin/AdminReportsView.vue'

import AdminNotificationsView from '../views/admin/AdminNotificationsView.vue'

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
    path: '/learn/a-z-recycling',
    name: 'learn-a-z-recycling',
    component: AZRecyclingView,
  },
  {
    path: '/learn/a-z-recycling/batteries-electronics',
    name: 'learn-batteries-electronics',
    component: BatteriesElectronicView,
  },
  {
    path: '/learn/a-z-recycling/packaging-labels',
    name: 'learn-packaging-labels',
    component: PackagingLabelsView,
  },
  {
    path: '/learn/bin-collection',
    name: 'learn-bin-collection',
    component: BinCollectionView,
  },
  {
    path: '/learn/bin-collection/collection-days',
    name: 'learn-collection-days',
    component: CollectionDaysView,
  },
  {
    path: '/learn/bin-collection/bin-contents',
    name: 'learn-bin-contents',
    component: BinContentsView,
  },
  {
    path: '/learn/bin-collection/landfill-bin',
    name: 'learn-landfill-bin',
    component: LandfillBinView,
  },
  {
    path: '/learn/bin-collection/recycling-bin',
    name: 'learn-recycling-bin',
    component: RecyclingBinView,
  },
  {
    path: '/learn/bin-collection/food-garden-waste-bin',
    name: 'learn-food-garden-waste-bin',
    component: FoodGardenWasteBinView,
  },
  {
    path: '/learn/bin-collection/bin-placement',
    name: 'learn-bin-placement',
    component: BinPlacementView,
  },
  {
    path: '/learn/bin-collection/bin-care',
    name: 'learn-bin-care',
    component: BinCareView,
  },
  {
    path: '/learn/reduce-reuse',
    name: 'learn-reduce-reuse',
    component: ReduceReuseView,
  },
  {
    path: '/learn/rules',
    name: 'learn-rules',
    component: LearnRulesView,
  },
  {
    path: '/learn/donation',
    name: 'learn-donation',
    component: LearnDonationView,
  },

  {
    path: '/learn/composting',
    name: 'learn-composting',
    component: CompostingView,
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
    path: '/account/profile',
    name: 'account-profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/my-events',
    name: 'account-my-events',
    component: MyEventsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/reports',
    name: 'account-reports',
    component: ReportsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/support',
    redirect: '/contact',
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
    path: '/admin/events',
    name: 'admin-events',
    redirect: '/admin/locations',
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/locations',
    name: 'admin-locations',
    component: AdminLocationsView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/recycle-reuse',
    name: 'admin-recycle-reuse',
    component: AdminRecycleReuseView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/stats',
    name: 'admin-stats',
    component: AdminStatsView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/reports',
    name: 'admin-reports',
    component: AdminReportsView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/notifications',
    name: 'admin-notifications',
    component: AdminNotificationsView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  await waitForAuthReady()
  const user = currentUser.value

  if (to.meta.requiresAuth && !user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin) {
    const adminAllowed = await checkAdminRole(user)
    if (!adminAllowed) return { name: user ? 'account' : 'login' }
  }

  if ((to.name === 'login' || to.name === 'signup') && user) {
    return { name: 'account' }
  }
})

export default router
