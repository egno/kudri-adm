<template>
  <v-btn
    depressed
    :disabled="disabled"
    :color="color"
    @click="$emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'AppBtn',
  props: {
    disabled: { type: Boolean, default: false },
    primary: { type: Boolean, default: false }
  },
  computed: {
    color() {
      return this.primary ? 'primary' : '';
    }
  }
};
</script>


