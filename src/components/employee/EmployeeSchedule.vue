<template>
  <div>
    <BusinessScheduleEdit
      :schedule="item.j.schedule"
      @onEdit="scheduleEdit"
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
    scheduleEdit () {}
  }
}
</script>
