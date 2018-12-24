<template>
  <VLayout column>
    <VFlex>
      <div :class="captionClass">
        Время работы
      </div>
    </VFlex>
    <VContainer>
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
          <span>{{ item[0] }} - {{ item[1] }}</span>
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
