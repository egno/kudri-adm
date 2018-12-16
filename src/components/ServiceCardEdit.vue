<template>
  <VCard>
    <VCardTitle class="headline">
      Услуга
    </VCardTitle>
    <VCardText>
      <VContainer grid-list-md>
        <VLayout wrap>
          <VFlex
            xs12
            sm6
          >
            <VCombobox
              v-model="item.name"
              autofocus
              :items="services"
              label="Наименование"
              required
              @input="onNameUpdate"
            />
          </VFlex>
          <VFlex
            xs12
            sm6
          >
            <VSelect
              v-model="item.category"
              :items="categories"
              label="Категория"
              required
            />
          </VFlex>
          <VFlex
            xs12
            sm6
          >
            <VTextField
              v-model="item.price"
              label="Цена от"
            />
          </VFlex>
          <VFlex
            xs12
            sm6
          >
            <VTextField
              v-model="item.duration"
              label="Продолжительность, минут"
            />
          </VFlex>
          <VFlex xs12>
            <VTextarea
              v-model="item.note"
              solo
              label="Примечание"
            />
          </VFlex>
        </VLayout>
      </VContainer>
    </VCardText>
    <VCardActions>
      <VSpacer />
      <VBtn @click="onDelete">
        Удалить
      </VBtn>
      <VBtn
        color="primary"
        @click="onSave"
      >
        Сохранить
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  props: {
    item: {
      type: Object,
      default: ()=> {return {}}
    }
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    ...mapGetters(["serviceCategories", "serviceList"]),
    categories () {
      return this.serviceCategories.map(x => x.code)
    },
    services () {
      return this.serviceList.map(x => x.name)
    }
  },
  mounted () {
    this.data = this.item
    this.loadServiceList
    // Object.assign({}, this.item);
  },
  methods: {
    ...mapActions(["loadServiceList"]),
    onDelete () {
      this.$emit("onDelete", undefined)
    },
    onNameUpdate (event) {
      console.log("upd", event)
      const calcItem = this.serviceList.filter(x => x.name == event)[0]
      if (calcItem) {
        this.item.category = calcItem.category
      }
    },
    onSave () {
      this.$emit("onSave", this.item)
    }
  }
}
</script>
