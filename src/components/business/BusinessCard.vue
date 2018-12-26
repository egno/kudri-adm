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
          <VFlex>
            <BusinessAddress
              :caption-class="captionClass"
              :address="address"
            />
          </VFlex>
          <VFlex>
            <BusinessPhones
              :caption-class="captionClass"
              :phones="phones"
            />
          </VFlex>
          <VFlex v-if="data.data && data.data.site">
            <div>
              <span :class="captionClass">
                Сайт
              </span>&nbsp;
              <span>
                <a
                  :href="siteLink"
                  target="_blank"
                >
                  {{ data.data.site }}
                </a>
              </span>
            </div>
          </VFlex>
          <VFlex v-if="data.data && data.data.links">
            <SocialLinks :links="data.data.links" />
          </VFlex>
          <VFlex v-if="data.data && data.data.schedule">
            <BusinessSchedule
              :caption-class="captionClass"
              :schedule="data.data.schedule"
            />
          </VFlex>
        </VLayout>
      </VFlex>
    </VLayout>
    <VCardActions>
      <VSpacer />
      <VBtn
        color="primary"
        @click="onEditClick"
      >
        Редактировать
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script>
import BusinessAddress from '@/components/business/BusinessAddress.vue';
import BusinessPhones from '@/components/business/BusinessPhones.vue';
import BusinessSchedule from '@/components/business/BusinessSchedule.vue';
import SocialLinks from '@/components/business/SocialLinks.vue';
import UserAvatar from '@/components/avatar/UserAvatar.vue';
import Api from '@/api/backend';
import { businessMixins } from '@/components/business/mixins';

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
    id: { type: String, default: null },
    business: {
      type: Object,
      default() {
        return {};
      }
    },
    edit: { type: Boolean, default: false }
  },
  data() {
    return {
      data: {},
      captionClass:
        'caption font-weight-bold text-no-wrap grey--text text--lighten-1'
    };
  },
  computed: {
    address() {
      if (!(this.data && this.data.data)) {
        return;
      }
      return this.data.data.address;
    },
    avatar() {
      if (!(this.data && this.data.data)) {
        return;
      }
      return this.data.data.avatar;
    },
    category() {
      if (!(this.data && this.data.data)) {
        return;
      }
      return this.data.data.category;
    },
    siteLink() {
      if (!this.data.data.site) {
        return;
      }
      return this.appendHttpToUrl(this.data.data.site);
    },
    title() {
      if (!(this.data && this.data.data)) {
        return;
      }
      return this.data.data.name;
    }
  },
  watch: {
    id: 'fetchData'
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onEditClick() {
      this.$emit('onEditClick');
    },
    fetchData() {
      if (this.id === 'new') {
        return;
      }
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.data = res;
        });
    }
  }
};
</script>

<style>
a {
  text-decoration: none;
}
</style>
