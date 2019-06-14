<template>
  <HomeHeader v-if="$route.name === 'home' || $route.name === 'faq' || $route.name === 'news'" /><!--todo make a slot inside HomeHeader for authenticated user -->
  <VToolbar
    v-else
    class="topbar"
    app
    height="55px"
  >
    <v-toolbar-side-icon
      v-if="!navigationVisible"
      class="menu-button"
      @click="setNavigationVisible(true)"
    />
    <VLayout
      v-if="!$route.path.includes('gallery')"
      row
      align-center
      justify-start
    >
      <VFlex v-show="$route.name === 'services' || $route.name === 'employeeList' || $route.name === 'BusinessClientsTable'">
        <VTextField
          key="mainSearch"
          v-model="searchString"
          class="topsearch"
          autofocus
          label="Поиск"
          single-line
          type="text"
        />
      </VFlex>
    </VLayout>

    <VSpacer />
    <VToolbarItems>
      <!--<Notifications />-->
      <VLayout align-center justify-center class="company-badge">
        <VFlex class="text-truncate company-badge__name">
          {{ businessInfo.name }}
        </VFlex>
        <VFlex v-if="businessInfo.category" class="company-badge__category">
          {{ businessInfo.category }}
        </VFlex>
      </VLayout>
      <div class="go-home-menu">
        <v-menu left offset-y @input="goHomeMenuActive = !goHomeMenuActive">
          <template v-slot:activator="{ on }">
            <button
              type="button"
              :class="{ active: goHomeMenuActive }"
              v-on="on"
            />
          </template>
          <VList class="menu-list">
            <template v-for="(item, index) in menuList">
              <VListTile
                :key="index"
                @click="$router.push(item.route)"
              >
                <VListTileTitle>
                  {{ item.title }}
                </VListTileTitle>
              </VListTile>
            </template>
          </VList>
        </v-menu>
      </div>
      <ProfileMenu />
    </VToolbarItems>
  </VToolbar>
</template>

<script>
import ProfileMenu from '@/components/ProfileMenu.vue'
import router from '@/router'
import { mapActions, mapGetters } from 'vuex'
import { isBusinessRoute } from '@/utils'
import HomeHeader from '@/components/home/HomeHeader.vue'

export default {
  components: {
    HomeHeader,
    ProfileMenu,
  },
  data () {
    return {
      searchString: '',
      menuList: [
        {
          title: 'На главную UNO',
          route: { name: 'home' },
        },
        /*{
          title: 'Мой рабочий стол'
        }*/
      ],
      goHomeMenuActive: false
    }
  },
  computed: {
    ...mapGetters([
      'actions',
      'businessInfo',
      'navigationVisible',
      'userID',
      'myBusinessList'
    ]),
    defaultAction () {
      if (!(this.actions && Array.isArray(this.actions))) {
        return
      }
      return this.actions.filter(x => x['default'])[0]
    },
    href () {
      if (this.defaultAction) {
        return this.defaultAction.href
      }
      return null
    },
    isBusinessCard () {
      return isBusinessRoute(this.$route.name)
    },
    target () {
      if (this.defaultAction) {
        return this.defaultAction.target
      }
      return null
    }
  },
  watch: {
    searchString: 'setStoreSearchString'
  },
  mounted () {
    this.setStoreSearchString()
  },
  methods: {
    ...mapActions([
      'setActions',
      'setNavigationVisible',
      'setSearchString'
    ]),
    goHome () {
      router.push({ name: 'home' })
    },
    setStoreSearchString (newVal) {
      this.setSearchString(newVal && newVal.toLowerCase())
    }
  }
}
</script>
<style lang="scss">
  .company-badge {
    display: none;
    max-width: 324px;
    padding: 8px 24px 8px 0;
    @media only screen and (min-width: 1160px) {
      display: flex;
      flex-wrap: wrap;
    }
    &__name {
      width: 100%;
      font-family: Roboto Slab, Times New Roman, Times, serif;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 18px;
      text-align: right;
      color: #07101C;
    }

    &__category {
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: normal;
      text-align: right;
      color: #8995AF;
    }
  }
  .go-home-menu {
    button {
      width: 66px;
      height: 100%;
      outline: none;
      background: url('../assets/images/svg/home_blue.svg') center/24px no-repeat;
      border-left: 1px solid rgba(137, 149, 175, 0.1);
      &.active {
        background-color: rgba(137, 149, 175, 0.2);
      }
    }
  }
</style>
