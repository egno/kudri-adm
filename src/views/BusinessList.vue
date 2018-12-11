<template>
  <v-data-table :headers="headers" :items="data" class="elevation-1">
    <template
      slot="items"
      slot-scope="props"
    >
      <td>{{ props.item.data.name }}</td>
      <td>{{ props.item.type }}</td>
      <td>{{ props.item.data.inn }}</td>
      <td>{{ props.item.data.address }}</td>
      <td>{{ props.item.data.email }}</td>
      <td>{{ props.item.data.manager }}</td>
      <td>-</td>
      <td>-</td>
      <td class="justify-center layout px-0">
        <a :href="'businessCard/'+props.item.id" target="_blank"><v-icon small class="mr-2">edit</v-icon></a>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import Api from "@/api/backend";
import router from "@/router";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      formActions: [
        { label: "Добавить", action: "newBusiness", default: true }
      ],
      headers: [
        { text: "Название", value: "name" },
        { text: "Тип", value: "" },
        { text: "ИНН", value: "data.inn" },
        { text: "Адрес", value: "data.address" },
        { text: "Email", value: "data.email" },
        { text: "Менеджер", value: "data.manager" },
        { text: "Дата", value: "" },
        { text: "Статус", value: "" },
        { text: "Действия", value: "" }
      ],
      data: []
    };
  },
  computed: {
    ...mapGetters["loggedIn"],
    table() {
      return this.$route.name == "businessList" ? "business" : "my_business";
    }
  },
  watch: {
    table: "fetchData"
  },
  methods: {
    ...mapActions(["actions"]),
    editItem(item) {
      router.push({ name: "businessCard", params: { id: item.id } });
    },
    fetchData() {
      this.data = [];
      Api()
        .get(this.table)
        .then(res => res.data)
        .then(res => {
          this.data = res;
        });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
