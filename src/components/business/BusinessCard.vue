<template>
  <div class="infocard _view">
    <div class="infocard__content">
      <VLayout
        align-center justify-center column
      >
        <div>
          <Avatar
            size="12em"
            :src="avatar"
            :is-company-avatar="true"
            :name="businessInfo.name"
          />
        </div>
        <VLayout column>
          <div>
            <div class="infocard__field-title">
              Название
            </div>
            <div class="infocard__field-value">
              {{ title }}
            </div>
            <div class="infocard__field-title">
              ИНН
            </div>
            <div class="infocard__field-value">
              {{ INN }}
            </div>
          </div>
          <div v-if="address">
            <div class="infocard__field-title">
              Адрес
            </div>
            <div class="infocard__field-value">
              {{ address.name }}{{ office? ', оф. ' + office : '' }}
            </div>
          </div>

          <div v-if="phones && phones.length" class="top-bordered">
            <div
              v-for="(item, i) in phones"
              :key="i"
              class="infocard__field-value"
            >
              <PhoneView :phone="item" />
            </div>
          </div>
          <div v-if="businessInfo.j && businessInfo.j.schedule">
            <BusinessSchedule
              :caption-class="captionClass"
              :week-schedule="businessInfo.j.schedule"
              :expanded="expanded"
              @toggleSchedule="expanded = !expanded"
            />
          </div>
          <div v-if="businessInfo.j && businessInfo.j.links" class="soc">
            <div v-if="businessInfo.j.links.instagram" class="soc__value _ig">
              {{ businessInfo.j.links.instagram }}
            </div>
            <div v-if="businessInfo.j.links.vk" class="soc__value _vk">
              {{ businessInfo.j.links.vk }}
            </div>
            <div v-if="businessInfo.j.links.others && businessInfo.j.links.others.length">
              <div
                v-for="(site, ind) in businessInfo.j.links.others"
                :key="ind"
              >
                <div
                  v-if="site.uri"
                  class="soc__value"
                >
                  {{ site.uri }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="businessInfo.j && businessInfo.j.description">
            <div class="infocard__field-title top-bordered">
              Описание
            </div>
            <div class="infocard__field-value _description">
              {{ businessInfo.j.description }}
            </div>
          </div>
        </VLayout>
      </VLayout>
    </div>
  </div>
</template>

<script>
import BusinessSchedule from '@/components/business/BusinessSchedule.vue'
import Avatar from '@/components/avatar/Avatar.vue'
import { businessMixins } from '@/components/business/mixins'
import PhoneView from '@/components/common/PhoneView.vue'

export default {
  components: {
    BusinessSchedule,
    PhoneView,
    Avatar
  },
  mixins: [businessMixins],
  props: {
    businessInfo: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      captionClass:
        'caption font-weight-bold text-no-wrap grey--text text--lighten-1',
      expanded: false
    }
  },
  computed: {
    address () {
      if (!(this.businessInfo && this.businessInfo.j)) {
        return
      }
      return this.businessInfo.j.address
    },
    avatar () {
      if (!(this.businessInfo && this.businessInfo.j)) {
        return
      }
      return this.businessInfo.j.avatar
    },
    category () {
      if (!(this.businessInfo && this.businessInfo.j)) {
        return
      }
      return this.businessInfo.j.category
    },
    phones () {
      if (!(this.businessInfo && this.businessInfo.j)) {
        return
      }
      return this.businessInfo.j.phones
    },
    office () {
      if (!(this.businessInfo && this.businessInfo.j)) {
        return
      }
      return this.businessInfo.j.office
    },
    siteLink () {
      if (!this.businessInfo.j.site) {
        return
      }
      return this.prependHttpToUrl(this.businessInfo.j.site)
    },
    title () {
      if (!(this.businessInfo && this.businessInfo.j)) {
        return
      }
      return this.businessInfo.j.name
    },
    INN () {
      return this.businessInfo && this.businessInfo.j && this.businessInfo.j.inn
    },
  },
  methods: {
  }
}
</script>

<style lang="scss">
  @import '../../assets/styles/infocard';
</style>
