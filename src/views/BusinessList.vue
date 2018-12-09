<template>
  <v-data-table
    :headers="headers"
    :items="data"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.name }}</td>
      <td>-</td>
      <td>{{ props.item.inn }}</td>
      <td>{{ props.item.address }}</td>
      <td>{{ props.item.email }}</td>
      <td>-</td>
      <td>-</td>
    </template>
  </v-data-table>
</template>

<script>
import Api from "@/api/backend";

export default {
  data() {
    return {
      headers: [
        { text: "Название", value: "name" },
        { text: "Тип", value: "" },
        { text: "ИНН", value: "inn" },
        { text: "Адрес", value: "address" },
        { text: "Email", value: "email" },
        { text: "Дата", value: "" },
        { text: "Статус", value: "" }
      ],
      data: []
    };
  },
  methods: {
    fetchData() {
      Api()
        .get("business")
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
