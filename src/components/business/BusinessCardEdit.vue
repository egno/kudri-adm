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
    <VForm>
      <VTextField
        v-model="data.data.name"
        label="Название"
        prepend-icon="account_box"
      />
      <VTextField
        v-model="data.data.inn"
        label="ИНН"
        prepend-icon="assignment"
      />
      <VTextField
        v-model="data.data.address"
        label="Адрес"
        prepend-icon="local_post_office"
      />
      <VTextField
        v-model="data.data.phone"
        label="Телефон"
        prepend-icon="phone"
      />
    </VForm>
    <VCardActions>
      <VSpacer />
      <VBtn
        color="primary"
        @click="close"
      >
        Сохранить
      </VBtn>
    </VCardActions>
    <VDialog v-model="avatarEdit">
      <VueAvatarEditor @finished="saveImage" />
    </VDialog>
  </VCard>
</template>

<script>
import UserAvatar from '@/components/avatar/UserAvatar.vue';
import VueAvatarEditor from '@/components/avatar/VueAvatarEditor.vue';
import Api from '@/api/backend';
import axios from 'axios';

export default {
  components: { UserAvatar, VueAvatarEditor },
  data() {
    return {
      avatarEdit: false,
      data: { data: {} }
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
    fetchData() {
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.data = res;
        });
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
      Api().patch(`business?id=eq.${this.id}`, this.data);
    },
    uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }
};
</script>
