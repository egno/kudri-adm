<template>
  <div>
    <BusinessScheduleEdit
      :schedule="item.j.schedule"
      @editWeek="scheduleEdit"
    />
  </div>
</template>

<script>
import BusinessScheduleEdit from '@/components/business/BusinessScheduleEdit.vue'
export default {
  components: { BusinessScheduleEdit },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    scheduleEdit (newWeek) {
      this.item.j.schedule = newWeek
      this.schedule = newWeek
      this.hasSchedule = this.checkSchedule()
      this.$emit('formChange')
    }
  }
}
</script>
