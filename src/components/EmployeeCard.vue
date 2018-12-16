<template>
  <VCard>
    <VToolbar>
      <VAvatar
        class="ma-1"
        :tile="(true)"
      >
        <img
          src="/images/01.png"
          alt="avatar"
        >
      </VAvatar>
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
        <VLayout
          align-left
          row
          spacer
        >
          <VFlex>
            <div>
              <h4>{{ item.name }}</h4>
              <div class="caption grey--text text--darken-1">
                {{ item.category }}
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
          v-for="(service, i) in item.services"
          :key="i"
        >
          {{ service.name }}
        </div>
      </div>
      <div>
        <span class="font-weight-bold">
          График работы:
        </span>
        {{ item.schedule }}
      </div>
      <span />
      {{ item.note }}
    </VCardText>
    <VDialog v-model="edit">
      <!-- <service-card-edit :item="item" @onSave="onSave" @onDelete="onDelete"></service-card-edit> -->
    </VDialog>
  </VCard>
</template>

<script>
// import ServiceCardEdit from "@/components/ServiceCardEdit.vue";

export default {
  props: {
    item: {type: Object, default: () => {return {};}}
  },
  data () {
    return {
      edit: false
    };
  },
  // components: { ServiceCardEdit },
  methods: {
    onDelete () {
      this.edit = false;
      this.$emit("onDelete", this.item);
    },
    onSave () {
      this.edit = false;
      //   this.item = Object.assign(this.item, data);
      this.$emit("onSave", this.item);
    }
  }
};
</script>
