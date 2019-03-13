<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="progressQuery"
      :pagination.sync="pagination"
      :rows-per-page-items="[5, 10, 25]"
      rows-per-page-text="Записей на страницу:"
      :total-items="totalItems"
      class="elevation-0"
    >
      <v-progress-linear
        slot="progress"
        color="blue"
        indeterminate
      />
      <template
        slot="items"
        slot-scope="props"
      >
        <td>
          <v-layout
            row
            align-center
            fill-height
            justify-start
          >
            <v-btn
              fab
              flat
              right
              small
              :href="'businessCard/'+props.item.id"
            >
              <UserAvatar
                class="ma-1"
                :name="props.item.name.fullName || props.item.email"
                size="2.4em"
                :src="props.item.j.avatar"
              />
            </v-btn>
            <v-layout column>
              <v-flex
                align-self-center
                justify-start
              >
                {{ props.item.name.fullName }}
              </v-flex>
              <v-flex
                align-self-center
                justify-start
              >
                <BusinessPhones
                  title=""
                  :phones="[props.item.phone]"
                />
              </v-flex>
            </v-layout>
          </v-layout>
        </td>
        <td>
          <div v-if="props.item.visit.visits.total">
            <span>
              {{ props.item.visit.visits.total }}
            </span>
            <span
              v-if="props.item.visit.visits.unvisited"
              class="badge-inline red"
            >
              <span>
                {{ props.item.visit.visits.unvisited }}
              </span>
            </span>
          </div>
        </td>
        <td>
          -
        </td>
        <td>
          -
        </td>
        <td>
          <v-layout
            row
            align-center
            fill-height
            justify-start
          >
            <v-btn
              flat
              icon
              small
              color="grey"
              @click="onItemDelete(props.item.id)"
            >
              <v-icon>
                delete
              </v-icon>
            </v-btn>
          </v-layout>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Api from '@/api/backend'
import { mapActions, mapGetters } from 'vuex'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import BusinessPhones from '@/components/business/BusinessPhones.vue'
import Client from '@/components/client/client'

export default {
  components: { BusinessPhones, UserAvatar },
  data () {
    return {
      headers: [
        { text: 'Имя и фамилия', value: 'j->name->>fullname' },
        { text: 'Визиты', value: 'visit->visits->>total' },
        { text: 'Статус', value: '' },
        { text: 'Средний чек', value: '' },
        { text: 'Действия', value: '' }
      ],
      items: [],
      pagination: { rowsPerPage: 10 },
      progressQuery: false,
      totalItems: 0
    }
  },
  computed: {
    ...mapGetters(['business']),
    querySearchString () {
      if (!this.searchString) {
        return ''
      }
      return `(or.(j->>email.ilike.*${this.searchString}*,j->>name.ilike.*${
        this.searchString
      }*,j->>inn.ilike.${this.searchString}*,j->>address.ilike.*${
        this.searchString
      }*))`
    }
  },
  watch: {
    pagination: {
      handler () {
        this.fetchData()
      },
      deep: true
    },
    searchString: 'fetchData',
    business: 'fetchData'
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapActions(['addClientsCounter']),
    fetchData () {
      if (!this.business) return
      this.progressQuery = true
      this.items = []
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      let filter = [`business_id.eq.${this.business}`, this.querySearchString]
        .filter(x => !!x)
        .join(',')
      let filterString = `and=(${filter})`
      let params = [filterString]
      if (sortBy) {
        params.push(
          `order=${sortBy}${descending ? '.desc.nullslast' : '.asc.nullsfirst'}`
        )
      }
      if (rowsPerPage > -1) {
        params.push(`limit=${rowsPerPage}`)
      }
      if (page > 1) {
        params.push(`offset=${(page - 1) * rowsPerPage}`)
      }
      Api()
        .get(`client?${params.filter(x => !!x).join('&')}`)
        .then(res => {
          if (res.headers && res.headers['content-range']) {
            const r = res.headers['content-range'].match(/^\d*-\d*\/(\d*)$/)
            if (r) {
              this.totalItems = +r[1]
            }
          }
          return res.data
        })
        .then(res => {
          this.items = res.filter(x => !!x.j).map(x => new Client(x))
          this.progressQuery = false
        })
        .catch(() => {
          this.progressQuery = false
        })
    },
    onItemDelete (payload) {
      if (!payload) return
      Api()
        .delete(`client?id=eq.${payload}`)
        .then(() => {
          this.addClientsCounter(-1)
          this.fetchData()
        })
    }
  }
}
</script>

<style scoped>
.badge-inline {
  display: inline-block;
  line-height: 0px;

  border-radius: 50%;
  border: 0px solid;
}
.badge-inline span {
  color: white;
  display: inline-block;

  padding-top: 50%;
  padding-bottom: 50%;

  margin-left: 4px;
  margin-right: 4px;
}
</style>
