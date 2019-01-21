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
      :color="color"
      :outline="day.today"
      @click="onClickDate(day.dateKey)"
    >
      {{ day.display }}
    </VBtn>
  </VBadge>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    counter: { type: Number, default: 0 },
    holiday: { type: Boolean },
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
  computed: {
    ...mapGetters(['actualDate', 'calendar']),
    isDayOff() {
      return this.holiday;
    },
    color() {
      return this.day.outOfRange ? 'grey' : this.isDayOff ? 'red' : '';
    }
  },
  methods: {
    onClickDate(dt) {
      this.$emit('onClickDate', dt);
    }
  }
};
</script>

