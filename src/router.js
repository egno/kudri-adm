import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

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
      path: '/businessCard/:id/i',
      name: 'businessCard',
      component: () => import('./views/BusinessCard.vue')
    },
    {
      path: '/businessCard/:id/c',
      name: 'businessCardClients',
      component: () => import('./views/BusinessClientsTable.vue')
    },
    {
      path: '/businessCard/:id/c/:client',
      name: 'businessCardClient',
      component: () => import('./views/BusinessClientsTable.vue')
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
      path: '/gallery/:id',
      name: 'companyGallery',
      component: () => import('./views/gallery/_id/index.vue')
    },
    {
      path: '/gallery/:id/companyAlbum',
      name: 'companyAlbum',
      component: () => import('./views/gallery/_id/CompanyAlbum.vue')
    },
    {
      path: '/gallery/:id/services', // todo подумать над структурой
      name: 'companyServicesGallery',
      component: () => import('./views/gallery/Album.vue')
    },
    {
      path: '/gallery/:id/employees',
      name: 'companyEmployeesGallery',
      component: () => import('./views/gallery/_id/employees/index.vue')
    },
    {
      path: '/gallery/:id/employees/:personalId',
      name: 'employeeGallery',
      component: () => import('./views/gallery/_id/employees/_personalId/index.vue')
    },
    {
      path: '/gallery/:id/employees/:personalId/album', // todo подумать над структурой
      name: 'serviceAlbum',
      component: () => import('./views/gallery/Album.vue')
    },
    /*{
      path: '/gallery/personal/:personalId',
      name: 'personalGallery',
      component: () => import('./views/gallery/PersonalGallery.vue')
    },*/
    {
      path: '/businessCard/:id/e/:employee',
      name: 'employeeFull',
      component: () => import('./views/EmployeeFull.vue')
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
})
