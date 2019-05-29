<template>
  <v-card
    flat
    color="grey lighten-3"
    class="card-rounded"
  >
    <v-card-text>
      <v-switch
        v-model="showDetails"
        label="Создать прямые ссылки для сети филиалов"
        color="blue"
        class="compact mt-0 pb-1 px-2"
        height="10px"
        hide-details
      />
    </v-card-text>
    <template v-if="showDetails">
      <v-divider class="card-divider" />
      <v-card-text>
        <v-layout
          row
          wrap
        >
          <v-flex
            pa-2
          >
            <v-layout column>
              <v-flex v-for="filial in filials" :key="filial.id" py-3>
                <v-layout row wrap align-start fill-height justify-space-between>
                  <v-flex xs12 md4>
                    {{ (filial.j && filial.j.name ) || `<${filial.id}>` }}
                  </v-flex>
                  <v-flex xs12 md5>
                    {{ filial.j && filial.j.address && filial.j.address.name }}
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-btn small ripple round color="primary" outline @click="copyLink(filial.id)">
                      Скопировать
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/backend'
import {widgetHost} from '@/components/utils'

export default {
  props: {
    //
  },
  data () {
    return {
      showDetails: false,
      filials:[]
    }
  },
  computed: {
    ...mapGetters(['businessId'])
  },
  watch: {
    businessId: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      if (!this.businessId) return
      Api().get(`business?parent=eq.${this.businessId}&order=id&limit=10`)
      .then(res => {
        this.filials = res.data
      })
    },
    link (id) {
      return `${widgetHost()}?b=${id}`
    },
    copyLink (id) {
      const el = document.createElement('textarea')
        el.value = this.link(id)
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
      document.body.removeChild(el)
    }
  }
}
</script>
