<template>
  <div class="clients">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="progressQuery"
      :pagination.sync="pagination"
      :total-items="totalItems"
      class="elevation-0"
      sort-icon="mdi-menu-down"
      hide-actions
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>
          <v-layout
            align-center justify-space-between row fill-height
            class="clients__first-cell"
          >
            <v-layout align-center row fill-height class="clients__badge">
              <v-btn
                fab
                flat
                small
                class="clients__avatar"
                @click="clientEdit(props.item)"
              >
                <Avatar
                  class="ma-1"
                  :name="props.item.name.fullName || props.item.email"
                  size="2.4em"
                  :src="props.item.j.avatar"
                />
              </v-btn>
              <div class="clients__name-phone">
                <div
                  class="hidden-button clients__name"
                  @click="clientEdit(props.item)"
                >
                  {{ props.item.name.fullName }}
                </div>
                <div>
                  {{ props.item.phone | phoneFormat }}
                </div>
              </div>
            </v-layout>
            <div>
              <a :href="`tel:+${props.item.phone}`" class="clients__phone-button" />
            </div>
          </v-layout>
        </td>
        <td>
          <div
            v-if="props.item.visit.visits.total"
            class="hidden-button"
            @click="clientVisits(props.item)"
          >
            <span>
              {{ props.item.visit.visits.total }}
            </span>
            <span
              v-if="props.item.visit.visits.unvisited"
              class="badge-inline red"
            >
              {{ props.item.visit.visits.unvisited }}
            </span>
          </div>
        </td>
        <td>
          <v-layout v-if="props.item.lastVisit.ts_begin" column="">
            <v-flex>
              <span>
                {{ props.item.lastVisit.date }}
              </span>
              <span> - </span>
              <span>
                {{ props.item.lastVisit.displayStatus }}
              </span>
            </v-flex>
            <v-flex>
              <span class="second-row">
                {{ props.item.lastVisit.timeInterval }}
              </span>
            </v-flex>
          </v-layout>
        </td>
        <td>
          {{ props.item.visit.visits.check }}
        </td>
        <td>
          {{ getFilialName(props.item.business_id) }}
        </td>
        <td>
          <v-layout
            row
            align-center
            fill-height
            justify-start
          >
            <DeleteButton :is-dark="true" @delete="onDelete(props.item)" />
          </v-layout>
        </td>
      </template>
    </v-data-table>
    <div class="text-xs-right">
      <v-pagination v-model="pagination.page" :length="pages" :total-visible="6" circle color="rgba(137, 149, 175, 0.35)" />
    </div>
    <ClientCardEdit
      :visible="edit"
      :client="item"
      :filials="branchesList"
      :create="!item.id"
      @onDelete="onDelete(item)"
      @onSave="onSave($event)"
      @close="edit=false"
    />
    <v-dialog
      :value="visitsPanel"
      transition="slide"
      content-class="client-modal"
      @input="visitsPanel = false"
    >
      <ClientVisits
        :client="item"
        @close="visitsPanel=false"
      />
    </v-dialog>
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
            <v-flex
              shrink
              align-self-center
              px-1
            >
              <AppBtn @click="deleteConfirm = false">
                Отмена
              </AppBtn>
            </v-flex>
            <v-flex
              shrink
              align-self-center
              px-1
            >
              <AppBtn
                primary
                @click="deleteItem()"
              >
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
import Avatar from '@/components/avatar/Avatar.vue'
import AppBtn from '@/components/common/AppBtn.vue'
import AppCardTitle from '@/components/common/AppCardTitle.vue'
import ClientCardEdit from '@/components/client/ClientCardEdit.vue'
import ClientVisits from '@/components/client/ClientVisits.vue'
import Client from '@/classes/client'
import { filials} from "../components/business/mixins"
import DeleteButton from '@/components/common/DeleteButton'

export default {
  components: {
    AppBtn,
    AppCardTitle,
    ClientCardEdit,
    ClientVisits,
    Avatar,
    DeleteButton
  },
  filters: {
    phoneFormat (value) {
      if (!value) return ''
      return value.replace(
        /(\d?)(\d{1,3})(\d{1,3})(\d{1,2})(\d{1,2})$/g,
        '+$1 ($2) $3-$4-$5'
      )
    } // todo make a mixin
  },
  mixins: [filials],
  data () {
    return {
      deleteConfirm: false,
      branchesList: [],
      edit: false,
      headers: [
        { text: 'Имя и фамилия', value: 'j->name->>fullname', width: '330px' },
        { text: 'Визиты', value: 'visit->visits->>total', width: '100px' },
        { text: 'Статус последнего визита', value: 'visit->last->>ts_begin', width: '200px' },
        { text: 'Средний чек', value: 'visit->visits->>check', width: '170px' },
        { text: 'Филиал', value: '', width: '200px' },
        { text: '', value: '', sortable: false, width: '1' }
      ],
      item: {},
      items: [],
      pagination: { rowsPerPage: 20 },
      progressQuery: false,
      totalItems: 0,
      visitsPanel: false
    }
  },
  computed: {
    ...mapGetters(['businessId', 'businessInfo', 'businessIsFilial']),
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
    },
    pages () {
      if (!this.pagination.rowsPerPage || !this.totalItems)
        return 0

      return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
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
    businessId: 'fetchData',
    client_id: 'onClientChange',
    edit: 'closeNewEditor',
    businessIsFilial: 'getFilials'
  },
  created () {
    this.getFilials()
    this.fetchData()
  },
  mounted () {
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
    clientVisits (item) {
      this.item = new Client(item)
      this.visitsPanel = true
    },
    closeNewEditor () {
      if (!this.edit && this.client_id === 'new') {
        this.$router.push({
          name: 'businessCardClients',
          params: { id: this.businessId }
        })
      }
    },
    fetchData () {
      if (!this.businessId) return

      const { sortBy, descending, page, rowsPerPage } = this.pagination
      let filter = [`business_id.eq.${this.businessId}`, this.querySearchString]
        .filter(x => !!x)
        .join(',')
      let filterString = `and=(${filter})`
      let params = [filterString]

      this.progressQuery = true
      this.items = []
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
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          this.progressQuery = false
        })
    },
    getFilialName (id) {
      if (!this.branchesList.length) {
        return ''
      }
      const f = this.branchesList.find(b => b.id === id)

      return f? f.j && f.j.name : ''
    },
    getFilials () {
      const id = this.businessIsFilial
        ? this.businessInfo && this.businessInfo.parent
        : this.businessId

      if (!id) return
      this.getFilialsOf(id)
        .then(res => {
          this.branchesList = res
        })
    },
    onClientChange () {
      if (!this.client_id || !this.businessId) return
      this.item = new Client({ business_id: this.businessId })
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
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/styles/common';
  $first-column: 270px;
  $first-column-desktop: 330px;
  $max-width: 1126px;
  $left-panel: 240px;

  .slide-enter, .slide-leave-to {
    right: -440px !important;
  }

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
  .clients {
    position: relative;
    color: #07101c;
    padding-left:  $first-column;
    background: #fff;
    overflow-x: auto;

    @media only screen and (min-width : $desktop) {
      padding-left: $first-column-desktop;
    }

    @media only screen and (min-width : ($left-panel+$max-width)) {
      padding-left: 0;
    }

    table.v-table {
      min-width: 729px;
      padding-left: 0;
      @media only screen and (min-width : ($left-panel+$max-width)) {
        width: 100%;
      }
    }

    /* styles for table header */
    thead tr:first-child {
      height: 40px;
      background: #f3f4f7;
      th {
        height: 40px;
        padding: 10px!important;
        background: #f3f4f7;
        color: #8995AF;
        &:first-child {
          padding-right: 20px !important;
          padding-left: 56px !important;
        }
      }
    }/* end of styles for table header */


    tr {
      height: 88px;
      border-bottom: none !important;
      &:hover {
        background-color: transparent !important;
      }
    }
    td {
      padding: 0 10px !important;
      border-bottom: 1px solid #f3f4f7;
    }

    /* styles for first column */
    tr th:first-child,
    tr td:first-child {
      position: absolute;
      width: $first-column;
      height: 88px;
      left: 0;
      top: auto;
      background: #fff;
      margin-top: 1px;
      @media only screen and (min-width : $desktop) {
        width: $first-column-desktop;
      }
      @media only screen and (min-width : ($left-panel+$max-width)) {
        position: static;
      }
    }
    tr th:first-child {
      margin-top: 0;
    }
    @-moz-document url-prefix() {
      tr th:first-child,
      tr td:first-child {
        margin-top: 0;
      }
    }
    /* end of styles for first column */



    .v-datatable__progress {
      position: absolute;
      left: 0;
      width: 100%;
      th:first-child {
        width: 100%;
      }
    }
    &__first-cell {
      padding: 9px 0 9px 25px;
      @media only screen and (min-width : $desktop) {
        padding-left: 51px;
      }
    }
    &__avatar {
      margin: 0;
    }
    &__name-phone {
      padding-left: 5px;
      flex-grow: 1;
      overflow: hidden;
    }
    &__name {
      text-transform: capitalize;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__phone-button {
      display: block;
      width: 40px;
      height: 40px;
      margin: 0 5px;
      background: url('../assets/images/svg/phone.svg') center no-repeat;
      border: 1px solid rgba(137, 149, 175, 0.1);
      border-radius: 50%;
    }
    .v-datatable__actions__select {
      display: none;
    }
  }
</style>
