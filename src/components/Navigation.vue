<template>
  <VNavigationDrawer
    app
    :dark="!isBusinessCard"
    :value="navBarVisible"
    @input="onInput($event)"
  >
    <VToolbar flat>
      <VToolbarTitle @click="goHome()">
        {{ appTitle }}
      </VToolbarTitle>
      <VSpacer />
      <VToolbarSideIcon @click="navBar()" />
    </VToolbar>
    <VList>
      <VListTile
        v-for="item in items"
        :key="item.title"
        :to="item.route"
      >
        <VListTileAction>
          <VIcon>{{ item.icon }}</VIcon>
        </VListTileAction>

        <VListTileContent>
          <VListTileTitle>{{ item.title }}</VListTileTitle>
        </VListTileContent>
      </VListTile>
    </VList>
  </VNavigationDrawer>
</template>

<script>
import router from "@/router"
import { mapActions, mapGetters } from "vuex"

export default {
  data () {
    return {
      //
    }
  },
  computed: {
    ...mapGetters(["appTitle", "loggedIn", "token", "navBarVisible"]),
    items () {
      return this.menu.filter(x => x.show)
    },
    isBusinessCard () {
      const businessCards = [
        "businessCard",
        "businessCardEmployee",
        "businessCardService"
      ]
      return businessCards.some(x => x === this.$route.name)
    },
    isManagerMenu () {
      return !this.isBusinessCard
    },
    menu () {
      return [
        {
          title: "Мой профиль",
          show: this.loggedIn && this.isManagerMenu
        },
        {
          title: "Сообщения",
          show: this.loggedIn && this.isManagerMenu
        },
        {
          title: "Мои компании",
          icon: "business",
          route: { name: "myBusinessList" },
          show: this.loggedIn && this.isManagerMenu
        },
        {
          title: "Все компании",
          icon: "business",
          route: { name: "businessList" },
          show: !this.loggedIn || this.isManagerMenu
        },
        {
          title: "Информация",
          show: this.loggedIn && this.isBusinessCard,
          route: { name: "businessCard", id: this.$route.params.id }
        },
        {
          title: "Услуги",
          show: this.loggedIn && this.isBusinessCard,
          route: { name: "businessCardService", id: this.$route.params.id }
        },
        {
          title: "Сотрудники",
          show: this.loggedIn && this.isBusinessCard,
          route: { name: "businessCardEmployee", id: this.$route.params.id }
        },
        {
          title: "Филиалы",
          show: this.loggedIn && this.isBusinessCard
        },
        {
          title: "Галерея",
          show: this.loggedIn && this.isBusinessCard
        }
      ]
    }
  },
  watch: {
    token: "loadUserInfo"
  },
  methods: {
    ...mapActions(["navBar", "loadUserInfo"]),
    goHome () {
      router.push({ name: "home" })
    },
    onInput (event) {
      this.navBar(event)
    }
  }
}
</script>
