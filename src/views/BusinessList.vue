<template>
  <v-data-table :headers="headers" :items="data" class="elevation-1">
    <template
      slot="items"
      slot-scope="props"
      :to="{ name: 'businessCard', params: { id: props.item.id }}"
    >
      <td>{{ props.item.name }}</td>
      <td>{{ props.item.type }}</td>
      <td>{{ props.item.inn }}</td>
      <td>{{ props.item.address }}</td>
      <td>{{ props.item.email }}</td>
      <td>-</td>
      <td>-</td>
      <td class="justify-center layout px-0">
        <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import Api from "@/api/backend";
import router from "@/router";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      formActions: [
        { label: "Добавить", action: "newBusiness", default: true }
      ],
      headers: [
        { text: "Название", value: "name" },
        { text: "Тип", value: "" },
        { text: "ИНН", value: "inn" },
        { text: "Адрес", value: "address" },
        { text: "Email", value: "email" },
        { text: "Дата", value: "" },
        { text: "Статус", value: "" },
        { text: "Действия", value: "" }
      ],
      data: []
    };
  },
  methods: {
    ...mapActions(["actions"]),
    editItem(item) {
      router.push({ name: "businessCard", params: { id: item.id } });
    },
    fetchData() {
      Api()
        .get("business")
        .then(res => res.data)
        .then(res => {
          this.data = res;
        })
        .then(this.setActions(this.formActions));
    },
    setActions(newActions = []) {
      this.actions(newActions || []);
    }
  },
  mounted() {
    this.setActions();
    this.fetchData();
  }
};
</script>
