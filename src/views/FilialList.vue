<template>
  <BranchesLayout @add="onAction('newFilial')">
    <template slot="content">
      <VLayout wrap>
        <div
          v-for="(item, i) in data"
          :key="i"
          class="card-wrapper"
        >
          <FilialCard
            :branch="item"
            :pinned="item.id === businessId"
            @onSave="onSave"
            @click="$router.push({ name: 'businessCard', params: { id: item.id } })"
          >
            {{ i }} {{ item.id }}
          </FilialCard>
        </div>
      </VLayout>
    </template>
  </BranchesLayout>
</template>

<script>
import Api from '@/api/backend'
import FilialCard from '@/components/branches/FilialCard.vue'
import Business from '@/classes/business'
import { mapActions, mapGetters } from 'vuex'
import BranchesLayout from '@/components/branches/BranchesLayout'

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { BranchesLayout, FilialCard },
  data () {
    return {
      formActions: [
        {
          label: 'Добавить филиал',
          action: 'newFilial',
          default: true
        },
        {
          label: 'Удалить филиал',
          action: 'deleteFilial',
          default: false
        }
      ],
      edit: false,
      data: {}
    }
  },
  computed: {
    ...mapGetters(['businessId','businessInfo', 'businessInn']),
  },
  watch: {
    businessInn: 'fetchData'
  },
  created () {
    this.fetchData()
  },
  mounted () {
    this.setActions(this.formActions)
    this.$root.$on('onAction', this.onAction)
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.onAction)
  },
  methods: {
    ...mapActions(['setActions']),
    fetchData () {
      if (!this.businessInn) return
      Api()
        .get(`business?j->>inn=eq.${this.businessInn}`)
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

<style lang="scss">
  .card-wrapper {
    margin: 0 24px 42px 0;
  }
</style>

