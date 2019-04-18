<template>
  <div>
    <div v-show="!showServices">
      <h2 class="employee-services__title">
        Выберите категории услуг, которые вы предоставляете
      </h2>
      <div class="employee-services__categories">
        <AppCheckbox
          v-for="(category, i) in businessServiceCategories"
          :id="category"
          :key="i"
          :checked="selectedServiceGroups.includes(category)"
          :label="category"
          name="service_category"
          :value="category"
          @change="onGroupsChange(category, $event)"
        />
      </div>
      <MainButton
        color="success"
        class="businesscard-form__next"
        :class="{ button_disabled: !selectedServiceGroups.length }"
        @click.native.prevent="showServices = true"
      >
        К услугам
      </MainButton>
    </div>
    <div v-show="showServices">
      <div class="employee-services__header">
        <div class="employee-services__left">
          <h2 class="employee-services__title">
            Выберите предоставляемые услуги из категории
            {{ selectedServiceGroups[currentStep] }}
          </h2>
          <h3 class="employee-services__subtitle">
            Укажите минимум 1 услугу для каждой выбранной категории
          </h3>
        </div>
        <Steps
          :current-step="currentStep"
          :length="selectedServiceGroups.length"
          header="Категория"
          @changeStep="currentStep = $event"
        />
      </div>
      <div v-for="category in selectedServiceGroups" :key="category">
        <div v-show="category === selectedServiceGroups[currentStep]" class="employee-services__services">
          <ServiceCard
            v-for="(service, servInd) in businessServices.filter(
              s => s.j.group === category
            )"
            :key="servInd"
            :service="service"
            :edit-mode="false"
            :is-selected="selectedServices.includes(service)"
            @click="onSelect(service)"
          />
        </div>
      </div>
      <div>
        <MainButton
          color="success"
          class="businesscard-form__next"
          @click.native.prevent="showServices = false"
        >
          Назад к категориям
        </MainButton>
        <MainButton
          color="success"
          class="businesscard-form__next"
          :class="{
            button_disabled: !selectedServices.some(s => s.j.group === selectedServiceGroups[currentStep])
          }"
          @click.native.prevent="onNext"
        >
          Далее
        </MainButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ServiceCard from '@/components/services/ServiceCard.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import MainButton from '@/components/common/MainButton.vue'
import Steps from '@/components/common/Steps.vue'

export default {
  components: { AppCheckbox, MainButton, ServiceCard, Steps },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    employeeServices: {
      type: Array,
      default () {
        return []
      }
    },
    employeeServiceGroups: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      selectedServiceGroups: [],
      selectedServices: [],
      showServices: false,
      currentStep: 0
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices
    }),
    ...mapGetters(['businessServiceCategories']),
  },
  watch: {
    employeeServiceGroups: {
      handler: 'init',
      deep: true
    },
    employeeServices: {
      handler: 'init',
      deep: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.selectedServiceGroups = this.employeeServiceGroups.slice()
      this.selectedServices = this.employeeServices.slice()
    },
    onGroupsChange (category, selected) {
      if (selected) {
        this.selectedServiceGroups.push(category)
      } else {
        const i = this.selectedServiceGroups.indexOf(category)

        if (i > -1) {
          this.selectedServiceGroups.splice(i, 1)
          this.selectedServices = this.selectedServices.filter(s => this.selectedServiceGroups.includes(s.j.group))
        }
      }
    },
    onNext () {
      if (this.currentStep === this.selectedServiceGroups.length - 1) {
        this.$emit('selected', this.selectedServices)
      } else {
        this.currentStep++
      }
    },
    onSelect (service) {
      const i = this.selectedServices.indexOf(service)

      if (i > -1) {
        this.selectedServices.splice(i, 1)
      } else {
        this.selectedServices.push(service)
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/styles/common';

  .employee-services {
    &__header {
      font-family: $lato;
      text-align: center;

      @media only screen and (min-width: $desktop) {
        display: flex;
        justify-content: space-between;

      }
    }
    &__title {
      font-weight: bold;
      font-size: 16px;
      color: #07101C;
    }
    &__subtitle {
      font-weight: normal;
      font-size: 14px;
      color: #8995AF;
    }
    &__categories,
    &__services {
      margin-top: 40px;
    }
    &__services {
      padding: 25px 8px 0;
      border-top: 1px solid rgba(137, 149, 175, 0.1);
    }
  }
</style>
