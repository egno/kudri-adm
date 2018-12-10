<template>
  <v-navigation-drawer app dark :value="navBarVisible" @input="onInput($event)">
    <v-toolbar flat>
      <v-toolbar-title @click="goHome()">{{appTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click="navBar()"></v-toolbar-side-icon>
    </v-toolbar>
    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile v-if="loggedIn" :to="{name: 'businessList'}">
        <v-list-tile-action>
          <v-icon>business</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Мои компании</v-list-tile-title>
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
      items: []
    };
  },
  computed: {
    ...mapGetters(["appTitle", "loggedIn", "navBarVisible"])
  },
  methods: {
    ...mapActions(["navBar"]),
    goHome() {
      router.push({ name: "home" });
    },
    onInput(event) {
      this.navBar(event);
    }
  }
};
</script>
