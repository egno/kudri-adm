<template>
  <v-dialog :id="create? 'create': 'edit'" :value="visible" content-class="edit-service" transition="slide" @input="$emit('close')">
    <VForm ref="form" :value="!saveDisabled" class="edit-service__container" @input="$event && (error = '')">
      <button type="button" class="edit-service__close" @click="$emit('close')" />
      <div class="edit-service__content">
        <div class="edit-service__header">
          {{ create? 'Создать услугу' : 'Редактировать услугу' }}
        </div>

        <div class="edit-service__field-block _select">
          <SearchSelect
            :searching-value="name"
            :options="suggestedServiceNames"
            :required="true"
            label="НАЗВАНИЕ УСЛУГИ"
            @input="onInputName"
            @select="name = $event"
            @error="error = $event"
          />
        </div>

        <div class="edit-service__field-block _groups">
          <VSelect
            v-model="group"
            :items="serviceGroups"
            :item-text="servGr => servGr.name"
            label="КАТЕГОРИЯ"
            :rules="[ rules.required ]"
            :attach="create? '#create .edit-service__field-block._groups' : '#edit .edit-service__field-block._groups'"
            @blur="!group && (error = 'Необходимо заполнить все обязательные поля')"
          />
        </div>

        <div class="edit-service__field-block">
          <div class="edit-service__field-name">
            Пол
          </div>
          <input
            :id="create? 'male' : 'male2'"
            v-model="sex"
            type="checkbox"
            value="male"
            class="filters__item edit-service__sex"
          >
          <label :for="create? 'male' : 'male2'" class="edit-service__sex-label">Муж</label>
          <input
            :id="create? 'female' : 'female2'"
            v-model="sex"
            type="checkbox"
            value="female"
            class="filters__item edit-service__sex"
          >
          <label :for="create? 'female' : 'female2'" class="edit-service__sex-label">Жен</label>
          <input
            :id="create? 'child' : 'child2'"
            v-model="sex"
            type="checkbox"
            value="child"
            class="filters__item edit-service__sex"
          >
          <label :for="create? 'child' : 'child2'" class="edit-service__sex-label">Дети</label>
        </div>

        <div class="edit-service__field-block">
          <div class="edit-service__field-name">
            Цена
          </div>
          <div class="edit-service__row">
            <div class="edit-service__from">
              от
            </div>
            <VTextField v-model="price" mask="#####" class="edit-service__price" />
          </div>
        </div>

        <div class="edit-service__field-block">
          <div class="edit-service__field-name">
            Длительность (мин)
          </div>
          <Counter
            id="create? 'create-service-duration': 'edit-service-duration'"
            :value="duration"
            :min-value="15"
            :max-value="720"
            :interval="15"
            :class="{ _invalid: duration < 15 }"
            @changeCount="duration = $event"
          />
        </div>

        <div class="edit-service__field-block _employees">
          <v-combobox
            v-model="selectedEmployees"
            :items="employees"
            :item-text="employeeFullName"
            multiple
            placeholder="ВЫБЕРИТЕ МАСТЕРОВ"
            return-object
            chips
            deletable-chips
            :attach="create?'#create .edit-service__field-block._employees': '#edit .edit-service__field-block._employees'"
          />
        </div>

        <div class="edit-service__field-block">
          <VTextarea
            v-model="description"
            placeholder="ОПИСАНИЕ"
            counter="1000" rows="1"
            :auto-grow="true"
            @input.native="sliceByLength('description', 1000, $event)"
          />
        </div>

        <div v-if="error" class="edit-service__error">
          {{ error }}
        </div>

        <div v-if="errorMessage" class="edit-service__error">
          {{ errorMessage }}
        </div>

        <div class="edit-service__buttons">
          <button type="button" class="edit-service__save" :class="{ _disabled: saveDisabled }" @click="onSave">
            Сохранить
          </button>
          <template v-if="!create">
            <button type="button" class="edit-service__cancel" @click="$emit('close')">
              Отмена
            </button>
          </template>
        </div>
      </div>
    </VForm>
  </v-dialog>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import Counter from '@/components/common/Counter'
  import SearchSelect from '@/components/common/SearchSelect.vue'

  export default {
    components: {
      SearchSelect,
      Counter
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
      branchId: {
        type: String,
        default: '',
        required: true,
      },
      create: {
        type: Boolean,
        default: false,
        required: true
      },
      service: {
        type: Object,
        default () {
          return {
          }
        }
      },
      errorMessage: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        name: '',
        group: '',
        sex: [],
        price: '',
        duration: 15,
        description: '',
        selectedEmployees: [],
        rules: {
          required: value => !!value || 'Это поле обязательно для заполнения',
          maxLength: length => (value) => value && (value.length <= length || 'Слишком длинный текст') || true
        },
        employeeFullName (e) {
          return `${ e.j.name }${ e.j.surname? ' ' + e.j.surname : '' }`
        },
        error: '',
      }
    },
    computed: {
      ...mapState({ businessServices: state => state.business.businessServices }),
      ...mapGetters(['serviceList', 'serviceGroups', 'employees']),
      saveDisabled () {
        return !this.name || !this.group || !this.duration
      },
      suggestedServiceNames () {
        const base = this.serviceList.map(s => s.name)
        const company = this.businessServices.map(s => s.name)
        const branch = this.businessServices.filter(s => s.business_id === this.branchId).map(s => s.name)

        return [...new Set(base.concat(company))].filter(name => !branch.includes(name))
      }
    },
    watch: {
      'service': 'init',
      'visible': 'init'
    },
    methods: {
      sliceByLength (property, length, val) {
        if (val && val.length > length) {
          this[property] = val.substring(0, length)
        } else {
          this[property] = val
        }
      },
      init () {
        this.$refs.form.reset()
        if (!this.service || !this.service.j) {
          this.name = ''
          this.group = ''
          this.sex = []
          this.price = 0
          this.duration = 15
          this.description = ''
          return
        }
        let {
          group,
          sex,
          price,
          duration,
          description,
          employees
        } = this.service.j

        this.name = this.service.name
        this.group = group
        this.sex = sex || []
        this.price = price || 0
        this.duration = duration || 15
        this.description = description || ''
        this.selectedEmployees = employees 
      },
      onInputName (val) {
        this.sliceByLength('name', 150, val)
      },
      onSave () {
        let {
          name,
          group,
          sex,
          price,
          duration,
          description,
          selectedEmployees
        } = this.$data

        if (!sex.length) {
          sex = ['male', 'female', 'child']
        }

        this.$emit('save', {
          name,
          group,
          sex,
          price,
          duration,
          description,
          employees: selectedEmployees
        })
      },
    }
  }
</script>

<style lang="scss">
  @import "../../assets/styles/common";

  .slide-enter, .slide-leave-to {
    right: -440px !important;
  }

  %button {
    display: block;
    height: 56px;
    padding: 0 28px;
    margin: 0 auto;
    font-family: $roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: background-color 0.4s 0s, color 0.4s 0s;
    outline: none;
  }

  %button-disabled {
    background: rgba(137, 149, 175, 0.2) !important;
    pointer-events: none;
  }
  %placeholder {
    text-align: center;
    letter-spacing: 0.25em;
    color: rgba(7, 16, 28, 0.35);
    font-weight: 400;
    font-size: 12px;
    opacity: 1;
  }

  .edit-service {
    position: fixed;
    right: -400px;
    margin: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: 440px;
    height: 100vh;
    max-height: 100vh !important;
    background-color: #fff;
    text-align: center;
    font-family: $lato;
    z-index: 1000;
    overflow-y: auto;
    transition: right 0.3s linear;

    &.v-dialog--active {
      right: 0;
    }

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
    &__field-block {
      margin-top: 28px;
      padding-top: 20px;
      &._select .v-input__slot {
        margin-bottom: 0;
      }
    }
    input {
      text-align: center;
      padding-bottom: 6px;
      font-weight: 400;
    }
    .counter input {
      padding-bottom: 0;
    }
    &__sex {
      display: none;
    }

    &__field-name {
      margin-bottom: 14px;
      font-weight: bold;
      font-size: 16px;
    }
    &__sex-label {
      @extend %filter;
      display: inline-block;
      height: 28px;
      padding: 0 10px;
      margin-bottom: 15px;
    }
    &__from {
      @extend .edit-service__sex-label;
      margin-right: 19px;
      margin-bottom: 0;
      &::first-letter {
        text-transform: none;
      }
    }
    input[type="checkbox"]:checked + label {
      @extend %filter-active
    }
    &__row {
      display: flex;
      justify-content: center;
      align-items: baseline;
    }

    input::placeholder,
    textarea::placeholder {
      @extend %placeholder;
    }
    &__price {
      max-width: 140px;
    }
    &__buttons {
      margin-top: 31px;
    }
    &__save {
      @extend %button;
      width: 240px;
      color: #FFFFFF;
      background: linear-gradient(270deg, #C9A15D -9.86%, #BA9462 103.49%);
      &:hover {
        background: #07101C;
      }
      &._disabled {
        @extend %button-disabled
      }
    }
    &__cancel {
      @extend %button;
      color: #8995AF;
      margin-top: 40px;
      &:hover {
        color: #07101C;
      }
    }
    &__error {
      margin-top: 14px;
      font-family: $lato;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: normal;
      text-align: center;
      color: #EF4D37;
    }
    .counter {
      width: 122px;
      margin: 0 auto;
      &._invalid {
        .counter__control {
          background-color: #EF4D37;
        }
        input {
          color: #EF4D37;
        }
      }
    }
    .v-text-field {
      padding-top: 0;
    }
    .v-input {
      margin-top: 0;
    }
    .v-messages {
      display: none;
    }
    .v-label {
      @extend %placeholder;
      &.v-label--active {
        top: 0;
      }
    }
    .error--text {
      label {
        color: rgba(7, 16, 28, 0.35) !important;
      }
    }
    .v-input__slot {
      margin-bottom: 5px;
    }
    .v-counter {
      color: rgba(137, 149, 175, 0.35);
    }
    .v-select__selections>div{
      text-align: right;
      justify-content: flex-end;
      flex-grow: 1;
    }

    ._employees {
      position: relative;
      .v-select__selections>div {
        @extend %placeholder;
      }
      .filters__item {
        display: inline-block;
        width: auto;
        margin: 0 12px 16px 0;
        padding: 0 25px 0 12px;
        background: url('../../assets/images/svg/cross.svg') right center no-repeat rgba(137, 149, 175, 0.1);
      }
      .v-menu__content {
        top: 100% !important;
      }
    }
    ._groups {
      position: relative;
      .v-menu__content {
        top: 100% !important;
      }
    }
    .v-select__selection {
      font-size: 14px;
    }

    .v-list {
      background-color: rgba(137, 149, 175, 0.1);
    }
    .v-list__tile {
      height: auto;
      padding: 0;
      &:hover {
        background: rgba(137, 149, 175, 0.2);
      }
    }
    .v-list__tile__content {
      height: auto;
      padding: 6px 0 5px 32px;

    }
    .v-list__tile__title {
      height: auto;
      color: #8995AF;
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: normal;
    }

  }
</style>
