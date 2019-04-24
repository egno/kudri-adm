<template>
  <v-dialog :value="value" content-class="right-attached-panel" transition="slide" @input="$emit('close')">
    <v-card
      flat
      style="height: 100vh"
    >
      <div class="fixed-title">
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
      </div>
      <div class="scrollable">
        <v-layout column>
          <v-flex
            v-for="(visit) in visits"
            :key="visit.id"
          >
            <!--todo сортировка по ts_begin -->
            <VisitTimeLineRow :visit="visit" />
          </v-flex>
        </v-layout>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import Visit from '@/classes/visit'
import { newClient } from '@/components/client/utils'
import AppCardTitle from '@/components/common/AppCardTitle.vue'
import VisitTimeLineRow from '@/components/client/VisitTimeLineRow.vue'
// import Api from '@/api/backend'
import { mapActions, mapGetters } from 'vuex'
// import { makeAlert } from '@/api/utils'

export default {
  components: { AppCardTitle, VisitTimeLineRow },
  model: {
    prop: 'value',
    event: 'close'
  },
  props: {
    client: {
      type: Object,
      default () {
        return newClient()
      }
    },
    value: {
      type: Boolean,
      default: false,
      required: true
    },
  },
  data () {
    return {
      visits: [],
      active: 0
    }
  },
  computed: {
    ...mapGetters(['businessId']),
    clientId () {
      return this.client && this.client.id
    }
  },
  watch: {
    clientId: 'load',
    businessId: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
    ...mapActions(['alert']),
    load () {
      if (!this.clientId || this.clientId === 'new') return
      if (!this.businessId) return
      this.visits = [
        new Visit({
          id: 1,
          business_id: this.businessId,
          ts_begin: '2019-04-21T15:20:00.000',
          status: 'unvisited',
          master: {
            id: '7abf57ca-6666-11e9-9e07-7f8af87678ec',
            name: 'Маргарита Забылина-Непомнящая'
          },
          j: {
            client: this.client.id,
            services: [{
              price: 312,
              name: 'Коррекция Формы Бровей Пинцетом'
            }]
          },
        }),
        new Visit({
          id: 2,
          business_id: this.businessId,
          ts_begin: '2019-04-30T20:00:00.000',
          master:  {
            id: '7abf57ca-6666-11e9-9e07-7f8af87678ec',
            name: 'Ирина Михайлова'
          },
          j: {
            client: this.client.id,
            services: [{
              price: 512,
              name: 'Здесь название услуги будущей'
            }]
          },
        }),
        new Visit({
          id: 3,
          business_id: this.businessId,
          ts_begin: '2019-04-24T12:15:00.000',
          status: 'canceled',
          master:  {
            id: '7abf57ca-6666-11e9-9e07-7f8af87678ec',
            name: 'Ирина Михайлова'
          },
          j: {
            client: this.client.id,
            services: [{
              price: 2312,
              name: 'Медовый массаж'
            }]
          },
        }),
        new Visit({
          id: 4,
          business_id: this.businessId,
          ts_begin: '2019-04-24T10:30:00.000',
          master:  {
            id: '7abf57ca-6666-11e9-9e07-7f8af87678ec',
            name: 'Ирина Михайлова'
          },
          j: {
            client: this.client.id,
            services: [{
              price: 2312,
              name: 'Коррекция Формы Бровей Пинцетом'
            },
            {
              price: 312,
              name: 'Окрашивание бровей хной'
            }]
          },
        })
      ]
      /*Api()
        .get(
          `visit?and=(client_id.eq.${this.clientId},salon_id.eq.${
            this.businessId
          })&order=ts_begin.desc`
        )
        .then(res => res.data)
        .then(res => {
          this.visits = res.map(x => new Visit(x))
        })
        .catch(res => {
          this.alert(makeAlert(res))
        })*/
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

<style lang="scss">
  @import "../../assets/styles/right-attached-panel";

  .fixed-title {
    height: 80px;
    overflow: hidden;
  }
  .scrollable {
    height: calc(100vh - 80px);
    overflow: auto;
  }
</style>


