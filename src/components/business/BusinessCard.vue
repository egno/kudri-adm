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
          <VImg
            :src="avatarURL"
            height="12em"
            aspect-ratio="1"
            max-width="12em"
          />
        </VCardTitle>
      </VFlex>
      <VFlex
        10
        xs12
        sm8
        md9
      >
        <VLayout column>
          <VFlex>
            <VCardTitle primary-title>
              <div>
                <div class="headline">
                  {{ title }}
                </div>
              </div>
            </VCardTitle>
          </VFlex>
          <VFlex>
            <BusinessAddress :address="address" />
          </VFlex>
          <VFlex>
            <BusinessPhones :phones="phone" />
          </VFlex>
        </VLayout>
      </VFlex>
    </VLayout>
  </VCard>
</template>

<script>
import BusinessAddress from '@/components/business/BusinessAddress.vue';
import BusinessPhones from '@/components/business/BusinessPhones.vue';
import Api from '@/api/backend';

export default {
  components: {
    BusinessAddress,
    BusinessPhones
  },
  props: {
    id: { type: String, default: null },
    business: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      data: {}
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
    avatarURL() {
      if (!this.avatar) {
        return;
      }
      return `${process.env.VUE_APP_IMAGES || ''}${this.avatar}`;
    },
    phone() {
      if (!(this.data && this.data.data)) {
        return;
      }
      if (typeof this.data.data.phone === 'string') {
        return [this.data.data.phone];
      }
      return this.data.data.phone;
    },
    title() {
      if (!(this.data && this.data.data)) {
        return;
      }
      return this.data.data.name;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      if (!this.id) {
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
