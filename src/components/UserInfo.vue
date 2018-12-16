<template>
  <VCard flat>
    <VCardTitle>Учетная запись</VCardTitle>
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
import Api from "@/api/backend";

export default {
  data () {
    return {
      data: { data: {} }
    };
  },
  computed: {
    id () {
      return this.$route.params.id;
    }
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    fetchData () {
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.data = res;
        });
    },
    sendData () {
      Api().patch(`business?id=eq.${this.id}`, this.data);
    }
  }
};
</script>
