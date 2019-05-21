<template>
  <div class="login-form">
    <VCard v-if="loaded && loggedIn===true">
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
    <div v-if="loaded && loggedIn===false">
      <VForm class="businesscard-form _login">
        <VTextField
          v-model="flogin"
          name="username"
          label="Логин"
          type="text"
          browser-autocomplete="username"
          class="businesscard-form__field"
          :rules="[ rules.required ]"
        />
        <VTextField
          id="password"
          v-model="fpassword"
          name="password"
          label="Пароль"
          type="password"
          browser-autocomplete="current-password"
          class="businesscard-form__field"
          :rules="[ rules.required ]"
        />
        <div>
          <a @click="goRestorePassword">
            Забыли пароль?
          </a>
        </div>
        <MainButton
          type="button"
          :class="['button', 'save-info', { button_disabled: !flogin || !fpassword }]"
          @click.native.stop="sendLogin"
        >
          Вход
        </MainButton>
      </VForm>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MainButton from '@/components/common/MainButton.vue'
import Api from '@/api/backend'

export default {
  components: { MainButton },
  props: {
    source: { type: String, default: () => '' }
  },
  data: () => ({
    drawer: null,
    errorMessage: null,
    flogin: '',
    fpassword: '',
    snack: false,
    snackText: '',
    snackColor: 'error',
    rules: {
      required: value => !!value || 'Это поле обязательно для заполнения'
    }
  }),
  computed: {
    ...mapGetters(['loggedIn', 'userID', 'userInfo', 'userRole']),
    loaded () {
      return this.userInfo !== undefined
    }
  },
  watch: {
    loggedIn (newVal) {
      if (newVal) {
        this.loadBusiness()
      }
    }
  },
  mounted () {
    this.loadBusiness()
  },
  methods: {
    ...mapActions(['login', 'logout']),
    goRestorePassword () {
      this.$router.push({ name: 'restorePassword' })
    },
    loadBusiness () {
      if (!this.loggedIn) return

      Api()
        .get(`my_business`)
        .then(res => res.data)
        .then(res => {
          this.businessCount = res.length
          if (this.userRole === 'manager' || this.userRole === 'admin') {
            this.$router.push({
              name: 'myBusinessList'
            })
            return
          }
          const company = res.find(business => business.type === 'C')
          const filial = res.find(business => !!business.parent)
          // if user has access to 1 company with no branches
          if (this.businessCount === 1 && res[0].id && !company && !filial) {
            this.$router.push({
              name: 'businessCard',
              params: { id: res[0].id }
            })
            return
          }
          // if user has no access to a company
          if (!company && filial && filial.id) {
            this.$router.push({
              name: 'filialList',
              params: { id: filial.parent }
            })
            return
          }
          // if user has access to a company
          if (company) {
            this.$router.push({
              name: 'businessCard',
              params: { id: company.id }
            })
            return
          }
        })
    },
    sendLogin () {
      this.login({ login: this.flogin, pass: this.fpassword })
    },
    sendLogout () {
      this.logout()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="scss">
@import '../assets/styles/businesscard-form';
._login {
  .businesscard-form__field {
    margin-top: 0;
  }
}
</style>
