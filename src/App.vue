<template>
  <v-app app>
    <v-toolbar app>
      <v-toolbar-side-icon v-if="!navBarVisible" @click="navBar()"></v-toolbar-side-icon>
      <v-toolbar-title @click="goHome()" v-if="!navBarVisible">{{appTitle}}</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items>
        <profile-menu/>
      </v-toolbar-items>
    </v-toolbar>
    <navigation/>
    <v-content app>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import ProfileMenu from "@/components/ProfileMenu.vue";
import router from "@/router";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      //
    };
  },
  components: {
    Navigation,
    ProfileMenu
  },
  computed: {
    ...mapGetters(["actions", "appTitle", "navBarVisible", "userID"]),
    defaultAction() {
      if (!this.actions) {
        return;
      }
      return this.actions.filter(x => x["default"])[0];
    }
  },
  methods: {
    ...mapActions([
      "loadFromStorage",
      "loadServiceCategories",
      "loadServiceList",
      "navBar"
    ]),
    goHome() {
      router.push({ name: "home" });
    }
  },
  mounted() {
    this.loadFromStorage();
    this.loadServiceCategories();
    this.loadServiceList();
  }
};
</script>
