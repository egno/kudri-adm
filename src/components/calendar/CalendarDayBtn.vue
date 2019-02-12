<template>
  <VBadge
    :value="counter"
    overlap
  >
    <VBtn
      :class="{ weekend : weekend, badge : (counter > 0) }"
      class="calendar-btn"
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
    weekend: { type: Boolean, default: false },
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
<style lang="scss" scoped>
  .calendar-btn {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }
  .v-btn--block {
    color: #D6DAE3;
    &.weekend {
      color: #8995AF;
    }
    &.v-btn--outline {
      background: #fff!important;
      color: #142941;
      font-weight: bold;
      &.badge {
        &:after {
          top: 20px;
        }
      }
    }
    &.badge {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 4px;
        top: 16px;
        background: #5699FF;
      }
    }
  }
</style>
