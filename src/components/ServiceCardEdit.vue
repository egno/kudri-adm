<template>
  <v-card>
    <v-card-title class="headline">Услуга</v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-combobox
              autofocus
              :items="services"
              label="Наименование"
              required
              v-model="item.name"
              @input="onNameUpdate"
            ></v-combobox>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select v-model="item.category" :items="categories" label="Категория" required></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="Цена от" v-model="item.price"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="Продолжительность, минут" v-model="item.duration"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-textarea solo label="Примечание" v-model="item.note"></v-textarea>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="onDelete">Удалить</v-btn>
      <v-btn color="primary" @click="onSave">Закрыть</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      data: {}
    };
  },
  props: {
    item: {}
  },
  computed: {
    ...mapGetters(["serviceCategories", "serviceList"]),
    categories() {
      return this.serviceCategories.map(x => x.code);
    },
    services() {
      return this.serviceList.map(x => x.name);
    }
  },
  methods: {
    ...mapActions(["loadServiceList"]),
    onDelete() {
      this.$emit("onDelete", undefined);
    },
    onNameUpdate(event) {
      console.log("upd", event);
      const calcItem = this.serviceList.filter(x => x.name == event)[0];
      if (calcItem) {
        this.item.category = calcItem.category;
      }
    },
    onSave() {
      this.$emit("onSave", this.item);
    }
  },
  mounted() {
    this.data = this.item;
    this.loadServiceList;
    // Object.assign({}, this.item);
  }
};
</script>
