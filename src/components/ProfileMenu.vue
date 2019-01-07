<template>
  <VMenu
    v-model="menu"
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
            v-if="loggedIn"
            class="ma-1"
            :name="displayName"
            :src="avatar"
          />
        </VFlex>
        <VFlex class="hidden-sm-and-down">
          {{ displayName || "Войти" }}
        </VFlex>
      </VLayout>
    </VBtn>
    <VList>
      <VCard v-if="loggedIn">
        <VCardTitle primary-title>
          <div>
            <h3 class="headline mb-0">
              Выйти из личного кабинета?
            </h3>
            <div>
              Сейчас вы авторизованы как
              <span class="font-weight-medium">
                {{ userID }}
              </span>
            </div>
          </div>
        </VCardTitle>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            @click="sendLogout"
          >
            Выйти
          </VBtn>
        </VCardActions>
      </VCard>
      <VCard v-else>
        <VCardText>
          <VForm>
            <VTextField
              v-model="flogin"
              prepend-icon="person"
              name="email"
              label="e-mail"
              type="text"
            />
            <VTextField
              id="password"
              v-model="fpassword"
              prepend-icon="lock"
              name="password"
              label="Пароль"
              type="password"
            />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            @click="sendLogin"
          >
            Войти
          </VBtn>
        </VCardActions>
      </VCard>
    </VList>
  </VMenu>
</template>

<script>
import router from '@/router';
import UserAvatar from '@/components/avatar/UserAvatar.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: { UserAvatar },
  props: {
    source: { type: String, default: () => '' }
  },
  data: () => ({
    drawer: null,
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
    displayName() {
      if (!this.userInfo) return;
      if (this.userInfo.data) {
        if (this.userInfo.data.name) {
          return this.userInfo.data.name;
        }
      }
      return this.userID;
    }
  },
  methods: {
    ...mapActions(['login', 'logout']),
    sendLogin() {
      this.login({ login: this.flogin, pass: this.fpassword });
      this.menu = false;
    },
    sendLogout() {
      this.logout();
      router.push({ name: 'home' });
      this.menu = false;
    }
  }
};
</script>
