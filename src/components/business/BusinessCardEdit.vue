<template>
  <VCard
    v-if="data"
    flat
  >
    <VCardTitle>Основная информация</VCardTitle>
    <VBtn
      fab
      left
      large
      @click="avatarEdit = !avatarEdit"
    >
      <UserAvatar
        :name="name"
        size="4em"
        :src="avatar"
      />
    </VBtn>
    <VCardText>
      <VForm
        v-model="valid"
        lazy-validation
      >
        <VTextField
          v-model="data.j.name"
          label="Название"
          prepend-icon="account_box"
          :rules="[() => !!data.j.name || 'Это поле обязательно для заполнения']"
          required
        />
        <VCombobox
          v-model="data.j.category"
          :disabled="categoryDisabled"
          :items="businessCategories"
          label="Тип"
          :rules="[rules.category]"
        />
        <VTextField
          v-model="data.j.inn"
          label="ИНН"
          mask="############"
          prepend-icon="assignment"
          :rules="[rules.INN_counter]"
        />
        <v-layout row>
          <v-flex>
            <AddressAutocomplete
              v-model="data.j.address"
              label="Адрес"
              prepend-icon="local_post_office"
            />
          </v-flex>
          <v-flex>
            <VTextField
              v-model="data.j.office"
              label="Офис"
            />
          </v-flex>
        </v-layout>

        <BusinessPhonesEdit
          :phones="phones"
          @onEdit="phonesEdit"
        />
        <VTextField
          v-model="data.j.links.instagram"
          label="Имя профиля в Instagram"
        />
        <VTextField
          v-model="data.j.links.vk"
          label="Имя профиля в VK"
        />
        <VTextField
          v-model="data.j.site"
          label="Ссылка на собственный сайт"
        />
        <BusinessScheduleEdit
          :schedule="data.j.schedule"
          @onEdit="scheduleEdit"
        />
      </VForm>
    </VCardText>
    <VCardActions>
      <VSpacer />
      <VBtn
        :disabled="hasErrors"
        color="primary"
        @click="close"
      >
        Сохранить
      </VBtn>
    </VCardActions>
    <VDialog
      v-model="avatarEdit"
      max-width="350px"
    >
      <VueAvatarEditor
        :avatar="avatar"
        @finished="saveImage"
      />
    </VDialog>
  </VCard>
</template>

<script>
import UserAvatar from '@/components/avatar/UserAvatar.vue';
import VueAvatarEditor from '@/components/avatar/VueAvatarEditor.vue';
import BusinessPhonesEdit from '@/components/business/BusinessPhonesEdit.vue';
import BusinessScheduleEdit from '@/components/business/BusinessScheduleEdit.vue';
import AddressAutocomplete from '@/components/yandex/AddressAutocomplete.vue';
import Api from '@/api/backend';
import router from '@/router';
import { backendMixins } from '@/api/mixins';
import { businessMixins } from '@/components/business/mixins';
import { mapGetters } from 'vuex';

export default {
  components: {
    AddressAutocomplete,
    BusinessPhonesEdit,
    BusinessScheduleEdit,
    UserAvatar,
    VueAvatarEditor
  },
  mixins: [backendMixins, businessMixins],
  data() {
    return {
      avatarEdit: false,
      businessCategories: [
        'Салон красоты',
        'Spa салон',
        'Массажный салон',
        'Фитнес клуб',
        'Тату салон',
        'Маникюрная студия',
        'Косметологический кабинет',
        'Частный мастер'
      ],
      categoryDisabled: false,
      data: undefined,
      rules: {
        category: value => !value || value.length > 2 || 'Выберите тип',
        INN_counter: value =>
          (value &&
            (value.length === 10 ||
              value.length === 12 ||
              'В ИНН должно быть 10 или 12 цифр')) ||
          true
      },
      valid: true
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    avatar() {
      if (this.data.j) {
        return this.data.j.avatar;
      }
      return null;
    },
    hasAddress() {
      return !!(
        this.data &&
        this.data.j &&
        this.data.j.address &&
        this.data.j.address.name
      );
    },
    hasName() {
      return !!(this.data && this.data.j && this.data.j.name);
    },
    hasPhone() {
      return !!(
        this.data &&
        this.data.j &&
        this.data.j.phones &&
        this.data.j.phones[0]
      );
    },
    hasINN() {
      return !!(
        this.data &&
        this.data.j &&
        (this.data.j.category === 'Частный мастер' || this.data.j.inn)
      );
    },
    hasSchedule() {
      return !!(
        this.data &&
        this.data.j &&
        this.data.j.schedule &&
        this.data.j.schedule.data &&
        this.data.j.schedule.data.reduce(
          (acc, cur) => acc || (cur && cur.length > 1 && cur[0] && cur[1]),
          false
        )
      );
    },
    hasErrors() {
      return !(
        this.hasAddress &&
        this.hasName &&
        this.hasPhone &&
        this.hasINN &&
        this.hasSchedule &&
        this.valid
      );
    },
    id() {
      return this.$route.params.id;
    },
    name() {
      if (this.data.j) {
        return this.data.j.name;
      }
      return null;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    close() {
      this.sendData();
      this.$emit('onEditClose');
    },
    fetchData() {
      if (this.id === 'new') {
        this.data = this.dataPrefill();
        return;
      }
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          if (res && !res.access) {
            this.$emit('onEditClose');
          }
          this.data = this.dataPrefill(res);
          if (
            !(this.data.j && this.data.j.category) &&
            this.userInfo &&
            this.userInfo.data &&
            this.userInfo.data.j &&
            this.userInfo.data.j.category
          ) {
            this.data.j.category = this.userInfo.data.j.category;
          }
          if (this.data.j.category) {
            this.categoryDisabled = true;
          }
        });
    },
    phonesEdit(payload) {
      this.data.j.phones = payload;
    },
    sendData() {
      this.data.j.phones = this.data.j.phones.filter(x => x > '');
      if (this.id === 'new') {
        Api()
          .post(`business`, this.data)
          .then(res => {
            const newId = this.locationId(res.headers);
            console.log(newId);
            if (newId) {
              router.push({ name: 'businessCard', params: { id: newId } });
            }
          });
      } else {
        Api().patch(`business?id=eq.${this.id}`, this.data);
      }
    },
    scheduleEdit(payload) {
      this.data.j.schedule = payload;
    }
  }
};
</script>
