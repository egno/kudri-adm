<template>
  <VFlex
    xs4
    offset-xs4
    class="text-xs-center"
  >
    <VForm
      v-if="!sended"
      ref="form"
    >
      <VSelect
        v-model="ftype"
        :items="roles"
        item-text="name"
        item-value="value"
        label="Ваш бизнес"
        :rules="froleRules"
        required
      />
      <VTextField
        id="flogin"
        v-model="flogin"
        name="flogin"
        label="Телефон или e-mail"
        phone
        type="flogin"
        :rules="[rules.email]"
        required
        lazy-validate
      />
      <VBtn
        color="success"
        @click="sendLogin"
      >
        Создать
      </VBtn>
    </VForm>
    
    <div v-if="loginIsEmail">
      <div>
        Вам на почту <strong>{{ flogin }}</strong>
        отправлено письмо с сылкой
        для авторизации
      </div>
      <div>
        Перейдите по ссылке в письме
      </div>
      
      <div>
        Не пришло письмо?
      </div>
  
      <a href="#">
        Отправить еще раз
      </a> <br>
      <a href="#">
        Связаться с тех. поддержкой
      </a>
    </div>
    
    <div v-if="loginIsEmail === false && !showPasswordInputs">
      <div>
        На номер телефона <strong>{{ flogin }}</strong>
        отправлен код авторизации
      </div>
      <VTextField
        id="fcode"
        v-model="fcode"
        name="fcode"
        label="Введите код"
        type="code"
        :rules="[rules.required]"
      />
      <div v-if="badCode">
        Код не действителен.
      </div>
      <VBtn
        color="success"
        @click="sendCode"
      >
        Создать
      </VBtn>
      <div>Не пришёл код?</div>
      <a href="#">
        Отправить еще раз
      </a><br>
      <a href="#">
        Связаться с тех. поддержкой
      </a>
    </div>
    
    <VForm
      v-if="showPasswordInputs"
      ref="passwords"
      v-model="valid"
    >
      <span>
        Придумайте пароль для входа
      </span>
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
        :disabled="!valid"
        @click="registerAndLogin"
      >
        Войти
      </VBtn>
    </VForm>
  
    <ModalModer />
  </VFlex>
</template>  

<script>
import Api from '@/api/backend';
import { mapGetters, mapActions } from 'vuex';
import ModalModer from '@/components/register/ModalModer.vue';


export default {
    components: { ModalModer },
    props: {
    frole: { type: String, default: 'business' },
  },
  data() {
    return {
      rules: {
        required: value => !!value || 'Код не действителен.',
        email: value => {
            if (value.includes('@')) {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(value) || 'Введите действительный номер телефона или e-mail.'
            } else {
                const pattern = /^[+]*[0-9]{1,4}([0-9]){10}$/;
                return pattern.test(value) || 'Введите действительный номер телефона или e-mail.'
            }
        }
      },
      fpasswordRepeat: '',
      fpassword: '',
      sended: false,
      badCode: false,
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
        },
      ],
      flogin: '',
      fcode: null,
      froleRules: [
        v => !!v || 'Выберите тип бизнеса',
      ],
      loginRules: [
        v => !!v || 'Введите действительный номер телефона или e-mail',
        v => (v && v.length >= 6) || 'Введите действительный номер телефона или e-mail'
      ],
      passRules: [
        v => !!v || 'Пароль должен содержать не менее 6 символов',
        v => (v && v.length >= 6) || 'Пароль должен содержать не менее 6 символов'
      ],
      passRepeatRules: [
        v => (!!v && v === this.fpassword) || 'Пароли не совпадают'
      ],
    };
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn',
      avatar: 'userAvatar',
      userID: 'userLogin',
      userInfo: 'userInfo'
    }),
    loginIsEmail() {
      if (this.sended === true) {
        return this.flogin.includes('@') ? true : false;
      } else {
        return false
      }
    }
  },
  watch: {

  },
  methods: {
    ...mapActions(['login', 'logout', 'register']),
    registerAndLogin() {
      this.register({ role: this.frole,login: this.flogin, pass: this.fpassword }).then(console.log(res => res.data));
    },
    sendPhone () {
      this.showPasswordInputs = true
    },
    sendLogin() {
      let url = this.flogin.includes('@') ? 'rpc/check_email' : 'rpc/check_phone';
      if (this.$refs.form.validate()) {
        Api().post(url,
          {
            "login": this.flogin,
            "code": null
          })
          .then(res => {
            this.sended = true;
            console.log(res);
          })
          .catch(function() {
              console.log('FAILURE!!');
          });
      }
    },
    sendCode() {
      let url = this.flogin.includes('@') ? 'rpc/check_email' : 'rpc/check_phone';
      this.badCode = false;
      Api().post(url,
        {
          "login": this.flogin,
          "code": this.fcode
        })
        .then(res => {
          this.showPasswordInputs = true;
          console.log(res);
        })
        .catch(() => {
            console.log('FAILURE!!');
            this.badCode = true;
        });
    },
    validate () {
      if (this.$refs.passwords.validate()) {
        this.snackbar = true
      }
    },
    send () {
      if (this.$refs.form.validate()) {
        this.sended = true;
      }
    },
  }
};
</script>

<style>
</style>
