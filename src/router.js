import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/About.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginPage.vue')
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('./views/Messages.vue')
    },
    {
      path: '/businessList',
      name: 'businessList',
      component: () => import('./views/BusinessList.vue')
    },
    {
      path: '/myBusinessList',
      name: 'myBusinessList',
      component: () => import('./views/BusinessList.vue')
    },
    {
      path: '/businessCard/:id',
      name: 'businessCard',
      component: () => import('./views/BusinessCard.vue')
    },
    {
      path: '/businessCard/c/:id',
      name: 'businessCardClients',
      component: () => import('./views/BusinessCardClients.vue')
    },
    {
      path: '/businessCard/e/:id',
      name: 'businessCardEmployee',
      component: () => import('./views/EmployeeList.vue')
    },
    {
      path: '/businessCard/f/:id',
      name: 'businessCardFilal',
      component: () => import('./views/FilialList.vue')
    },
    {
      path: '/businessCardGallery/:id',
      name: 'businessCardGallery',
      component: () => import('./views/BusinessCardGallery.vue')
    },
    {
      path: '/businessCard/s/:id',
      name: 'businessCardService',
      component: () => import('./views/BusinessCardService.vue')
    },
    {
      path: '/businessCard/v/:id/:date',
      name: 'businessVisit',
      component: () => import('./views/VisitCalendar.vue')
    }
  ]
});
