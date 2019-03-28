<template>
  <div class="service-card" @click="$emit('click')">
    <div class="service-card__top">
      <div class="service-card__left">
        <h2 class="service-card__title">
          <span>{{ service.name.length > 70? service.name.substring(0, 70) + '...' : service.name }}</span>
        </h2>
        <div v-if="service.j.duration" class="service-card__subtitle">
          {{ service.j.duration }} мин.
        </div>
        <div v-if="service.j.price" class="service-card__subtitle">
          {{ service.j.price }} р.
        </div>
      </div>
    </div>
    <div class="service-card__bottom">
      <div>
        <div v-if="service.j.employees" class="service-card__info">
          {{ service.j.employees }} мастеров
        </div> <!-- todo добавить склонение слова сотрудников -->
      </div>
      <!--<DeleteButton @click.native.stop="emit('delete')" />-->
    </div>
  </div>
</template>

<script>

export default {
  props: {
    access: { type: Boolean, default: false },
    editMode: { type: Boolean, default: false },
    employee: { type: String, default: undefined },
    employeeName: { type: String, default: undefined },
    service: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      edit: false
    }
  },
  watch: {
    editMode: 'onInit'
  },
  mount () {
    this.onInit()
  },
  methods: {
    onInit () {
      console.log(this.editMode)
      this.edit = this.editMode
    },
    onDelete () {
      this.edit = false
      this.$emit('onDelete')
    },
    onSave (payload) {
      this.edit = false
      this.$emit('onSave', payload)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-value {
  padding-left: 0.5em;
  padding-right: 0.2em;
}

.service-card {
  width: 312px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
  padding: 17px 4px 8px 24px;
  border-top: 2px solid  transparent;
  box-shadow: 0px 0px 2px rgba(137, 149, 175, 0.35);
  transition: border-color 0.4s 0s;
  box-sizing: border-box;
  &:hover {
    border-color: #5699FF;
    cursor: pointer;
  }
  &__top,
  &__bottom {
    display: flex;
    justify-content: space-between;
  }
  &__top {
    font-family: Lato, sans-serif;
    font-style: normal;
    line-height: normal;
  }
  &__bottom {
    align-items: center;
  }
  &__left {
    max-width: 85%;
  }
  &__title {
    font-weight: bold;
    font-size: 18px;
    color: #07101C;
  }
  &__main {
    display: inline-block;
    vertical-align: baseline;
    margin-right: 6px;
  }
  &__subtitle {
    font-weight: normal;
    font-size: 12px;
    color: #8995AF;
  }
  &__info {
    width: 125px;
    height: 24px;
    padding: 2px 0 0;
    background: rgba(137, 149, 175, 0.1);
    border-radius: 12px;
    color: #8995AF;
    text-align: center;
  }
}
</style>

