<template>
  <v-tabs
    :value="value"
    color="grey lighten-4"
    slider-color="primary"
    @change="$emit('input', $event)"
  >
    <slot />
  </v-tabs>
</template>

<script>
export default {
  props: {
    value: { type: Number, default: 0 }
  }
};
</script>
