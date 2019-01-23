<template>
  <VFlex
    xs4
    offset-xs4
    class="text-xs-center"
  >
    <VForm
      v-if="!sended"
      ref="formLogin"
    >
      <VSelect
        v-model="ftype"
        :items="roles"
        item-text="name"
        item-value="value"
        label="Ваш бизнес"
        :rules="froleRules"
      />
      <VTextField
        id="flogin"
        v-model="flogin"
        name="flogin"
        label="Телефон или e-mail"
        phone
        type="flogin"
        :rules="[rules.email]"
      />
      <VBtn
        color="success"
        @click="sendLogin"
      >
        Создать
      </VBtn>
    </VForm>

    <div v-if="loginIsEmail === true">
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
      v-if="loginIsEmail === false && !showPasswordInputs"
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
        Создать
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
        required
      />
      <VBtn
        color="primary"
        @click="registerAndLogin"
      >
        Войти
      </VBtn>
    </VForm>

    <ModalModer v-if="loginIsEmail || (loginIsEmail === false && !showPasswordInputs)" />
  </VFlex>
</template>  

<script>
import Api from '@/api/backend';
import { makeAlert } from '@/api/utils';
import { mapGetters, mapActions } from 'vuex';
import ModalModer from '@/components/register/ModalModer.vue';

export default {
  components: { ModalModer },
  props: {
    frole: { type: String, default: 'business' }
  },
  data() {
    return {
      rules: {
        email: value => {
          if (value.includes('@')) {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (
              pattern.test(value) ||
              'Введите действительный номер телефона или e-mail.'
            );
          } else {
            const pattern = /^[+]*([0-9]){11}$/;
            return (
              pattern.test(value) ||
              'Введите действительный номер телефона или e-mail.'
            );
          }
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
      roles: [
        {
          name: 'Салон красоты',
          value: '1'
        },
        {
          name: 'Spa салон',
          value: '2'
        },
        {
          name: 'Массажный салон',
          value: '3'
        },
        {
          name: 'Фитнес клуб',
          value: '4'
        },
        {
          name: 'Тату салон',
          value: '5'
        },
        {
          name: 'Маникюрная студия',
          value: '6'
        },
        {
          name: 'Косметологический кабинет',
          value: '7'
        },
        {
          name: 'Частный мастер',
          value: '8'
        }
      ],
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
      avatar: 'userAvatar',
      userID: 'userLogin',
      userInfo: 'userInfo'
    }),
    url() {
      return this.flogin.includes('@') ? 'rpc/check_email' : 'rpc/check_phone';
    },
    loginIsEmail() {
      if (this.sended === true) {
        return this.flogin.includes('@') ? true : false;
      } else {
        return undefined;
      }
    }
  },
  watch: {},
  methods: {
    ...mapActions(['alert', 'login', 'logout', 'register']),
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
            code: null
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
            if (res.data.status == 'confirmed') {
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
    }
  }
};
</script>

<style>
</style>
