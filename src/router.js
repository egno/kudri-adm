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
      component: () => import('./views/Main.vue')
    },
    {
      path: '/account/changeemail',
      name: 'AccountChangeEmail',
      component: () => import('./views/account/ChangeEmail.vue')
    },
    {
      path: '/account/changephone',
      name: 'AccountChangePhone',
      component: () => import('./views/account/ChangePhone.vue')
    },
    {
      path: '/account/setpassword',
      name: 'AccountSetPassword',
      component: () => import('./views/account/ChangePassword.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/restore',
      name: 'restorePassword',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/register/:code',
      name: 'registerCode',
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
      path: '/businessCardGallery/s/:id',
      name: 'businessCardServiceGallery',
      component: () => import('./views/BusinessCardGallery.vue')
    },
    {
      path: '/businessCardGallery/e/:id',
      name: 'businessCardEmployeeGallery',
      component: () => import('./views/BusinessCardGallery.vue')
    },
    {
      path: '/employeeGallery/:employee',
      name: 'employeeGallery',
      component: () => import('./views/EmployeeGalleryFull.vue')
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
    },
    {
      path: '/managerCard',
      name: 'managerCard',
      component: () => import('./views/ManagerCard.vue')
    }
  ]
});
