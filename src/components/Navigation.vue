<template>
  <v-navigation-drawer app>
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">{{appTitle}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile v-for="item in items" :key="item.title" :to="{name: item.route}">
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "Мой профиль", icon: "account_box", route: "login" },
        { title: "Мои компании", icon: "business", route: "businessList" }
      ]
    };
  },
  computed: {
    ...mapGetters(["appTitle"])
  }
};
</script>
