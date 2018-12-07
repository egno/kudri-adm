<template>
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            {{appTitle}}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["appTitle"])
  }
};
</script>
