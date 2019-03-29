<template>
  <v-expand-x-transition>
    <div v-show="visible" class="edit-service">
      <VForm class="edit-service__container">
        <button type="button" class="edit-service__close" @click="$emit('close')" />
        <div class="edit-service__content">
          <div class="edit-service__header">
            {{ create? 'Создать услугу' : 'Редактировать услугу' }}
          </div>

          <VTextField v-model="name" placeholder="НАЗВАНИЕ УСЛУГИ" />

          <VSelect v-model="category" :items="serviceGroups" placeholder="ВЫБЕРИТЕ КАТЕГОРИЮ" />

          <div class="edit-service__field-name">
            Пол
          </div>
          <input id="male" v-model="sex" name="sex" type="radio" value="male"><label for="male" class="edit-service__radio">Муж</label>
          <input id="female" v-model="sex" name="sex" type="radio" value="female" class="filters__item"><label for="female" class="edit-service__radio">Жен</label>
          <input id="child" v-model="sex" name="sex" type="radio" value="child" class="filters__item"><label for="child" class="edit-service__radio">Дети</label>

          <div class="edit-service__field-name">
            Цена
          </div>
          <div>от </div>
          <VTextField v-model="price" mask="######" />

          <div class="edit-service__field-name">
            Длительность (мин)
          </div>
          <VTextField v-model="duration" mask="###" />

          <VSelect
            v-model="selectedEmployees"
            :items="employees"
            item-text="j.surname"
            multiple
            placeholder="ВЫБЕРИТЕ МАСТЕРОВ"
          />

          <VTextarea v-model="description" placeholder="ОПИСАНИЕ" counter="400" />

          <div class="edit-service__buttons">
            <button type="button" class="edit-service__save" @click="$emit('save')">
              Сохранить
            </button>
            <template v-if="!create">
              <button type="button" class="edit-service__cancel" @click="$emit('cancel')">
                Отмена
              </button>
              <button type="button" class="edit-service__delete" @click="$emit('delete')">
                Удалить услугу
              </button>
            </template>
          </div>
        </div>
      </VForm>
    </div>
  </v-expand-x-transition>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      create: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        name: '',
        category: '',
        sex: '',
        price: '',
        duration: 0,
        description: '',
        selectedEmployees: []
      }
    },
    computed: {
      ...mapGetters(['serviceGroups', 'employees']),
    },
  }
</script>

<style lang="scss">
  @import "../../assets/styles/common";
  %button {
    height: 56px;
    padding: 0 28px;
    font-family: Roboto Slab;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: background-color 0.4s 0s, color 0.4s 0s;
    outline: none;
  }

  .edit-service {
    position: fixed;
    right: 0;
    margin: 0;
    top: 0;
    bottom: 0;
    width: 440px;
    height: 100vh;
    background-color: #fff;
    text-align: center;
    font-family: $lato;
    z-index: 1000;

    &__container {
      position: relative;
      padding: 53px 62px 56px;
      text-align: center;
    }
    &__close {
      position: absolute;
      top: 21px;
      left: 21px;
      width: 14px;
      height: 14px;
      background: url('../../assets/images/svg/cross.svg') center no-repeat;
      outline: none;
    }
    &__header {
      font-family: Roboto Slab, serif;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 24px;
      text-align: center;
      color: #07101C;
    }
    input {
      text-align: center;
    }
    input[type="radio"] {
      display: none;
    }
    &__field-name {
      font-weight: bold;
      font-size: 16px;
    }
    &__radio {
      @extend %filter;
      display: inline-block;
      height: 28px;
      padding: 0 10px;
    }

    input[type="radio"]:checked + label {
      @extend %filter-active
    }

    &__save {
      @extend %button;
      color: #FFFFFF;
      background: linear-gradient(270deg, #C9A15D -9.86%, #BA9462 103.49%);
      &:hover {
        background: #07101C;
      }
    }
    &__cancel {
      @extend %button;
      color: #8995AF;
      &:hover {
        color: #07101C;
      }
    }

  }
</style>
