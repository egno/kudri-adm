<template>
  <VCard
    :hover="item.access"
    :to="{name:'employeeFull', params: {employee: item.id}}"
  >
    <v-responsive min-height="5em">
      <div
        v-if="photo"
        class="card-image"
      >
        <v-img
          :src="photo"
          width="5em"
          aspect-ratio="1"
        />
      </div>
      <v-container
        v-if="!photo"
        pa-3
      >
        <UserAvatar
          class="ma-1"
          :name="item.j && item.j.name || item.j.email"
          :src="avatar"
        />
      </v-container>
      <div class="card-title">
        <v-container
          fill-height
          px-1
          py-2
        >
          <VLayout
            align-left
            row
            spacer
            pl-2
          >
            <VFlex xs12>
              <VLayout
                column
                align-space-around
                fill-height
                justify-center
              >
                <VFlex pa-0>
                  <div class="caption grey--text text--darken-1">
                    {{ item.j && item.j.category }}
                  </div>
                </VFlex>
                <VFlex pa-0>
                  <h4>{{ fullName(item) }}</h4>
                </VFlex>
                <VFlex pa-0>
                  <v-rating
                    :value="item.j.rating"
                    readonly
                    color="amber"
                    background-color="grey"
                    dense
                    half-increments
                    size="12"
                  />
                </VFlex>
              </VLayout>
              <div />
            </VFlex>
          </VLayout>
        </v-container>
      </div>
    </v-responsive>
    <v-divider />
    <VCardText>
      <div>
        <span :class="captionClass">
          Услуги: {{ servicesCount || '-' }}
        </span>
        <div
          v-for="(service, i) in item.j && item.j.services"
          v-show="(i < displayItemsCount)"
          :key="i"
        >
          {{ service.name || service }}
        </div>
        <div v-if="servicesCount > displayItemsCount">
          ...
        </div>
      </div>
      <BusinessSchedule
        v-if="item.j && item.j.schedule"
        :caption-class="captionClass"
        :schedule="item.j.schedule"
      />
      <span />
      {{ item.j.note }}
    </VCardText>
  </VCard>
</template>

<script>
import BusinessSchedule from '@/components/business/BusinessSchedule.vue';
import UserAvatar from '@/components/avatar/UserAvatar.vue';
import { fullName } from '@/components/business/utils';
import { imagePath } from '@/components/gallery/utils';

export default {
  components: { BusinessSchedule, UserAvatar },
  props: {
    displayItemsCount: { type: Number, default: 5 },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      captionClass:
        'caption font-weight-bold text-no-wrap grey--text text--darken-1'
    };
  },
  computed: {
    avatar() {
      return this.item && (this.item.j && this.item.j.avatar);
    },
    photo() {
      return (
        this.item &&
        imagePath(this.item.j && this.item.j.image, this.item.parent)
      );
    },
    servicesCount() {
      return (
        this.item &&
        this.item.j &&
        this.item.j.services &&
        this.item.j.services.length
      );
    }
  },
  methods: {
    fullName(emp) {
      return fullName(emp);
    },
    onDelete() {
      this.$emit('onDelete', this.item);
    },
    onSave(payload) {
      this.$emit('onSave', payload);
    }
  }
};
</script>

<style scoped>
.card-title {
  position: absolute;
  width: calc(100% - 5.5em);
  top: 0;
  left: 5.5em;
  height: 5em;
}
.v-rating {
  height: 1em;
  margin-bottom: -1em;
}
</style>
