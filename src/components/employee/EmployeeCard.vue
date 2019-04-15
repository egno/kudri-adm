<template>
  <div class="employee-card" @click="$emit('click')">
    <div class="employee-card__top">
      <Avatar
        class="ma-1"
        :name="employee.j && employee.j.name || employee.j.email"
        :src="avatar"
      />
      <div class="employee-card__left">
        <h2 class="employee-card__title">
          <span>{{ employee.j.name.length > 70? employee.j.name.substring(0, 70) + '...' : employee.j.name }}</span>
        </h2>
        <div v-if="employee.j.category" class="employee-card__subtitle">
          {{ employee.j && employee.j.category }}
        </div>
      </div>
    </div>
    <div class="employee-card__bottom">
      <div>
        <div v-if="employee.j.services && employee.j.services.length" class="employee-card__info">
          {{ servicesCount }}
        </div>
      </div>
      <DeleteButton :is-dark="true" @click.native.stop="$emit('delete')" />
    </div>
  </div>
</template>

<script>
// import BusinessSchedule from '@/components/business/BusinessSchedule.vue'
import Avatar from '@/components/avatar/Avatar.vue'
import { fullName } from '@/components/business/utils'
import { imagePath } from '@/components/gallery/utils'
import DeleteButton from '@/components/common/DeleteButton'

export default {
  components: { Avatar, DeleteButton },
  props: {
    displayemployeesCount: { type: Number, default: 5 },
    employee: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      captionClass:
        'caption font-weight-bold text-no-wrap grey--text text--darken-1'
    }
  },
  computed: {
    avatar () {
      return this.employee && (this.employee.j && this.employee.j.avatar)
    },
    photo () {
      return (
        this.employee &&
        imagePath(this.employee.j && this.employee.j.image, this.employee.parent)
      )
    },
    servicesCount () {
      return (
        this.employee &&
        this.employee.j &&
        this.employee.j.services &&
        this.employee.j.services.length
      )
    }
  },
  methods: {
    fullName (emp) {
      return fullName(emp)
    },
    onSave (payload) {
      this.$emit('onSave', payload)
    }
  }
}
</script>

<style>
  @import '../../assets/styles/employee-card.scss';
</style>
