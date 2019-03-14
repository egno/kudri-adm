<template>
  <v-card flat style="height: 100vh">
    <AppCardTitle @close="$emit('close')">
      <v-layout column>
        <v-flex>
          <span class="title">
            История записей
          </span>
        </v-flex>
        <v-flex>
          {{ client.fullName }}
        </v-flex>
      </v-layout>
    </AppCardTitle>
    <v-card-text class="scrollable">
      <v-layout
        column
      >
        <v-flex v-for="(visit) in visits" :key="visit.id">
          <VisitTimeLineRow :visit="visit" />
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import Visit from '@/classes/visit'
import { newClient } from '@/components/client/utils'
// import AppBtn from '@/components/common/AppBtn.vue'
// import AppTabs from '@/components/common/AppTabs.vue'
import AppCardTitle from '@/components/common/AppCardTitle.vue'
import VisitTimeLineRow from '@/components/client/VisitTimeLineRow.vue'
import Api from '@/api/backend'
import { mapActions, mapGetters } from 'vuex'
import { makeAlert } from '@/api/utils'

export default {
  components: { AppCardTitle, VisitTimeLineRow },
  props: {
    client: {
      type: Object,
      default () {
        return newClient()
      }
    }
  },
  data () {
    return {
      visits: [],
      active: 0
    }
  },
  computed: {
    ...mapGetters(['businessId']),
    client_id () {
        return this.client && this.client.id
    }
  },
  watch: {
      client_id: 'load',
      business: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
      ...mapActions(['alert']),
    load () {
      if (!this.client_id || this.client_id === 'new') return
      if (!this.businessId) return
      Api()
        .get(
          `visit?and=(client_id.eq.${this.client_id},salon_id.eq.${
            this.businessId
          })&order=ts_begin.desc`
        )
        .then(res => res.data)
        .then(res => {
          this.visits = res.map(x => new Visit(x))
        })
        .catch(res=> {
            this.alert(makeAlert(res))
        })
    },
    onDelete () {
      this.$emit('onDelete', this.client)
    },
    onSave () {
      this.$emit('onSave', this.client)
    }
  }
}
</script>

<style scoped>
.scrollable {
    height: 80vh;
    overflow: auto;
}
</style>


