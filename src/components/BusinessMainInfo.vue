 <template>
  <v-card flat >
        <v-card-title>Основная информация</v-card-title>
    <v-form>
      <v-text-field label="Название" v-model="data.data.name" prepend-icon="account_box"></v-text-field>
      <v-text-field label="ИНН" v-model="data.data.inn" prepend-icon="assignment"></v-text-field>
      <v-text-field label="Адрес" v-model="data.data.address" prepend-icon="local_post_office"></v-text-field>
      <v-text-field label="Телефон" v-model="data.data.phone" prepend-icon="phone"></v-text-field>
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
