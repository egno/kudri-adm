<template>
  <VCard>
    <VLayout
      justify-start
      row
      wrap
    >
      <VFlex
        xs12
        sm4
        md3
      >
        <VCardTitle>
          <UserAvatar
            size="12em"
            :src="avatar"
          />
        </VCardTitle>
      </VFlex>
      <VFlex
        xs12
        sm8
        md9
      >
        <VLayout column>
          <VFlex>
            <VCardTitle primary-title>
              <div>
                <div>
                  <span class="headline">
                    {{ title }}
                  </span>
                  <br>
                  <span class="font-weight-medium grey--text">
                    {{ category }}
                  </span>
                </div>
              </div>
            </VCardTitle>
          </VFlex>
          <VFlex v-if="address">
            <BusinessAddress
              :caption-class="captionClass"
              :address="address"
            />
          </VFlex>
          <VFlex v-if="phones.length">
            <BusinessPhones
              :caption-class="captionClass"
              :phones="phones"
            />
          </VFlex>
          <VFlex v-if="data.j && data.j.site">
            <div>
              <span :class="captionClass">
                Сайт
              </span>&nbsp;
              <span>
                <a
                  :href="siteLink"
                  target="_blank"
                >
                  {{ data.j.site }}
                </a>
              </span>
            </div>
          </VFlex>
          <VFlex v-if="data.j && data.j.links">
            <SocialLinks :links="data.j.links" />
          </VFlex>
          <VFlex v-if="data.j && data.j.schedule">
            <BusinessSchedule
              :caption-class="captionClass"
              :schedule="data.j.schedule"
            />
          </VFlex>
        </VLayout>
      </VFlex>
    </VLayout>
    <VCardActions>
      <VSpacer />
      <VBtn
        v-if="data.access"
        color="primary"
        @click="onEditClick"
      >
        Редактировать
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script>
import Business from '@/classes/business'
import BusinessAddress from '@/components/business/BusinessAddress.vue'
import BusinessPhones from '@/components/business/BusinessPhones.vue'
import BusinessSchedule from '@/components/business/BusinessSchedule.vue'
import SocialLinks from '@/components/business/SocialLinks.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import { businessMixins } from '@/components/business/mixins'
import { makeAlert } from '@/api/utils'

export default {
  components: {
    BusinessAddress,
    BusinessPhones,
    BusinessSchedule,
    SocialLinks,
    UserAvatar
  },
  mixins: [businessMixins],
  props: {
    business: {
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
      if (!(this.data && this.data.j)) {
        return
      }
      return this.data.j.address
    },
    avatar () {
      if (!(this.data && this.data.j)) {
        return
      }
      return this.data.j.avatar
    },
    category () {
      if (!(this.data && this.data.j)) {
        return
      }
      return this.data.j.category
    },
    siteLink () {
      if (!this.data.j.site) {
        return
      }
      return this.prependHttpToUrl(this.data.j.site)
    },
    title () {
      if (!(this.data && this.data.j)) {
        return
      }
      return this.data.j.name
    }
  },
  watch: {
    id: 'fetchData'
  },
  mounted () {
    this.fetchData()
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

<style>
a {
  text-decoration: none;
}
</style>
