<template>
  <VCard>
    <VToolbar>
      <VBtn
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
        <div>
          <h4>{{ item.name }}</h4>
          <div class="caption grey--text text--darken-1">
            {{ item.category }}
          </div>
        </div>
      </VToolbarTitle>
    </VToolbar>
    <VCardText>
      <div>
        <span class="font-weight-bold">
          Цена:
        </span>
        от {{ item.price }}
      </div>
      <div>
        <span class="font-weight-bold">
          Продолжительность:
        </span>
        {{ item.duration }} мин.
      </div>
      <span />
      {{ item.note }}
    </VCardText>
    <VDialog v-model="edit">
      <ServiceCardEdit
        :item="item"
        @onSave="onSave"
        @onDelete="onDelete"
      />
    </VDialog>
  </VCard>
</template>

<script>
import ServiceCardEdit from "@/components/ServiceCardEdit.vue"

export default {
  components: { ServiceCardEdit },
  props: {
    item: {
      type: Object,
      default: ()=> {return {}}
    }
  },
  data () {
    return {
      edit: false
    }
  },
  methods: {
    onDelete () {
      this.edit = false
      this.$emit("onDelete", this.item)
    },
    onSave () {
      this.edit = false
      //   this.item = Object.assign(this.item, data);
      this.$emit("onSave", this.item)
    }
  }
}
</script>
