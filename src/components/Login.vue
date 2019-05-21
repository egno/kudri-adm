<template>
  <div>
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
    ...mapGetters(['loggedIn', 'userID', 'userInfo']),
    loaded () {
      return this.userInfo !== undefined
    }
  },
  watch: {
    loggedIn (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.$emit('loggedIn')
        this.$router.push({ name: 'home' })
      }
    }
  },
  methods: {
    ...mapActions(['login', 'logout']),
    goRestorePassword () {
      this.$router.push({ name: 'restorePassword' })
    },
    sendLogin () {
      this.login({ login: this.flogin, pass: this.fpassword })
    },
    sendLogout () {
      this.logout()
      this.$router.push({ name: 'home' })
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
