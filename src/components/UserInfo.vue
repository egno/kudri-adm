<template>
  <VCard flat>
    <VCardTitle>Учетная запись</VCardTitle>
    <VueAvatarEditor
      @finished="saveClicked"
      @select-file="saveFile"
    />
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
import VueAvatarEditor from '@/components/VueAvatarEditor.vue';
import Api from '@/api/backend';
import axios from 'axios';

export default {
  components: {
    VueAvatarEditor: VueAvatarEditor
  },
  data() {
    return {
      data: { data: {} }
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
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
    saveClicked: function saveClicked(img) {
      this.$refs.image.src = img.toDataURL();
    },
    saveFile(files) {
      let formData = new FormData();
      console.log(files);
      formData.append('file', files[0]);
      axios
        .post('http://185.244.173.72/uploads/', formData, {
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
      Api().patch(`business?id=eq.${this.id}`, this.data);
    }
  }
};
</script>
