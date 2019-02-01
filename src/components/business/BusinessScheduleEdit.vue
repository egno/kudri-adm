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
        :period-start="item[0]"
        :period-end="item[1]"
        @onEdit="onEdit(i,$event)"
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
      type: Object,
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
    onEdit(i, payload) {
      this.$set(this.schedule.data, i, payload);
      this.$emit('onEdit', this.schedule);
    }
  }
};
</script>
