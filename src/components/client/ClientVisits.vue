<template>
  <v-dialog :value="value" content-class="right-attached-panel _client-visits" transition="slide" @input="$emit('close')">
    <button type="button" class="right-attached-panel__close" @click="$emit('close')" />
    <div class="right-attached-panel__header">
      История записей
    </div>
    <div class="right-attached-panel__subheader">
      {{ client.fullName }}
    </div>
    <div class="scrollable">
      <div
        v-for="(visit) in visits"
        :key="visit.id"
      >
        <!--todo сортировка по ts_begin -->
        <VisitTimeLineRow :visit="visit" />
      </div>
    </div>
  </v-dialog>
</template>

<script>
import Visit from '@/classes/visit'
import { newClient } from '@/components/client/utils'
import VisitTimeLineRow from '@/components/client/VisitTimeLineRow.vue'
// import Api from '@/api/backend'
import { mapActions, mapGetters } from 'vuex'
// import { makeAlert } from '@/api/utils'

export default {
  components: { VisitTimeLineRow },
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
              name: 'Коррекция на которую не пришли'
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
              name: 'Услугу отменили (и название забыли)'
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
              name: 'Какая-то из этих услуг'
            },
            {
              price: 312,
              name: 'В процессе оказания'
            }]
          },
        }),
        new Visit({
          id: 5,
          business_id: this.businessId,
          ts_begin: '2019-04-24T10:30:00.000',
          ts_end: '2019-04-24T11:30:00.000',
          master:  {
            id: '7abf57ca-6666-11e9-9e07-7f8af87678ec',
            name: 'Ирина Михайлова'
          },
          j: {
            client: this.client.id,
            services: [{
              price: 2312,
              name: 'Эта услуга завершена'
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
    height: calc(100vh - 128px);
    overflow: auto;
  }
  .right-attached-panel._client-visits {
    .right-attached-panel__header {
      margin: 53px 0 0;
    }
  }
</style>


