<template>
  <VLayout column>
    <VFlex pb-0>
      <div :class="captionClass">
        Время работы
      </div>
    </VFlex>
    <VContainer
      pt-0
      pl-2
    >
      <VLayout
        justify-space-around
        row
        wrap
      >
        <VFlex
          v-for="(item,i) in schedule"
          :key="dow[i]"
        >
          <span :class="captionClass">
            {{ dow[i] }}:
          </span>
          <span class="timeClass">
            {{ item[0] }} - {{ item[1] }}
          </span>
        </VFlex>
      </VLayout>
    </VContainer>
  </VLayout>
</template>

<script>
export default {
  props: {
    captionClass: {
      type: String,
      default: ''
    },
    schedule: {
      type: Array,
      default() {
        return [[]];
      }
    }
  },
  data() {
    return {
      dow: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
    };
  }
};
</script>

<style>
.timeClass {
  font-size: 80%;
}
</style>

