<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <VFlex>
      <VTextField
        key="mainSearch"
        v-model="searchString"
        autofocus
        clearable
        label="Поиск"
        single-line
        type="text"
      />
    </VFlex>
    <VLayout column>
      <VFlex
        v-for="(grp) in groups"
        :key="'grp'+grp"
      >
        <VLayout column>
          <VFlex>
            <span class="title">
              {{ grp || 'Прочие' }}
            </span>
          </VFlex>
          <VFlex>
            <VLayout
              row
              wrap
              align-space-around
              fill-height
            >
              <VFlex
                v-for="(item, i) in servicesInGroup(grp)"
                :key="item.name + i"
                xs12
                sm6
                md4
                lg3
                xl3
              >
                <ServiceCard
                  :item="item"
                  @onSave="onSave(i)"
                  @onDelete="onDelete(i)"
                />
              </VFlex>
              <VDialog v-model="edit">
                <ServiceCardEdit
                  :item="newService"
                  @onSave="onSave(-1)"
                  @onDelete="onDelete(-1)"
                />
              </VDialog>
            </VLayout>
          </VFlex>
        </VLayout>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import ServiceCard from '@/components/service/ServiceCard.vue'
import ServiceCardEdit from '@/components/service/ServiceCardEdit.vue'
import Api from '@/api/backend'
import { businessMixins } from '@/components/business/mixins'
import { mapActions } from 'vuex'

export default {
  components: {
    ServiceCard,
    ServiceCardEdit
  },
  mixins: [businessMixins],
  data () {
    return {
      searchString: '',
      formActions: [
        { label: 'Добавить услугу', action: 'newService', default: false }
      ],
      data: { j: {} },
      edit: false,
      newService: {},
      service: null
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    groups () {
      return (
        this.services &&
        [...new Set(this.services.map(x => x.group))].sort((a, b) =>
          a < b ? -1 : 1
        )
      )
    },
    services () {
      return (
        this.data &&
        this.data.j &&
        this.data.j['services'] &&
        this.data.j['services'].filter(
          x =>
            !this.searchString ||
            x.name.toUpperCase().indexOf(this.searchString.toUpperCase()) > -1
        )
      )
    }
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
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.data = this.dataPrefill(res)
        })
      Api()
        .get(`service`)
        .then(res => res.data)
        .then(res => {
          this.service = res
        })
    },
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.edit = true
      }
    },
    onDelete (i) {
      this.edit = false
      this.newService = {}
      if (i > -1) {
        this.data.j.services = this.data.j.services.filter((x, n) => n !== i)
      }
      this.sendData()
    },
    onSave (i) {
      this.edit = false
      if (i === -1) {
        this.data.j['services'].push(Object.assign({}, this.newService))
      }
      this.data.j['services'] = this.services.filter(
        x => Object.keys(x).length > 0
      )
      this.sendData()
    },
    sendData () {
      Api().patch(`business?id=eq.${this.id}`, this.data)
    },
    servicesInGroup (grp) {
      return this.services && this.services.filter(x => x.group === grp)
    }
  }
}
</script>

