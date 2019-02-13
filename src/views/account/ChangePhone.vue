<template>
  <v-container>
    <v-layout>
      <v-flex
        xs12
        sm10
        offset-sm1
        md8
        offset-md2
        lg6
        offset-lg3
        xl4
        offset-xl4
      >
        <v-card
          v-if="userID"
          flat
        >
          <v-card-title primary-title>
            <h3>Изменение телефона</h3>
          </v-card-title>

          <div v-if="!status">
            <v-card-text>
              <div v-if="oldPhone">
                <div>Ваш текущий телефон:</div>
                <div>+{{ oldPhone }}</div>
              </div>
              <div v-else>
                У вас нет зарегистрированного телефона
              </div>
            </v-card-text>
            <v-card-text>
              <v-layout column>
                <v-flex>
                  <v-text-field
                    v-model="phone"
                    label="Новый телефон"
                    :rules="phoneRules"
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!success"
                flat
                color="primary"
                @click="save"
              >
                Сохранить
              </v-btn>
            </v-card-actions>
          </div>

          <div v-if="status==='waiting'">
            <v-card-text>
              На телефон
              <span>+{{ phone }}</span> отправлен код подтверждения.
            </v-card-text>
            <v-card-text>
              Ошиблись?
              <a
                href="#"
                @click="clear"
              >
                Укажите другой телефон
              </a>
            </v-card-text>
            <v-card-text>
              Код не пришел? Проверьте, правильно ли вы указали номер телефона.
              <span
                v-if="timeDisplay"
              >
                Повторно отправить код подтверждения можно будет через
                <span>{{ timeDisplay }}</span>.
              </span>
              <span v-else>
                <a
                  href="#"
                  @click="save"
                >
                  Повторить отправку
                </a>
              </span>
            </v-card-text>
          </div>
        </v-card>
        <v-card
          v-else
          flat
        >
          Для смены телефона сначала войдите под существующей учетной записью
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import Api from '@/api/backend';

export default {
  data() {
    return {
      phone: '',
      repeatphone: '',
      response: undefined,
      rules: {
        required: value => !!value || 'Обязательно для заполнения.',
        phone: value => {
          const pattern = /^\d$/;
          return pattern.test(value) || 'Некорректный телефон.';
        },
        oldMatches: value =>
          !this.oldPhone ||
          value.trim().toUpperCase() != this.oldPhone.toUpperCase() ||
          'Введенные адрес телефон уже используется вами.'
      },
      status: '',
      timeToRepeat: undefined
    };
  },
  computed: {
    ...mapGetters(['userID', 'userInfo']),
    phoneRules() {
      return [this.rules.required, this.rules.phone, this.rules.oldMatches];
    },
    oldPhone() {
      return (
        this.userInfo && this.userInfo.data && this.userInfo.data.phone.trim()
      );
    },
    success() {
      return !!this.phone && !this.phoneRules.some(r => r(this.phone) !== true);
    },
    timeDisplay() {
      if (!this.timeToRepeat) return;
      return `${this.timeToRepeat} мин`;
    }
  },
  watch: {
    response: 'processResponse'
  },
  methods: {
    clear() {
      this.status = undefined;
      this.timeToRepeat = undefined;
    },
    processResponse() {
      if (!this.response) return;
      this.status = this.response.status;
      if (this.response.error_code === '22U12') {
        this.setTime(+this.response.seconds.split(':')[1] + 1);
        return;
      }
    },
    save() {
      if (!this.success) return;
      const data = {
        login: this.phone.trim(),
        code: null
      };
      Api()
        .post('rpc/check_phone', data)
        .then(res => res.data)
        .then(res => {
          this.response = res;
        });
    },
    setTime(minutes) {
      if (!minutes) {
        this.timeToRepeat = undefined;
        return;
      }
      this.timeToRepeat = minutes;
      setTimeout(() => {
        this.setTime(minutes - 1);
      }, 60 * 1000);
    }
  }
};
</script>
