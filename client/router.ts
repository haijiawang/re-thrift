import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePage from './components/Home/HomePage.vue';
import RequestsPage from './components/Request/RequestsPage.vue';
import EventsPage from './components/Event/EventsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/requests', name: 'Requests', component: RequestsPage }, //?
  { path: '/events', name: 'Events', component: EventsPage },
  { path: '/account', name: 'Account', component: AccountPage },
  { path: '/profile', name: 'Profile', component: ProfilePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '*', name: 'Not Found', component: NotFound }
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({ name: 'Account' }); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({ name: 'Login' }); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
