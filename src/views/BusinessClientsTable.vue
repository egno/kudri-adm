<template>
  <PageLayout
    :is-button-visible="isEditorUser"
    :template="{
      headerText: 'Клиенты',
      buttonText: 'Добавить клиента'
    }"
    @add="$router.push({
      name: 'businessCardClient',
      params: { id: businessId, client: 'new' }
    })"
  >
    <template slot="content">
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
                <v-layout align-center row fill-height class="clients__badge" @click="clientEdit(props.item)">
                  <div class="clients__avatar">
                    <Avatar
                      class="ma-1"
                      :name="props.item.name.fullName || props.item.email"
                      size="24px"
                      :src="props.item.j.avatar"
                    />
                  </div>
                  <div class="clients__name-phone">
                    <div
                      class="hidden-button clients__name"
                      @click="clientEdit(props.item)"
                    >
                      {{ props.item.name.fullName }}
                    </div>
                    <!--todo выводить основной тел-->
                    <div class="clients__add-info _phone">
                      {{ props.item.phones[0] | phoneFormat }}
                    </div>
                  </div>
                </v-layout>
                <div>
                  <a :href="`tel:+${props.item.phone}`" class="clients__phone-button" />
                </div>
              </v-layout>
            </td>
            <td @click="clientVisits(props.item)">
              <!--v-if="props.item.visit.visits.total"-->
              <div

                class="hidden-button"
              >
                <!--<span class="clients__visit-total">{{ props.item.visit.visits.total }}</span>-->
                <span class="clients__visit-total">10</span>
                <span class="clients__unvisited">2</span>
                <!--<span
                  v-if="props.item.visit.visits.unvisited"
                  class="clients__visit-unvisited"
                >
                  {{ props.item.visit.visits.unvisited }}
                </span>-->
              </div>
            </td>
            <td>
              <!-- v-if="props.item.lastVisit.ts_begin"-->
              <v-layout column>
                <v-flex>
                  <span>2019-04-21</span>
                  <!--<span>{{ props.item.lastVisit.date }}</span>-->
                  <span> — </span>
                  <span>Завершен</span>
                  <!--<span>{{ props.item.lastVisit.displayStatus }}</span>-->
                </v-flex>
                <v-flex>
                  <span class="clients__add-info">13:00 — 17:30</span>
                  <!--<span class="second-row">{{ props.item.lastVisit.timeInterval }}</span>-->
                </v-flex>
              </v-layout>
            </td>
            <td>
              <!--{{ props.item.visit.visits.check }}-->
              {{ 5000 | numberFormat }} рублей
            </td>
            <td>
              <div class="clients__filial">
                {{ getFilialName(props.item.business_id) }}
              </div>
              <div class="clients__add-info">
                Новосибирск, ул. Сибиряков- Гвардейцев, 183
              </div>
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
          :filial="businessId"
          :create="!item.id"
          @onDelete="onDelete(item)"
          @onSave="onSave($event)"
          @close="edit=false"
        />
        <ClientVisits
          :value="visitsPanel"
          :client="item"
          @close="visitsPanel=false"
        />
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
                  Удалить клиента <span class="font-weight-bold">{{ item.fullName }}</span>?
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
      <v-tooltip bottom :value="tooltip" attach=".clients__question" content-class="clients__tooltip">
        Для просмотра всей истории посещений кликните по статусу клиента
      </v-tooltip>
    </template>
  </PageLayout>
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
import Users from '@/mixins/users'
import PageLayout from '@/components/common/PageLayout.vue'

export default {
  components: {
    AppBtn,
    AppCardTitle,
    ClientCardEdit,
    ClientVisits,
    Avatar,
    DeleteButton,
    PageLayout
  },
  filters: {
    phoneFormat (value) {
      if (!value) return ''
      return value.replace(
        /(\d?)(\d{1,3})(\d{1,3})(\d{1,2})(\d{1,2})$/g,
        '+$1 ($2) $3-$4-$5'
      )
    }, // todo make a mixin
    numberFormat (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }
  },
  mixins: [filials, Users],
  data () {
    return {
      deleteConfirm: false,
      branchesList: [],
      edit: false,
      headers: [
        { text: 'Имя и фамилия', value: 'j->name->>fullname', width: '330px' },
        { text: 'Визиты', value: 'visit->visits->>total', width: '100px' },
        { text: 'Статус последнего визита', value: 'visit->last->>ts_begin', width: '200px', class: 'clients__question' },
        { text: 'Средний чек', value: 'visit->visits->>check', width: '170px' },
        { text: 'Филиал', value: '', width: '200px' },
        { text: '', value: '', sortable: false, width: '1' }
      ],
      item: {},
      items: [],
      pagination: { rowsPerPage: 20 },
      progressQuery: false,
      totalItems: 0,
      visitsPanel: false,
      tooltip: false
    }
  },
  computed: {
    ...mapGetters(['businessId', 'businessInfo', 'businessIsFilial']),
    clientId () {
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
    clientId: 'onClientChange',
    edit: 'closeNewEditor',
    businessIsFilial: 'getFilials'
  },
  created () {
    this.getFilials()
    this.fetchData()
  },
  mounted () {
    if (this.clientId) {
      this.onClientChange()
    }
    this.$el.querySelector('.clients__question').addEventListener('mouseenter', this.onHover)
    this.$el.querySelector('.clients__question').addEventListener('mouseleave', this.onLeave)
  },
  beforeDestroy () {
    this.$el.querySelector('.clients__question').removeEventListener('mouseenter', this.onHover)
    this.$el.querySelector('.clients__question').removeEventListener('mouseleave', this.onLeave)
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
      if (!this.edit && this.clientId === 'new') {
        this.$router.push({
          name: 'BusinessClientsTable',
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
      if (!this.clientId || !this.businessId) return
      this.item = new Client({ business_id: this.businessId })
      this.item.load(this.clientId)
      this.edit = true
    },
    onDelete (item) {
      if (item) {
        this.item = item
      }
      this.deleteConfirm = true
    },
    onHover () {
      this.tooltip = true
    },
    onLeave () {
      this.tooltip = false
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
          padding-left: 35px !important;
          @media only screen and (min-width : ($left-panel+$max-width)) {
            padding-left: 56px !important;
          }

        }
        i {
          vertical-align: top;
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

    div {
      font-size: 14px;
      color: #07101C;
    }

    .clients__add-info {
      font-size: 12px;
      color: #8995AF;
      &._phone {
        font-size: 14px;
      }
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
        padding-left: 46px;
      }
    }
    &__badge {
      cursor: pointer;
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
    &__unvisited {
      display: inline-block;
      vertical-align: baseline;
      margin-left: 11px;
      width: 16px;
      height: 16px;
      text-align: center;
      font-size: 12px;
      color: #FFFFFF;
      background: #EF4D37;
      border-radius: 50%;
    }
    &__question {
      position: relative;
      &:after {
        display: inline-block;
        vertical-align: middle;
        content: '';
        width: 14px;
        height: 14px;
        background: url('../assets/images/svg/question.svg') center no-repeat;
      }
    }
    .clients__tooltip {
      max-width: 175px;
      top: 100% !important;
      white-space: normal;
      color: #fff;
      font-size: 13px;
    }
    &__filial {
      font-weight: bold;
    }
    .v-datatable__actions__select {
      display: none;
    }
    .avatar-letters {
      color: #fff;
    }
  }
</style>
