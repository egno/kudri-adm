<template>
  <v-app>
    <v-navigation-drawer app></v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-title>
        <span class="headline text-uppercase">Проект</span>
        <span class="font-weight-light">Личный кабинет</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      //
    };
  }
};
</script>
