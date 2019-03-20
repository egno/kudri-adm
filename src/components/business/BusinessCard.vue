<template>
  <div class="infocard">
    <div class="infocard__content">
      <VLayout
        align-center justify-center column
      >
        <div>
          <UserAvatar
            size="12em"
            :src="avatar"
          />
        </div>
        <VLayout column class="businesscard-form">
          <div>
            <div class="businesscard-form__field-title">
              Название
            </div>
            <div class="businesscard-form__field-value">
              {{ title }}
            </div>
            <div class="businesscard-form__field-title">
              ИНН
            </div>
            <div class="businesscard-form__field-value">
              {{ INN }}
            </div>
          </div>
          <div v-if="address" class="bottom-bordered">
            <div class="businesscard-form__field-title">
              Адрес
            </div>
            <div class="businesscard-form__field-value">
              {{ address && address.name }}
            </div>
          </div>

          <div v-if="phones.length" class="businesscard-form__field-value">
            <div
              v-for="(item, i) in phones"
              :key="i"
              class="businesscard__phone"
            >
              <span>
                {{ item | phone }}
              </span>
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
          <div v-if="businessInfo.j && businessInfo.j.links">
            <div v-if="businessInfo.j.links.instagram" class="soc _ig">
              {{ businessInfo.j.links.instagram }}
            </div>
            <div v-if="businessInfo.j.links.vk" class="soc _vk">
              {{ businessInfo.j.links.vk }}
            </div>
            <div v-if="businessInfo.j.links.others && businessInfo.j.links.others.length">
              <div
                v-for="(site, ind) in businessInfo.j.links.others"
                :key="ind"
              >
                <div
                  v-if="site.uri"
                  class="soc"
                >
                  {{ site.uri }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="businessInfo.j && businessInfo.j.description">
            <div class="businesscard-form__field-title">
              Описание
            </div>
            <div class="">
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
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { businessMixins } from '@/components/business/mixins'

export default {
  components: {
    BusinessSchedule,
    UserAvatar
  },
  filters: {
    phone (value) {
      if (!value) return ''
      return value.replace(
        /(\d?)(\d{1,3})(\d{1,3})(\d{1,4})$/g,
        '+$1($2)$3-$4'
      )
    }
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

<style lang="scss" scoped>
  @import '../../assets/styles/businesscard-form';
  @import '../../assets/styles/infocard';

  a {
    text-decoration: none;
  }

  .soc {
    position: relative;
    padding: 22px 0 0 30px;
    &:before {
      position: absolute;
      width: 18px;
      height: 18px;
      top: 22px;
      left: 0;
      content: '';
      background: url('../../assets/sllink.svg') no-repeat center center;
      background-size: 18px;
    }
    &._ig {
      &:before {
        background: url('../../assets/images/svg/igg.svg') no-repeat center center;
      }
    }
    &._vk {
      &:before {
        background: url('../../assets/images/svg/vkk.svg') no-repeat center center;
      }
    }
  }
</style>
