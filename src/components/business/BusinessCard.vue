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
            </div> <!--description-->
          </div>
        </VLayout>
      </VLayout>
    </div>
    <!--<VCardActions>
      <VSpacer />
      <VBtn
        v-if="data.access"
        color="primary"
        @click="onEditClick"
      >
        Редактировать
      </VBtn>
    </VCardActions>-->
  </div>
</template>

<script>
import Business from '@/classes/business'
import BusinessSchedule from '@/components/business/BusinessSchedule.vue'
import SocialLinks from '@/components/business/SocialLinks.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { businessMixins } from '@/components/business/mixins'
import { makeAlert } from '@/api/utils'

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
    edit: { type: Boolean, default: false }
  },
  data () {
    return {
      data: new Business(this.business),
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
    onEditClick () {
      this.$emit('onEditClick')
    },
    fetchData () {
      if (this.id === 'new') {
        return
      }
      this.data.load(this.id)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        this.alert(makeAlert(err))
      })
    }
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
