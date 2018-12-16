import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/About.vue")
    },
    {
      path: "/businessList",
      name: "businessList",
      component: () => import("./views/BusinessList.vue")
    },
    {
      path: "/myBusinessList",
      name: "myBusinessList",
      component: () => import("./views/BusinessList.vue")
    },
    {
      path: "/businessCard/:id",
      name: "businessCard",
      component: () => import("./views/BusinessCard.vue")
    },
    {
      path: "/businessCardEmployee/:id",
      name: "businessCardEmployee",
      component: () => import("./views/BusinessCardEmployee.vue")
    },
    {
      path: "/businessCardService/:id",
      name: "businessCardService",
      component: () => import("./views/BusinessCardService.vue")
    }
  ]
})
