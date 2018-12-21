<template>
  <VCard flat>
    <VCardTitle>Основная информация</VCardTitle>
    <Avatar
      :name="name"
      size="10em"
      :src="avatar"
    />
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
        @click="sendData"
      >
        Сохранить
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script>
import Avatar from '@/components/common/Avatar.vue';
import Api from '@/api/backend';

export default {
  components: { Avatar },
  data() {
    return {
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
    fetchData() {
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.data = res;
        });
    },
    sendData() {
      Api().patch(`business?id=eq.${this.id}`, this.data);
    }
  }
};
</script>
