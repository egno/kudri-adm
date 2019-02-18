<template>
  <VCard
    :hover="item.access"
    :to="{name:'employeeFull', params: {employee: item.id}}"
  >
    <v-card-title>
      <UserAvatar
        class="ma-1"
        :name="item.j && item.j.name || item.j.email"
        :src="item.j && item.j.avatar"
      />
      <div>
        <VLayout
          align-left
          row
          spacer
          pl-2
        >
          <VFlex xs12>
            <div>
              <div class="caption grey--text text--darken-1">
                {{ item.j && item.j.category }}
              </div>
              <h4>{{ fullName(item) }}</h4>
            </div>
          </VFlex>
        </VLayout>
      </div>
    </v-card-title>
    <VCardText>
      <div>
        <span :class="captionClass">
          Услуги:
        </span>
        <div
          v-for="(service, i) in item.j && item.j.services"
          :key="i"
        >
          {{ service.name || service }}
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
    <v-responsive>
      <VLayout>
        <VFlex pa-3>
          <GalleryTiles
            :employee="item.id"
            :rows="1"
            fixed
          />
        </VFlex>
      </VLayout>
    </v-responsive>
  </VCard>
</template>

<script>
import BusinessSchedule from '@/components/business/BusinessSchedule.vue';
import UserAvatar from '@/components/avatar/UserAvatar.vue';
import { fullName } from '@/components/business/utils';
import GalleryTiles from '@/components/gallery/GalleryTiles.vue';

export default {
  components: { BusinessSchedule, GalleryTiles, UserAvatar },
  props: {
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
