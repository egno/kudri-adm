<template>
  <div class="service-card" @click="$emit('click')">
    <div class="service-card__top">
      <div class="service-card__left">
        <h2 class="service-card__title">
          <span>{{ service.name.length > 70? service.name.substring(0, 70) + '...' : service.name }}</span>
        </h2>
        <div v-if="service.j.duration" class="service-card__subtitle _duration">
          {{ service.j.duration }} мин.
        </div>
        <div v-if="service.j.price" class="service-card__subtitle _price">
          {{ service.j.price }} р.
        </div>
      </div>
    </div>
    <div class="service-card__bottom">
      <div>
        <div v-if="service.j.employees && service.j.employees.length" class="service-card__info">
          {{ service.j.employees.length }} мастеров
        </div> <!-- todo добавить склонение слова сотрудников -->
      </div>
      <DeleteButton @click.native.stop="$emit('delete')" />
    </div>
  </div>
</template>

<script>
import DeleteButton from '@/components/common/DeleteButton'

export default {
  components: { DeleteButton },
  props: {
    access: { type: Boolean, default: false },
    editMode: { type: Boolean, default: false },
    service: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
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
  margin: 0 10px 20px 0;
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
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 18px;
    color: #07101C;
    text-transform: capitalize;
  }
  &__main {
    display: inline-block;
    vertical-align: baseline;
    margin-right: 6px;
  }
  &__subtitle {
    margin-bottom: 9px;
    padding-left: 20px;
    font-weight: normal;
    font-size: 12px;
    color: #8995AF;
    
    &._duration {
      background: url('../../assets/images/clock.png') left center no-repeat;
    }
    &._price {
      background: url('../../assets/images/rub.png') left center no-repeat;
    }
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

