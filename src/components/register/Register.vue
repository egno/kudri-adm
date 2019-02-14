<template>
  <VFlex
    xs4
    offset-xs4
    class="text-xs-center"
  >
    <VForm
      v-if="!sended && !keyCode"
      ref="formLogin"
    >
      <VSelect
        v-if="!restoreMode"
        v-model="ftype"
        :items="roles"
        label="Ваш бизнес"
      />
      <VTextField
        id="flogin"
        v-model="flogin"
        name="flogin"
        label="Телефон"
        phone
        type="flogin"
        :rules="[rules.email]"
      />
      <VBtn
        color="success"
        @click="sendLogin"
      >
        Подтвердить
      </VBtn>
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

    <a
      href="#"
      @click="openMessageWindow"
    >
      Связаться с тех. поддержкой
    </a>
  </VFlex>
</template>  

<script>
import Api from '@/api/backend';
import { makeAlert } from '@/api/utils';
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    frole: { type: String, default: 'business' }
  },
  data() {
    return {
      rules: {
        email: value => {
          const pattern = /^[+]*([0-9]){11}$/;
          return (
            pattern.test(value) || 'Введите действительный номер телефона.'
          );
        }
      },
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
      ]
    };
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn',
      roles: 'businessCategories',
      avatar: 'userAvatar',
      userID: 'userID',
      userInfo: 'userInfo'
    }),
    keyCode() {
      return this.$route.params.code;
    },
    url() {
      return this.flogin.includes('@') ? 'rpc/check_email' : 'rpc/check_phone';
    },
    loginIsEmail() {
      if (this.sended === true) {
        return this.flogin.includes('@') ? true : false;
      } else {
        return undefined;
      }
    },
    restoreMode() {
      return this.$route && this.$route.name === 'restorePassword';
    }
  },
  watch: {
    userID: function(newVal, oldVal) {
      console.log(newVal, oldVal);
      if (newVal && oldVal !== newVal) {
        this.goHome();
      }
    },
    keyCode: 'checkKeyCode'
  },
  mounted() {
    this.checkKeyCode();
  },
  methods: {
    ...mapActions([
      'alert',
      'login',
      'logout',
      'openMessageWindow',
      'register'
    ]),
    checkKeyCode() {
      if (!this.keyCode) {
        return;
      }
      this.sendKeyCode(this.keyCode);
    },
    goHome() {
      this.$router.push({
        name: 'home'
      });
    },
    registerAndLogin() {
      if (this.$refs.passwords.validate()) {
        this.register({
          role: this.frole,
          login: this.flogin,
          pass: this.fpassword
        });
      }
    },
    sendLogin() {
      if (this.loginIsEmail === false || this.$refs.formLogin.validate()) {
        Api()
          .post(this.url, {
            login: this.flogin,
            code: null,
            j: { business_category: this.ftype }
          })
          .then(res => {
            this.sended = true;
            this.$nextTick(function() {
              this.$refs.formCode.resetValidation();
            });
            this.fcode = '';
            this.badCode = '';
            this.$refs.formCode.resetValidation();
            this.codeTries = res.data.attempts;
            if (res.data.seconds) {
              this.alert({
                message:
                  'Новый код можно будет отправить через ' + res.data.seconds
              });
            }
          })
          .catch(function() {
            console.log('FAILURE!!');
          });
      }
    },
    sendCode() {
      if (this.$refs.formCode.validate()) {
        this.badCode = '';
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
              this.showPasswordInputs = true;
              this.$nextTick(function() {
                this.$refs.passwords.resetValidation();
              });
            }
            if (res.data.status == 'waiting') {
              this.badCode = 'Код введен неверно';
            }
            if (res.data.status == 'fail') {
              this.badCode = 'Код недействителен. Нужно послать новый код';
            }
            this.codeTries = res.data.attempts;
          })
          .catch(err => {
            console.log(err);
            this.alert(makeAlert(err));
          });
      }
    },
    sendKeyCode(code) {
      if (!code) return;

      Api()
        .post('rpc/check_email', {
          login: null,
          code: code
        })
        .then(res => {
          if (res.data.status === 'confirmed') {
            this.showPasswordInputs = true;
            this.flogin = res.data.login;
            this.$nextTick(function() {
              this.$refs.passwords.resetValidation();
            });
          }
          if (res.data.status === 'fail') {
            this.badCode = 'Ссылка устарела';
          }
        })
        .catch(err => {
          console.log(err);
          this.alert(makeAlert(err));
        });
    }
  }
};
</script>

<style>
</style>
