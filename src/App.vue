<template>
  <v-app>
    <navigation/>

    <v-toolbar app>
      <v-toolbar-title>
        <span class="font-weight-light">{{userID}}</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      //
    };
  },
  components: {
    Navigation
  },
  computed: {
    ...mapGetters(["userID"])
  }
};
</script>
