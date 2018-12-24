<template>
  <VCard flat>
    <VCardTitle>Основная информация</VCardTitle>
    <VBtn
      fab
      left
      large
      @click="avatarEdit = !avatarEdit"
    >
      <UserAvatar
        :name="name"
        size="4.2em"
        :src="avatar"
      />
    </VBtn>
    <VCardText>
      <VForm>
        <VTextField
          v-model="data.data.name"
          label="Название"
          prepend-icon="account_box"
          :rules="[() => !!data.data.name || 'Это поле обязательно для заполнения']"
          required
        />
        <VTextField
          v-model="data.data.inn"
          label="ИНН"
          mask="############"
          prepend-icon="assignment"
          :rules="[rules.INN_counter]"
        />
        <VTextField
          v-model="data.data.address"
          label="Адрес"
          prepend-icon="local_post_office"
        />
        <BusinessPhonesEdit
          :phones="phones"
          @onEdit="phonesEdit"
        />
        <VTextField
          v-model="data.data.links.instagram"
          label="Имя профиля в Instagram"
        />
        <VTextField
          v-model="data.data.links.vk"
          label="Имя профиля в VK"
        />
      </VForm>
    </VCardText>
    <VCardActions>
      <VSpacer />
      <VBtn
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
import Api from '@/api/backend';
import axios from 'axios';
import { businessMixins } from '@/components/business/mixins';

export default {
  components: { BusinessPhonesEdit, UserAvatar, VueAvatarEditor },
  mixins: [businessMixins],
  data() {
    return {
      avatarEdit: false,
      data: { data: { phones: [], links: {} } },
      rules: {
        INN_counter: value =>
          (value &&
            (value.length === 10 ||
              value.length === 12 ||
              'В ИНН должно быть 10 или 12 цифр')) ||
          true
      }
    };
  },
  computed: {
    avatar() {
      if (this.data.data) {
        return this.data.data.avatar;
      }
      return null;
    },
    id() {
      return this.$route.params.id;
    },
    name() {
      if (this.data.data) {
        return this.data.data.name;
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
    dataPrefill(data) {
      if (!data) {
        data = {};
      }
      if (!data.data) {
        data.data = {};
      }
      if (!data.data.phones) {
        data.data.phones = [];
      }
      if (!data.data.links) {
        data.data.links = {};
      }
      return data;
    },
    fetchData() {
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.data = this.dataPrefill(res);
        });
    },
    phonesEdit(payload) {
      this.data.data.phone = payload;
    },
    saveImage(img) {
      this.avatarEdit = false;
      var blobBin = atob(img.toDataURL().split(',')[1]);
      var array = [];
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }
      var file = new Blob([new Uint8Array(array)], { type: 'image/png' });
      let formData = new FormData();
      let newFileName = `${this.uuidv4()}.png`;
      formData.append('file', file, newFileName);
      let vm = this;
      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function() {
          vm.data.data.avatar = newFileName;
        })
        .then(() => vm.sendData())
        .catch(function() {
          console.log('FAILURE!!');
        });
    },
    sendData() {
      this.data.data.phone = this.data.data.phone.filter(x => x > '');
      Api().patch(`business?id=eq.${this.id}`, this.data);
    }
  }
};
</script>
