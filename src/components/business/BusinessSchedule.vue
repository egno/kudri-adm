<template>
  <div class="schedule" :class="{_expanded: expanded }">
    <div class="schedule__header" @click="$emit('toggleSchedule')">
      Режим работы
    </div>
    <VLayout v-show="expanded" class="schedule__container">
      <VFlex
        v-for="(day, j) in days" :key="j"
        class="day-schedule"
      >
        <div class="day-schedule__dayname">
          {{ day.dayName }}
        </div>
        <div v-if="day.value">
          <div>
            {{ day.value.start }}
          </div>
          <div>
            {{ day.value.end }}
          </div>
        </div>
      </VFlex>
    </VLayout>
  </div>
</template>

<script>
import { scheduleMixin} from './mixins'

export default {
  mixins: [ scheduleMixin ],
  props: {
    captionClass: {
      type: String,
      default: ''
    },
    expanded: { type: Boolean, default: false }
  },
}
</script>

<style lang="scss">
  @import '../../assets/styles/day-schedule';

  .timeClass {
  font-size: 80%;
}
  .schedule {
    &__header {
      width: 284px;
      padding: 11px 17px 10px 36px;
      border-radius: 20px;
      cursor: pointer;
      background: rgba(137, 149, 175, 0.1);
    }

    &__container {
      padding: 10px 0 37px;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background: rgba(137, 149, 175, 0.1);
    }

    &._expanded {
      .schedule__header {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

  }
</style>

