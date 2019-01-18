<template>
  <div>
    <v-snackbar
      v-if="alert"
      :value="alert"
      multi-line
      bottom
      right
    >
      {{ alert.message }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['alerts']),
    alert() {
      return this.alerts.slice(-1)[0];
    }
  },
  methods: {
    ...mapActions(['delAlert']),
    onClose() {
      this.delAlert();
    }
  }
};
</script>
