<template>
  <VLayout
    align-center
    justify-start
    row
    class="wrapper"
  >
    <div
      v-for="(day, i) in days"
      :key="i"
      :style="{ 'z-index': 7 - i }"
      class="text-xs-center"
      :class="{ fill : day.select, empty : !day.select }"
      @click="selectDay(i)"
    >
      {{ day.name }}
    </div>
    <VLayout class="workmode-wrap">
      <TimeEdit
        enabled="!showSwitch || switchValue"
        :time="startVal"
        @onEdit="onEditStart"
      />
      <TimeEdit
        enabled="!showSwitch || switchValue"
        :time="endVal"
        @onEdit="onEditEnd"
      />
      <VBtn
        v-if="itemindex !== 0"
        depressed
        flat
        small
        class="delete"
        @click="deletePeriod"
      />
    </VLayout>
  </VLayout>
</template>

<script>
import TimeEdit from '@/components/TimeEdit.vue';
export default {
  components: { TimeEdit },
  props: {
    selected: {
      type: Array,
      default() {
        return [];
      }
    },
    periodStart: {
      type: String,
      default: ''
    },
    periodEnd: {
      type: String,
      default: ''
    },
    showSwitch: { type: Boolean, default: false },
    switch: { type: Boolean, default: false },
    itemindex: { type: Number, default: null }
  },
  data() {
    return {
      dow: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
      switchValue: undefined,
      startVal: undefined,
      endVal: undefined,
      focus: false,
    };
  },
  computed: {
    days() {
      let days = [];
      this.dow.forEach((el, i) => {
        let obj = {
          name: '',
          select: false
        };
        obj.name = el;
        if (this.selected.length !== 0 && this.selected.includes(i)) {
          obj.select = true;
        } else {
          obj.select = false;
        }
        days.push(obj);
      });
      return days;
    }
  },
  watch: {
    switchValue: 'loadValues',
    periodStart: 'loadValues',
    periodEnd: 'loadValues'
  },
  mounted() {
    this.loadValues();
  },
  methods: {
    deletePeriod() {
      this.startVal = '';
      this.endVal = '';
      this.$emit('onEdit', [this.startVal, this.endVal]);
    },
    onEditStart(payload) {
      this.startVal = payload;
      this.$emit('onEdit', [this.startVal, this.endVal]);
    },
    onEditEnd(payload) {
      this.endVal = payload;
      this.$emit('onEdit', [this.startVal, this.endVal]);
    },
    selectDay(index) {
      if (!this.days[index].select || this.startVal !== null && this.endVal !== null) {
        this.$emit('selectDay', [index, this.startVal, this.endVal]);
      } else {
        this.$emit('selectDay', [index, null, null]);
      }
    },
    loadValues() {
      this.switchValue = this.switch;
      this.startVal = this.periodStart;
      this.endVal = this.periodEnd;
    }
  }
};
</script>
<style lang="scss" scoped>
#app .workmode-wrap {
  margin-left: 12px;
}
#app .v-btn.delete {
  right: -66px;
  top: -2px;
  position: absolute;
}
.wrapper {
  margin-bottom: 35px!important;
  margin-top: 35px!important;
}
.fill,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
  margin-right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50px;
  background: #fff;
  font-size: 13px;
  position: relative;
  z-index: 2;
  cursor: pointer;
  user-select: none;
}
.empty {
  color: rgba(137, 149, 175, 0.35);
  &.fill {
    background: transparent;
    &:before {
      display: none;
    }
  }
}
.fill {
  background: #d6dae3;
  + .fill {
    &:before {
      content: '';
      height: 24px;
      width: 30px;
      position: absolute;
      left: -17px;
      z-index: -1;
      background: #d6dae3;
    }
  }
}
</style>