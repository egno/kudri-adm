<template>
  <v-card flat>
    <v-card-title>Учетная запись</v-card-title>
    <v-form>
      <v-text-field label="E-mail" v-model="data.data.email" prepend-icon="email"></v-text-field>
    </v-form>
        <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="sendData">Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Api from "@/api/backend";

export default {
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
  },
  mounted() {
    this.fetchData();
  }
};
</script>
