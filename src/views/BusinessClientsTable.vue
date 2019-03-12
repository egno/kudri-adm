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
            <v-flex
              align-self-center
              justify-start
            >
              {{ props.item.name.fullName }}
            </v-flex>
          </v-layout>
        </td>
        <td>
          {{ props.item.phone }}
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
import Client from '@/components/client/client'

export default {
  components: { UserAvatar },
  data () {
    return {
      headers: [
        { text: 'Имя и фамилия', value: 'j->>name' },
        { text: 'Визиты', value: '' },
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
    ...mapActions([]),
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
          `order=${sortBy}${descending ? '.desc.nullsfirst' : '.asc.nullslast'}`
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
          this.fetchData()
        })
    }
  }
}
</script>
