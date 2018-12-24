<template>
  <div>
    <span :class="captionClass">
      Тел.
    </span>&nbsp;
    <div
      v-for="(item, i) in phones"
      :key="i"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    captionClass: {
      type: String,
      default:
        'caption font-weight-bold text-no-wrap grey--text text--lighten-1'
    },
    phones: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
