import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: function (to, from, savedPosition) {
    if (to.hash) {
        return { selector: to.hash }
    } else if (savedPosition) {
      return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/public/Main.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('./views/public/Faq.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('./views/public/News.vue')
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
      component: () => import('./views/BusinessInfo.vue')
    },
    {
      path: '/businessCard/:id/c',
      name: 'businessClientsTable',
      component: () => import('./views/BusinessClientsTable.vue')
    },
    {
      path: '/businessCard/:id/c/:client',
      name: 'businessCardClient',
      component: () => import('./views/BusinessClientsTable.vue')
    },
    {
      path: '/businessCard/e/:id',
      name: 'employeeList',
      component: () => import('./views/EmployeeList.vue')
    },
    {
      path: '/businessCard/f/:id',
      name: 'filialList',
      component: () => import('./views/FilialList.vue')
    },
    {
      path: '/businessUsers/f/:id',
      name: 'businessUsers',
      component: () => import('./views/UserList.vue')
    },
    {
      path: '/businessUsers/f/:id/u/:user',
      name: 'businessUser',
      component: () => import('./views/UserList.vue')
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
      component: () =>
        import('./views/gallery/_id/employees/_personalId/index.vue')
    },
    {
      path: '/gallery/:id/employees/:personalId/album', // todo подумать над структурой
      name: 'serviceAlbum',
      component: () => import('./views/gallery/Album.vue')
    },
    {
      path: '/businessCard/:id/e/:employee',
      name: 'employeeProfile',
      component: () => import('./views/EmployeeProfile.vue')
    },
    {
      path: '/businessCard/s/:id',
      name: 'services',
      component: () => import('./views/Services.vue')
    },
    {
      path: '/businessCard/v/:id/:date',
      name: 'visitCalendar',
      component: () => import('./views/VisitCalendar.vue')
    },
    {
      path: '/businessCard/o/:id',
      name: 'businessSettings',
      component: () => import('./views/BusinessSettings.vue')
    },
    {
      path: '/businessCard/w/:id',
      name: 'widgetSettings',
      component: () => import('./views/WidgetSettings.vue')
    },
    {
      path: '/managerCard',
      name: 'managerCard',
      component: () => import('./views/ManagerCard.vue')
    }
  ]
})
