<template>
  <VMenu
    v-if="loggedIn"
    v-model="menu"
    class="profile-menu"
    left
    full-width
    offset-y
    disable-resize-watcher
    min-width="150"
    max-width="150"
    :close-on-content-click="false"
  >
    <VBtn
      slot="activator"
      flat
    >
      <VLayout
        align-center
        row
        spacer
      >
        <VFlex>
          <UserAvatar
            :new-message="newMessage"
            :size="avatarSize"
            :name="displayName"
            :src="avatar"
          />
        </VFlex>
        <div class="profile-expand-more" style="width: 24px; height: 24px">
          <v-icon>expand_more</v-icon>
        </div>
      </VLayout>
    </VBtn>
    <VList class="menu-list">
      <template>
        <VListTile
          v-for="(item, index) in menuList"
          :key="index"
          :to="item.route"
          @click="menuHandler(item.action)"
        >
          <VListTileTitle class="caption">
            {{ item.title }}
          </VListTileTitle>
          <span
            v-if="item.count"
            class="caption count"
            :class="{ attention: item.count === '!' }"
            flat
          >
            {{ item.count }}
          </span>
        </VListTile>
      </template>
    </VList>
  </VMenu>
  <VMenu
    v-else
    v-model="menu"
    left
    full-width
    offset-y
    disable-resize-watcher
    min-width="300"
    max-width="300"
    :close-on-content-click="false"
  >
    <VBtn
      slot="activator"
      flat
    >
      <VLayout
        align-center
        row
        spacer
      >
        <VFlex class="hidden-sm-and-down">
          {{ "Войти" }}
        </VFlex>
      </VLayout>
    </VBtn>
    <VList>
      <template>
        <VCardText>
          <VForm>
            <VTextField
              v-model="flogin"
              prepend-icon="person"
              name="email"
              label="e-mail"
              type="text"
              browser-autocomplete="login"
            />
            <VTextField
              id="password"
              v-model="fpassword"
              prepend-icon="lock"
              name="password"
              label="Пароль"
              type="password"
              browser-autocomplete="current-password"
            />
          </VForm>
          <div>
            <a @click="goRestorePassword">
              Забыли пароль?
            </a>
          </div>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="sendLogin">
            Войти
          </VBtn>
        </VCardActions>
      </template>
    </VList>
  </VMenu>
</template>

<script>
import router from '@/router'
import UserAvatar from '@/components/avatar/UserAvatar.vue'

import { mapGetters, mapActions } from 'vuex'

export default {
  components: { UserAvatar },
  props: {
    source: { type: String, default: () => '' }
  },
  data: () => ({
    avatarSize: '24px',
    dialog: false,
    newMessage: false,
    errorMessage: null,
    flogin: 'manager000000050@test.com',
    fpassword: '000000050',
    menu: false,
    snack: false,
    snackText: '',
    snackColor: 'error'
  }),
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn',
      avatar: 'userAvatar',
      userID: 'userLogin',
      userInfo: 'userInfo'
    }),
    menuList () {
      return [
        {
          title: 'Мой профиль',
          action: 'drawer',
          count: '!'
        },
        {
          title: 'Сообщения',
          route: { name: 'messages' },
          count: 2
        },
        {
          title: 'Личный кабинет',
          route: { name: 'myBusinessList' },
          hide: this.userInfo.role !== 'manager'
        },
        {
          title: 'Выйти',
          action: 'logout',
          url: ''
        }
      ]
    },
    menuWidth () {
      return this.loggedIn ? '154' : '300'
    },
    displayName () {
      if (!this.userID) return

      return (
        (this.userInfo &&
          this.userInfo.data &&
          this.userInfo.data.j &&
          this.userInfo.data.j.name &&
          this.userInfo.data.j.name +
            ' ' +
            (this.userInfo.data.j.surname || '')) ||
        this.userID
      )
    }
  },
  watch: {
    userInfo (newVal, oldVal) {
      if (
        newVal &&
        newVal.role === 'manager' &&
        newVal.role !== (oldVal && oldVal.role) &&
        this.$route.name === 'home'
      ) {
        this.$router.push({ name: 'myBusinessList' })
      }
    }
  },
  methods: {
    ...mapActions(['login', 'logout', 'openProfileDrawer']),
    goRestorePassword () {
      this.menu = false
      this.$router.push({ name: 'restorePassword' })
    },
    menuHandler (action) {
      this.menu = false
      switch (action) {
        case 'logout':
          this.sendLogout()
          break
        case 'drawer':
          this.openDrawer()
          break
        default:
      }
    },
    sendLogin () {
      this.login({ login: this.flogin, pass: this.fpassword })
      this.menu = false
    },
    openDrawer () {
      this.openProfileDrawer()
    },
    sendLogout () {
      this.logout()
      router.push({ name: 'home' })
    }
  }
}
</script>
<style lang="scss">
.v-menu.profile-menu {
  border-left: 1px solid rgba(137, 149, 175, 0.1);
}
.menu-list {
  padding: 17px 0;
  .v-list__tile {
    height: 24px;
    &__title {
      display: flex;
      align-items: center;
    }
  }
  .count,
  .attention {
    width: 16px;
    min-width: 16px;
    height: 16px;
    display: block;
    background: #ef4d37;
    border-radius: 16px;
    text-align: center;
    color: #fff;
    font-size: 11px !important;
  }
  .attention {
    color: #ef4d37;
    background: #fff;
    border: 1px solid #ef4d37;
  }
}
  .profile-expand-more {
    display: none;
    @media only screen and (min-width: 1160px) {
      display: block;
    }
  }
</style>
