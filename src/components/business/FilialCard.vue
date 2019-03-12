<template>
  <VCard>
    <VToolbar>
      <UserAvatar
        class="ma-1"
        :name="item.j.name || item.j.email"
        :src="item.j.avatar"
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
      <VFlex v-if="item.j.address">
        <BusinessAddress
          :caption-class="captionClass"
          :address="item.j.address"
        />
      </VFlex>
      <VFlex v-if="item.j.phones && item.j.phones.length">
        <BusinessPhones
          :caption-class="captionClass"
          :phones="item.j.phones"
        />
      </VFlex>
      <BusinessSchedule
        :caption-class="captionClass"
        :schedule="item.j.schedule"
      />
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
    </VCardText>
    <VDialog v-model="edit">
      <FilialCardEdit
        :id="item.id"
        :item="item"
        @onEditClose="onSave"
        @onDelete="onDelete"
      />
    </VDialog>
  </VCard>
</template>

<script>
import BusinessAddress from '@/components/business/BusinessAddress.vue'
import BusinessPhones from '@/components/business/BusinessPhones.vue'
import BusinessSchedule from '@/components/business/BusinessSchedule.vue'
import FilialCardEdit from '@/components/business/FilialCardEdit.vue'
import UserAvatar from '@/components/avatar/UserAvatar.vue'

export default {
  components: {
    BusinessAddress,
    BusinessPhones,
    BusinessSchedule,
    FilialCardEdit,
    UserAvatar
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      captionClass:
        'caption font-weight-bold text-no-wrap grey--text text--darken-1',
      edit: false
    }
  },
  methods: {
    onDelete () {
      this.edit = false
      this.$emit('onDelete', this.item)
    },
    onSave (payload) {
      this.edit = false
      this.$emit('onSave', payload)
    }
  }
}
</script>
