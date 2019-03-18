<template>
  <div class="card">
    <div class="card__content">
      <VLayout
        align-center justify-center column
      >
        <div>
          <UserAvatar
            size="12em"
            :src="avatar"
          />
        </div>
        <VLayout column>
          <div>
            <div class="businesscard__field-title">
              Название
            </div>
            <div class="businesscard__field-value">
              {{ title }}
            </div>
            <div class="businesscard__field-title">
              ИНН
            </div>
            <div class="businesscard__field-value">
              {{ }}
            </div>
          </div>
          <div v-if="address" class="bottom-bordered">
            <div class="businesscard__field-title">
              Адрес
            </div>
            <div class="businesscard__field-value">
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
              :schedule="businessInfo.j.schedule"
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
            <div class="businesscard__field-title">
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
        'caption font-weight-bold text-no-wrap grey--text text--lighten-1'
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
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/businesscard-form';

  a {
    text-decoration: none;
  }

  .card {
    &__content {
      padding: 30px 45px 60px;
      @media only screen and (min-width : $desktop) {
        width: 524px;
        padding: 40px 120px 60px;
        box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
      }
    }
  }

</style>
