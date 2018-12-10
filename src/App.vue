<template>
  <v-app app>
    <navigation/>

    <v-toolbar app>
      <v-spacer/>
      <v-toolbar-title>
        <span class="font-weight-light">{{userID}}</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content app>
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
    ...mapGetters(["actions", "userID"]),
    defaultAction() {
      if (!this.actions) {
        return;
      }
      return this.actions.filter(x => x["default"])[0];
    }
  }
};
</script>
