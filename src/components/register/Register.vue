<template>
  <VFlex
    xs12
    offset-sm2
    sm8
    offset-md4
    md4
    class="text-xs-center"
  >
    <v-card flat>
      <v-card-text>
        <VForm
          v-if="!sended && !keyCode"
          ref="formLogin"
        >
          <v-layout column>
            <VFlex pa-2>
              <div class="businesscard__h1">
                Регистрация Бизнеса
              </div>
            </VFlex>
            <VFlex pa-2>
              <VSelect
                v-if="!restoreMode"
                v-model="ftype"
                :items="roles"
                label="Ваш бизнес"
              />
            </VFlex>
            <VFlex v-if="false" pa-2>
              <VTextField
                v-model="companyName"
                label="Название компании"
                required
                :rules="[rules.required]"
              />
            </VFlex>
            <VFlex v-if="false" pa-2>
              <VTextField
                v-model="userName"
                label="Имя и фамилия"
                required
                :rules="[rules.required]"
              />
            </VFlex>
            <VFlex pa-2>
              <VTextField
                id="flogin"
                v-model="flogin"
                name="flogin"
                label="Телефон"
                phone
                type="flogin"
                :rules="[rules.phone]"
              />
            </VFlex>
            <VFlex pa-2>
              <div>
                <v-layout align-center>
                  <v-checkbox
                    v-model="offerAgree"
                    color="blue"
                  />
                  <div class="text-sm-left">
                    <span class="caption">Соглашаюсь с <a
                      href="https://docs.google.com/document/d/1Ioe9v58FGXfI7o1ExWPGR9aMkeYyU6LCJenMniPSsl4"
                      target="_blank"
                    >правилами</a>, <a
                      href="https://docs.google.com/document/d/1JWxq7uHt7H9CKhqyJLIozc-JeAT9aNXUszZ1m2Dd4Os"
                      target="_blank"
                    >политикой</a> конфиденциальности и разрешаю проводить аналитику своих персональных данных</span>
                  </div>
                  <v-layout />
                </v-layout>
              </div>
            </VFlex>
            <VFlex pa-2>
              <VBtn
                color="success"
                :disabled="!offerAgree || !flogin || !loginIsCorrect"
                @click="sendLogin"
              >
                Создать
              </VBtn>
            </VFlex>
          </v-layout>
        </VForm>

        <div v-if="loginIsEmail === true && !keyCode">
          <div>
            Вам на почту
            <strong>{{ flogin }}</strong>
            отправлено письмо с сылкой
            для авторизации
          </div>
          <div>Перейдите по ссылке в письме</div>

          <div>Не пришло письмо?</div>

          <a href="#">
            Отправить еще раз
          </a>
          <br>
        </div>

        <VForm
          v-if="loginIsEmail === false && !showPasswordInputs && !keyCode"
          ref="formCode"
        >
          <div>
            На номер телефона
            <strong>{{ flogin }}</strong>
            отправлен код авторизации
          </div>
          <VTextField
            id="fcode"
            v-model="fcode"
            name="fcode"
            label="Введите код"
            type="code"
            :rules="fcodeRules"
            :error-messages="badCode"
          />
          <VBtn
            v-if="codeTries"
            color="success"
            @click="sendCode"
          >
            Проверить
          </VBtn>
          <div>Не пришёл код?</div>
          <a
            href="#"
            @click="sendLogin"
          >
            Отправить еще раз
          </a>
          <br>
        </VForm>

        <VForm
          v-if="showPasswordInputs"
          ref="passwords"
          v-model="valid"
        >
          <span>Придумайте пароль для входа</span>
          <VTextField
            id="fpassword"
            v-model="fpassword"
            prepend-icon="lock"
            name="fpassword"
            :rules="passRules"
            label="Пароль"
            type="password"
            browser-autocomplete="new-password"
            required
          />
          <VTextField
            id="fpasswordRepeat"
            v-model="fpasswordRepeat"
            prepend-icon="lock"
            :rules="passRepeatRules"
            name="fpasswordRepeat"
            label="Повторите пароль"
            type="password"
            browser-autocomplete="new-password"
            required
          />
          <VBtn
            color="primary"
            @click="registerAndLogin"
          >
            Войти
          </VBtn>
        </VForm>

        <div v-if="keyCode">
          {{ badCode }}
        </div>
      </v-card-text>
    </v-card>
  </VFlex>
</template>  

<script>
import Api from '@/api/backend'
import { makeAlert } from '@/api/utils'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    frole: { type: String, default: 'business' }
  },
  data () {
    return {
      rules: {
        phone: value => {
          const pattern = /^[+]*([0-9]){11}$/
          const val = value.replace(/[^0-9]/g,'')
          return (
            pattern.test(val) || 'Введите действительный номер телефона.'
          )
        },
        required: value => !!value || 'Обязательно для заполнения'
      },
      companyName: '',
      fpasswordRepeat: '',
      fpassword: '',
      sended: false,
      badCode: '',
      valid: false,
      snackbar: false,
      showPasswordInputs: false,
      ftype: '',
      codeTries: 1,
      flogin: '',
      fcode: null,
      fcodeRules: [v => !!v || 'Код не действителен.'],
      froleRules: [v => !!v || 'Выберите тип бизнеса'],
      loginRules: [
        v => !!v || 'Введите действительный номер телефона или e-mail',
        v =>
          (v && v.length >= 6) ||
          'Введите действительный номер телефона или e-mail'
      ],
      passRules: [
        v => !!v || 'Пароль должен содержать не менее 6 символов',
        v =>
          (v && v.length >= 6) || 'Пароль должен содержать не менее 6 символов'
      ],
      passRepeatRules: [
        v => (!!v && v === this.fpassword) || 'Пароли не совпадают'
      ],
      offerAgree: false,
      userAlreadyInitialized: false,
      userName: ''
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn',
      roles: 'businessCategories',
      avatar: 'userAvatar',
      userID: 'userID',
      userInfo: 'userInfo'
    }),
    keyCode () {
      return this.$route.params.code
    },
    url () {
      return this.flogin.includes('@') ? 'rpc/check_email' : 'rpc/check_phone'
    },
    loginIsEmail () {
      if (this.sended === true) {
        return this.flogin.includes('@') ? true : false
      } else {
        return undefined
      }
    },
    restoreMode () {
      return this.$route && this.$route.name === 'restorePassword'
    },
    loginIsCorrect () {
      return this.rules.phone(this.flogin) === true
    }
  },
  watch: {
    userID: function (newVal, oldVal) {
      if (!oldVal && newVal && oldVal !== newVal) {
        this.userAlreadyInitialized = true
        return
      }

      if (this.userAlreadyInitialized && newVal && oldVal !== newVal) {
        this.goHome()
      }
    },
    keyCode: 'checkKeyCode'
  },
  mounted () {
    this.checkKeyCode()
  },
  methods: {
    ...mapActions([
      'alert',
      'login',
      'logout',
      'openMessageWindow',
      'register'
    ]),
    checkKeyCode () {
      if (!this.keyCode) {
        return
      }
      this.sendKeyCode(this.keyCode)
    },
    goHome () {
      this.$router.push({
        name: 'home'
      })
    },
    registerAndLogin () {
      if (this.$refs.passwords.validate()) {
        this.register({
          role: this.frole,
          login: this.flogin,
          pass: this.fpassword
        })
      }
    },
    sendLogin () {
      if (this.loginIsEmail === false || this.$refs.formLogin.validate()) {
        Api()
          .post(this.url, {
            login: this.flogin,
            code: null,
            j: { business_category: this.ftype }
          })
          .then(res => {
            this.sended = true
            this.$nextTick(function () {
              this.$refs.formCode.resetValidation()
            })
            this.fcode = ''
            this.badCode = ''
            this.codeTries = res.data.attempts
            if (res.data.seconds) {
              this.alert({
                message:
                  'Новый код можно будет отправить через ' + res.data.seconds
              })
            }
          })
          .catch(res => {
            console.log('FAILURE!!', res)
          })
      }
    },
    sendCode () {
      if (this.$refs.formCode.validate()) {
        this.badCode = ''
        Api()
          .post(this.url, {
            login: this.flogin,
            code: this.fcode
          })
          .then(res => {
            if (
              res.data.status === 'confirmed' ||
              res.data.status === 'success'
            ) {
              this.showPasswordInputs = true
              this.$nextTick(function () {
                this.$refs.passwords.resetValidation()
              })
            }
            if (res.data.status == 'waiting') {
              this.badCode = 'Код введен неверно'
            }
            if (res.data.status == 'fail') {
              this.badCode = 'Код недействителен. Нужно послать новый код'
            }
            this.codeTries = res.data.attempts
          })
          .catch(err => {
            console.log(err)
            this.alert(makeAlert(err))
          })
      }
    },
    sendKeyCode (code) {
      if (!code) return

      Api()
        .post('rpc/check_email', {
          login: null,
          code: code
        })
        .then(res => {
          if (res.data.status === 'confirmed') {
            this.showPasswordInputs = true
            this.flogin = res.data.login
            this.$nextTick(function () {
              this.$refs.passwords.resetValidation()
            })
          }
          if (res.data.status === 'fail') {
            this.badCode = 'Ссылка устарела'
          }
        })
        .catch(err => {
          console.log(err)
          this.alert(makeAlert(err))
        })
    }
  }
}
</script>

<style>
</style>
