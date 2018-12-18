<template>
  <VCard flat>
    <VCardTitle>Учетная запись</VCardTitle>
    <UserAvatar
      v-if="email"
      class="ma-1"
      :name="data.data.name || data.data.email"
      :src="data.data.avatar || `${id}.png`"
    />
    <VueAvatarEditor @finished="saveImage" />
    <img ref="image">
    <VForm>
      <VTextField
        v-model="data.data.email"
        label="E-mail"
        prepend-icon="email"
      />
    </VForm>
    <VCardActions>
      <VSpacer />
      <VBtn
        color="primary"
        @click="sendData"
      >
        Сохранить
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script>
import UserAvatar from '@/components/UserAvatar.vue';
import VueAvatarEditor from '@/components/VueAvatarEditor.vue';
import Api from '@/api/backend';
import axios from 'axios';

export default {
  components: {
    VueAvatarEditor: VueAvatarEditor,
    UserAvatar: UserAvatar
  },
  data() {
    return {
      data: { data: {} }
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    email() {
      return this.data.data.email;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
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
      this.$refs.image.src = img.toDataURL();
      var blobBin = atob(img.toDataURL().split(',')[1]);
      var array = [];
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }
      var file = new Blob([new Uint8Array(array)], { type: 'image/png' });
      let formData = new FormData();
      console.log(file);
      formData.append('file', file, `${this.id}.png`);
      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function() {
          console.log('SUCCESS!!');
        })
        .catch(function() {
          console.log('FAILURE!!');
        });
    },
    sendData() {
      this.saveImage();
      Api().patch(`business?id=eq.${this.id}`, this.data);
    }
  }
};
</script>
