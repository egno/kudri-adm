<template>
  <VCard>
    <VToolbar>
      <UserAvatar
        class="ma-1"
        :name="item.j.name || item.j.email"
        :src="`${item.parent}/${item.j.avatar}`"
      />
      <VBtn
        v-if="item.access"
        small
        fab
        bottom
        right
        absolute
        color="light-grey"
        @click="edit = true"
      >
        <VIcon>edit</VIcon>
      </VBtn>
      <VToolbarTitle primary-title>
        <VLayout
          align-left
          row
          spacer
        >
          <VFlex>
            <div>
              <h4>{{ item.j.name }}</h4>
              <div class="caption grey--text text--darken-1">
                {{ item.j.category }}
              </div>
            </div>
          </VFlex>
        </VLayout>
      </VToolbarTitle>
    </VToolbar>
    <VCardText>
      <div>
        <span class="font-weight-bold">
          Услуги:
        </span>
        <div
          v-for="(service, i) in item.j.services"
          :key="i"
        >
          {{ service.name }}
        </div>
      </div>
      <BusinessSchedule
        v-if="item.j.schedule"
        :caption-class="captionClass"
        :schedule="item.j.schedule"
      />
      <span />
      {{ item.j.note }}
    </VCardText>
    <VDialog v-model="edit">
      <EmployeeCardEdit
        :id="item.id"
        :item="item"
        @onEditClose="onSave"
        @onDelete="onDelete"
      />
    </VDialog>
  </VCard>
</template>

<script>
import BusinessSchedule from '@/components/business/BusinessSchedule.vue';
import EmployeeCardEdit from '@/components/business/EmployeeCardEdit.vue';
import UserAvatar from '@/components/avatar/UserAvatar.vue';

export default {
  components: { BusinessSchedule, EmployeeCardEdit, UserAvatar },
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
        'caption font-weight-bold text-no-wrap grey--text text--darken-1',
      edit: false
    };
  },
  methods: {
    onDelete() {
      this.edit = false;
      this.$emit('onDelete', this.item);
    },
    onSave(payload) {
      this.edit = false;
      this.$emit('onSave', payload);
    }
  }
};
</script>
