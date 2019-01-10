<template>
  <VBadge
    :value="counter"
    overlap
  >
    <div slot="badge">
      {{ counter }}
    </div>
    <VBtn
      fab
      small
      block
      depressed
      flat
      :color="day.outOfRange ? 'grey': ''"
      :outline="day.today"
      @click="onClickDate(day.dateKey)"
    >
      {{ day.display }}
    </VBtn>
  </VBadge>
</template>

<script>
export default {
  props: {
    counter: { type: Number, default: 0 },
    day: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    onClickDate(dt) {
      this.$emit('onClickDate', dt);
    }
  }
};
</script>

