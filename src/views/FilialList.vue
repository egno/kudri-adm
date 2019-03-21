<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <VLayout
      row
      wrap
    >
      <VFlex
        v-for="(item, i) in data"
        :key="i"
      >
        <v-btn :to="{name: 'businessCard', params: {id: item.id}}">
          Перейти
        </v-btn>
        <FilialCard
          :item="item"
          @onSave="onSave"
        >
          {{ i }} {{ item.id }}
        </FilialCard>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import Api from '@/api/backend'
import FilialCard from '@/components/business/FilialCard.vue'
import Business from '@/classes/business'
import { mapActions, mapGetters } from 'vuex'

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { FilialCard },
  data () {
    return {
      formActions: [
        {
          label: 'Добавить филиал',
          action: 'newFilial',
          default: true
        }
      ],
      edit: false,
      data: {}
    }
  },
  computed: {
    ...mapGetters(['businessId','businessInfo', 'businessInn']),
    inn () {
      return this.businessInn
    }
  },
  watch: {
    inn: 'fetchData'
  },
  mounted () {
    this.fetchData()
    this.setActions(this.formActions)
    this.$root.$on('onAction', this.onAction)
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.onAction)
  },
  methods: {
    ...mapActions(['setActions']),
    fetchData () {
      if (!this.inn) return
      Api()
        .get(`business?j->>inn=eq.${this.inn}`)
        .then(res => res.data)
        .then(res => {
          this.data = res
        })
    },
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.data.unshift(new Business({ access: true, parent:this.businessId, name: this.businessInfo.name }))
      }
    },
    onSave (payload) {
      this.sendData(payload)
    },
    sendData (data) {
      data.j.phones = data.j.phones.filter(x => x > '')
      data.parent = this.businessId
      if (!data.id) {
        Api().post(`business`, data)
        // .then(res => {
        //   const newId = this.locationId(res.headers);
        //   if (newId) {
        //   router.push({ name: 'businessCard', params: { id: newId } });
        //   }
        // });
      } else {
        Api().patch(`business?id=eq.${data.id}`, data)
      }
    }
  }
}
</script>

