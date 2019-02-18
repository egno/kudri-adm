<template>
  <VLayout
    v-if="schedule"
    column
  >
    <VFlex pb-2>
      <div :class="captionClass">
        Режим работы
      </div>
    </VFlex>
    <VContainer
      pt-0
      pl-2
    >
      <VLayout
        justify-space-around
        column
        wrap
      >
        <VFlex
          v-for="(item) in scheduleGroup"
          :key="item.dow"
          pt-0
          pb-0
        >
          <span :class="captionClass">
            {{ item.dow }}:&nbsp;
          </span>
          <span
            v-if="item.works"
            class="timeClass"
          >
            {{ item.time }}
          </span>
          <span
            v-else
            class="timeClass"
          >
            выходной
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
      type: Object,
      default() {
        return { type: 'week', data: [] };
      }
    }
  },
  data() {
    return {
      dow: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
    };
  },
  computed: {
    scheduleGroup() {
      return (
        this.schedule &&
        this.schedule.data &&
        this.schedule.data
          .reduce((r, x, i) => {
            let prev = r[r.length - 1] || [['', '']];
            if (!(prev[0][0] === x[0] && prev[0][1] === x[1])) {
              r.push([x, i, i]);
            } else {
              prev[2] = i;
            }
            return r;
          }, [])
          .map(x => {
            return {
              time: `${x[0][0]}-${x[0][1]}`,
              dow:
                x[1] === x[2]
                  ? this.dow[x[1]]
                  : `${this.dow[x[1]]}-${this.dow[x[2]]}`,
              works: !!x[0][0]
            };
          })
      );
    }
  }
};
</script>

<style>
.timeClass {
  font-size: 80%;
}
</style>

