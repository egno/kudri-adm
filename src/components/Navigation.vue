<template>
  <v-navigation-drawer app :dark="!isBusinessCard" :value="navBarVisible" @input="onInput($event)">
    <v-toolbar flat>
      <v-toolbar-title @click="goHome()">{{appTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click="navBar()"></v-toolbar-side-icon>
    </v-toolbar>
    <v-list>
      <v-list-tile v-for="item in items" :key="item.title" :to="item.route">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import router from "@/router";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      //
    };
  },
  watch: {
    token: "loadUserInfo"
  },
  computed: {
    ...mapGetters(["appTitle", "loggedIn", "token", "navBarVisible"]),
    items() {
      return this.menu.filter(x => x.show);
    },
    isBusinessCard() {
      const businessCards = ["businessCard", "businessCardService"];
      return businessCards.some(x => x === this.$route.name);
    },
    isManagerMenu() {
      return !this.isBusinessCard;
    },
    menu() {
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
          show: this.loggedIn && this.isBusinessCard
        },
        {
          title: "Филиалы",
          show: this.loggedIn && this.isBusinessCard
        },
        {
          title: "Галерея",
          show: this.loggedIn && this.isBusinessCard
        }
      ];
    }
  },
  methods: {
    ...mapActions(["navBar", "loadUserInfo"]),
    goHome() {
      router.push({ name: "home" });
    },
    onInput(event) {
      this.navBar(event);
    }
  }
};
</script>
