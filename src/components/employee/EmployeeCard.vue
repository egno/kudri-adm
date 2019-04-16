<template>
  <div class="employee-card" @click="$emit('click')">
    <div class="employee-card__top">
      <Avatar
        class="employee-card__avatar"
        :name="employee.j && employee.j.name || employee.j.email"
        :src="avatar"
        size="80px"
      />
      <div class="employee-card__badge">
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
        <div class="employee-card__info">
          {{ servicesCount | formatServices }}
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
import { conjugateServices } from '@/components/utils'

export default {
  components: { Avatar, DeleteButton },
  filters: {
    formatServices (n) {
      return conjugateServices(n)
    }
  },
  props: {
    employee: {
      type: Object,
      default: () => {
        return {}
      }
    },
    servicesCount: {
      type: Number,
      default: 0
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

<style lang="scss">
  @import '../../assets/styles/employee-card.scss';
</style>
