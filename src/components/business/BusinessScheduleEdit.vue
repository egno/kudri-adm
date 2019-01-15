<template>
  <VLayout column>
    <VFlex>
      <div>Режим работы</div>
    </VFlex>
    <VLayout
      justify-space-around
      row
      wrap
    >
      <PeriodEdit
        v-for="(item, i) in schedule.data"
        :key="dow[i]"
        :caption="dow[i]"
        :period="item"
        @onEdit="onEdit"
      />
    </VLayout>
  </VLayout>
</template>

<script>
import PeriodEdit from '@/components/PeriodEdit.vue';
export default {
  components: { PeriodEdit },
  props: {
    schedule: {
      type: Array,
      default() {
        return {
          type: 'week',
          data: [
            ['', ''],
            ['', ''],
            ['', ''],
            ['', ''],
            ['', ''],
            ['', ''],
            ['', '']
          ]
        };
      }
    }
  },
  data() {
    return {
      dow: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
    };
  },
  methods: {
    onEdit() {
      this.$emit('onEdit', this.schedule);
    }
  }
};
</script>
