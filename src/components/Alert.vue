<template>
  <div>
    <v-alert
      v-model="alert"
      dismissible
      type="error"
    >
      {{message}}
    </v-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alert: true
    };
  },
  props: {
    message: { type: String }
  }
};
</script>
