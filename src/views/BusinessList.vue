<template>
  <div>
    <VDataTable
      :headers="headers"
      :items="data"
      :loading="progressQuery"
      :pagination.sync="pagination"
      :rows-per-page-items="[5, 10, 25]"
      rows-per-page-text="Записей на страницу:"
      :total-items="totalItems"
      class="elevation-1"
    >
      <VProgressLinear
        slot="progress"
        color="blue"
        indeterminate
      />
      <template
        slot="items"
        slot-scope="props"
      >
        <td>
          <VLayout
            row
            align-center
            fill-height
            justify-start
          >
            <VBtn
              fab
              flat
              right
              small
              :outline="props.item.access"
              color="green"
              :to="{name: 'businessCard', params: {id: props.item.id}}"
              target="_blank"
            >
              <Avatar
                class="ma-1"
                :name="props.item.j && props.item.j.name || props.item.j.email"
                size="2.4em"
                :src="props.item.j.avatar"
              />
            </VBtn>
            <VFlex
              align-self-center
              justify-start
            >
              <span class="text-truncate column-truncated">
                {{ props.item.j && props.item.j.name || '-' }}
              </span>
            </VFlex>
          </VLayout>
          <a
            :to="{name: 'businessCard', params: {id: props.item.id}}"
            target="_blank"
          />
        </td>
        <td>{{ props.item.j.category }}</td>
        <td>{{ props.item.j.inn }}</td>
        <td>
          {{ props.item.j && props.item.j.address && props.item.j.address.name }}
          <div
            v-if="props.item.j.filials"
            class="caption text-no-wrap grey--text text--darken-1"
          >
            <RouterLink
              :to="{name: 'filialList',params:{id: props.item.id}}"
            >
              Филиалов: {{ props.item.j.filials }}
            </RouterLink>
          </div>
        </td>
        <td>
          <VLayout v-if="props.item.user" column>
            <VFlex><span>{{ props.item.user.name }} {{ props.item.user.surname }}</span></VFlex>
            <VFlex><PhoneView :phone="props.item.user.phone" /></VFlex>
          </VLayout>
        </td>
        <td>
          <span v-if="allowChangeManager">
            <v-select 
              v-model="props.item.j.manager"
              :items="managers"
              item-text="email"
              return-object
              clearable
              @change="itemSave(props.item)"
            />
          </span>
          <span v-else>{{ props.item.j && props.item.j.manager && props.item.j.manager.email }}</span>
        </td>
        <td><span v-if="props.item.lastLogin">{{ props.item.lastLogin }}</span></td>
        <td>-</td>
      </template>
      <template
        slot="pageText"
        slot-scope="props"
      >
        {{ props.pageStart }}-{{ props.pageStop }} из {{ props.itemsLength }}
      </template>
    </VDataTable>
  </div>
</template>

<script>
import Api from '@/api/backend'
import router from '@/router'
import Avatar from '@/components/avatar/Avatar.vue'
import PhoneView from '@/components/common/PhoneView.vue'
import { mapActions, mapGetters } from 'vuex'
import { makeAlert } from '@/api/utils'
import {
  displayRESTDate
} from '@/components/calendar/utils'

export default {
  components: { Avatar, PhoneView },
  data () {
    return {
      formActions: [
        {
          label: 'Добавить',
          href: '/businessCard/new',
          target: '_blank',
          default: true
        }
      ],
      headers: [
        { text: 'Название', value: 'j->>name' },
        { text: 'Тип', value: 'j->>category' },
        { text: 'ИНН', value: 'j->>inn' },
        { text: 'Адрес', value: 'j->>address' },
        { text: 'Телефон', value: '', sortable: false },
        { text: 'Менеджер', value: 'j->manager->>email' },
        { text: 'Последний вход', value: '', sortable: false },
        { text: 'Статус', value: '' }
      ],
      data: [],
      pagination: { rowsPerPage: 10 },
      progressQuery: false,
      totalItems: 0,
      managers: []
    }
  },
  computed: {
    ...mapGetters(['loggedIn', 'searchString', 'userRole']),
    allowChangeManager () {
      return this.managers && this.managers.length && this.userRole==='admin'
    },
    table () {
      return this.$route.name == 'businessList' ? 'business' : 'my_business'
    },
    querySearchString () {
      if (!this.searchString) {
        return null
      }
      return `or=(j->>email.ilike.*${this.searchString}*,j->>name.ilike.*${
        this.searchString
      }*,j->>inn.ilike.${this.searchString}*,j->>address.ilike.*${
        this.searchString
      }*)`
    }
  },
  watch: {
    pagination: {
      handler () {
        this.fetchData()
      },
      deep: true
    },
    table: 'fetchData',
    searchString: 'fetchData',
    userRole: 'loadManagers'
  },
  mounted () {
    this.loadManagers()
    this.fetchData()
    this.setActions(this.formActions)
  },
  destroyed () {
    this.setActions([])
  },
  methods: {
    ...mapActions(['alert', 'setActions']),
    editItem (item) {
      router.push({ name: 'businessCard', params: { id: item.id } })
    },
    fetchData () {
      this.progressQuery = true
      this.data = []
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      let params = [this.querySearchString]
      params.push('parent=is.null')
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
      if (this.$route.name == 'myBusinessList') {
        params.push(`manager_id=not.is.null`)
      }
      Api()
        .get(`${this.table}?${params.filter(x => !!x).join('&')}`)
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
          this.data = res.filter(x => x.j).map(x => {
            x.user = this.user(x)
            x.lastLogin = displayRESTDate(this.lastLogin(x))
            return x
          })
          this.progressQuery = false
        })
        .catch(() => {
          this.progressQuery = false
        })
    },
    itemSave (item) {
      const data = {
        j: item.j
      }
      Api()
        .patch(`business?id=eq.${item.id}`, data)
        .then(()=>{
          this.alert(makeAlert('Сохранено'))
        })
        .catch(err => {
            this.alert(makeAlert(err))
        })
    },
    lastLogin (business) {
      return business && business.users && 
        business.users.length && 
        business.users
          .map(x => x['last_login'])
          .sort((a,b) => a > b ? -1 : 1)[0]
    },
    user (business) {
      const users = this.users(business)
      return users && users[0]
    },
    users (business) {
      return business && business.users && 
        business.users.length && 
        business.users
          .sort(x => x.id === business.id ? -1 : 1)
    },
    loadManagers () {
      if (this.userRole !== 'admin') return
      Api().get('managers')
        .then(res => {
          this.managers = res.data.map(x=> {
            return {id: x.id, email: x.email}
          })
        }) 
    }
  }
}
</script>

<style >
.column-truncated {
  max-width: 20em;
}
</style>
