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
              @click="clientEdit(props.item)"
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
                <span
                  class="hidden-button"
                  @click="clientEdit(props.item)"
                >
                  {{ props.item.name.fullName }}
                </span>
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
          <v-layout column="">
            <v-flex>
              <span>
                {{ visitDisplayDate(props.item) }}
              </span>
              <span> - </span>
              <span>
                {{ visitStatus(props.item) }}
              </span>
            </v-flex>
            <v-flex>
              <span class="second-row">
                {{ visitDisplayTime(props.item) }}
              </span>
            </v-flex>
          </v-layout>
        </td>
        <td>
          {{ props.item.visit.check }}
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
              @click="onDelete(props.item)"
            >
              <v-icon>
                delete
              </v-icon>
            </v-btn>
          </v-layout>
        </td>
      </template>
    </v-data-table>
    <v-navigation-drawer
      v-model="edit"
      right
      temporary
      fixed
      width="400"
    >
      <ClientCardEdit
        v-if="edit"
        :client="item"
        @onDelete="onDelete(item)"
        @onSave="onSave($event)"
        @close="edit=false"
      />
    </v-navigation-drawer>
    <v-dialog
      v-model="deleteConfirm"
      width="400"
    >
      <v-card>
        <AppCardTitle @close="deleteConfirm = false" />
        <v-card-text>
          <v-layout
            column
            align-center
            justify-center
          >
            <v-flex>
              Удалить клиента
              <span class="font-weight-bold">{{ item.fullName }}</span>
              ?
            </v-flex>
            <v-flex>
              <span>Все данные будут удалены.</span>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-layout
            row
            align-center
            justify-center
            pb-3
          >
            <v-flex shrink align-self-center px-1>
              <AppBtn @click="deleteConfirm = false">
                Отмена
              </AppBtn>
            </v-flex>
            <v-flex shrink align-self-center px-1>
              <AppBtn primary @click="deleteItem()">
                Удалить
              </AppBtn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Api from '@/api/backend'
import { mapActions, mapGetters } from 'vuex'
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import AppBtn from '@/components/common/AppBtn.vue'
import AppCardTitle from '@/components/common/AppCardTitle.vue'
import BusinessPhones from '@/components/business/BusinessPhones.vue'
import ClientCardEdit from '@/components/client/ClientCardEdit.vue'
import Client from '@/components/client/client'
import {
  formatDate,
  formatTime,
  visitStatus
} from '@/components/calendar/utils'

export default {
  components: {
    AppBtn,
    AppCardTitle,
    BusinessPhones,
    ClientCardEdit,
    UserAvatar
  },
  data () {
    return {
      deleteConfirm: false,
      edit: false,
      headers: [
        { text: 'Имя и фамилия', value: 'j->name->>fullname' },
        { text: 'Визиты', value: 'visit->visits->>total' },
        { text: 'Статус', value: 'visit->last->time->>from' },
        { text: 'Средний чек', value: 'visit->>check' },
        { text: 'Филиал', value: '' },
        { text: '', value: '', sortable: false, width: '1' }
      ],
      item: {},
      items: [],
      pagination: { rowsPerPage: 10 },
      progressQuery: false,
      totalItems: 0
    }
  },
  computed: {
    ...mapGetters(['business']),
    client_id () {
      return this.$route && this.$route.params && this.$route.params.client
    },
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
    business: 'fetchData',
    client_id: 'onClientChange',
    edit: 'closeNewEditor'
  },
  mounted () {
    this.fetchData()
    if (this.client_id) {
      this.onClientChange()
    }
  },
  methods: {
    ...mapActions(['addClientsCounter']),
    clientEdit (item) {
      this.item = new Client(item)
      this.edit = true
    },
    closeNewEditor () {
      if (!this.edit && this.client_id === 'new') {
        this.$router.push({
          name: 'businessCardClients',
          params: { id: this.business }
        })
      }
    },
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
    onClientChange () {
      if (!this.client_id || !this.business) return
      this.item = new Client({ business_id: this.business })
      this.item.load(this.client_id)
      this.edit = true
    },
    onDelete (item) {
      if (item) {
        this.item = item
      }
      this.deleteConfirm = true
    },
    deleteItem () {
      this.deleteConfirm = false
      if (!this.item.id) {
        this.edit = false
        return
      }
      this.onItemDelete(this.item.id)
    },
    onItemDelete (payload) {
      if (!payload) return
      Api()
        .delete(`client?id=eq.${payload}`)
        .then(() => {
          this.addClientsCounter(-1)
          this.fetchData()
          this.edit = false
        })
    },
    onSave (item) {
      const newItem = new Client(item)
      newItem.save().then(res => {
        if (!res) return
        this.edit = false
        let idx = this.items.findIndex(x => x.id === item.id)
        if (idx > -1) {
          this.items.splice(idx, 1, item)
        }
        this.item = {}
      })
    },
    visitStatus (item) {
      return (
        item.visit.last.time.from &&
        visitStatus(item.visit.last.status, item.visit.last.time.from)
      )
    },
    visitDisplayDate (item) {
      if (!item.visit.last.time.from) return
      const d = new Date(Date.parse(item.visit.last.time.from))
      return formatDate(d)
    },
    visitDisplayTime (item) {
      if (!item.visit.last.time.from) return
      if (!item.visit.last.time.to) return
      const d1 = new Date(Date.parse(item.visit.last.time.from))
      const d2 = new Date(Date.parse(item.visit.last.time.to))
      return `${formatTime(d1)} - ${formatTime(d2)}`
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
.second-row {
  color: grey;
  font-size: 0.8em;
}
</style>
