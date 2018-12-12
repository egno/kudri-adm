<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm12 md6>
        <business-main-info></business-main-info>
      </v-flex>
      <v-flex xs12 sm12 md6>
        <user-info></user-info>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import BusinessMainInfo from "@/components/BusinessMainInfo.vue";
import UserInfo from "@/components/UserInfo.vue";

export default {
  data() {
    return {
      data: { data: {} }
    };
  },
  components: { BusinessMainInfo, UserInfo },
  computed: {
    id() {
      return this.$route.params.id;
    }
  }
};
</script>
