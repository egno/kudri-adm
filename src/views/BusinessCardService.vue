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
        v-for="(item, i) in data.data.service"
        :key="item.name + i"
      >
        <ServiceCard
          :item="item"
          @onSave="onSave(i)"
          @onDelete="onDelete(i)"
        />
        <VBtn
          fixed
          dark
          fab
          bottom
          right
          color="pink"
          @click="edit = true"
        >
          <VIcon>add</VIcon>
        </VBtn>
      </VFlex>
      <VDialog v-model="edit">
        <ServiceCardEdit
          :item="newService"
          @onSave="onSave(-1)"
          @onDelete="onDelete(-1)"
        />
      </VDialog>
    </VLayout>
  </VContainer>
</template>

<script>
import ServiceCard from "@/components/ServiceCard.vue"
import ServiceCardEdit from "@/components/ServiceCardEdit.vue"
import Api from "@/api/backend"

export default {
  components: {
    ServiceCard,
    ServiceCardEdit
  },
  data () {
    return {
      data: { data: {} },
      edit: false,
      newService: {},
      service: null
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    services () {
      return this.data.data["service"]
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.data = res
        })
      Api()
        .get(`service`)
        .then(res => res.data)
        .then(res => {
          this.service = res
        })
    },
    onDelete (i) {
      this.edit = false
      this.newService = {}
      if (i > -1) {
        this.data.data.service = this.data.data.service.filter(
          (x, n) => n !== i
        )
      }
      this.sendData()
    },
    onSave (i) {
      this.edit = false
      if (i === -1) {
        this.data.data["service"].push(Object.assign({}, this.newService))
      }
      this.data.data["service"] = this.services.filter(
        x => Object.keys(x).length > 0
      )
      this.sendData()
    },
    sendData () {
      Api().patch(`business?id=eq.${this.id}`, this.data)
    }
  }
}
</script>
