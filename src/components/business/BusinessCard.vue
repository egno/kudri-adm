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

          <div v-if="phones.length">
            <div
              v-for="(item, i) in phones"
              :key="i"
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
            <SocialLinks :links="businessInfo.j.links" />
          </div>
          <div v-if="businessInfo.j && businessInfo.j.site">
            <div>
              <span :class="captionClass">
                Сайт
              </span>&nbsp;
              <span>
                <a
                  :href="siteLink"
                  target="_blank"
                  class
                >
                  {{ businessInfo.j.site }}
                </a>
              </span>
            </div>
          </div>
          <div>
            <div class="businesscard-form__field-title">
              Описание
            </div>
            <div class="">
              {{ }}
            </div> <!--todo add description-->
          </div>
        </VLayout>
      </VLayout>
    </div>
  </div>
</template>

<script>
import BusinessSchedule from '@/components/business/BusinessSchedule.vue'
import SocialLinks from '@/components/business/SocialLinks.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { businessMixins } from '@/components/business/mixins'

export default {
  components: {
    BusinessSchedule,
    SocialLinks,
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

</style>
