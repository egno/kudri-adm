<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex v-for="(item, i) in data.data.service" :key="item.name + i">
        <service-card :item="item" @onSave="onSave(i)" @onDelete="onDelete(i)"></service-card>
        <v-btn fixed dark fab bottom right color="pink" @click="edit = true">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
      <v-dialog v-model="edit">
        <service-card-edit :item="newService" @onSave="onSave(-1)" @onDelete="onDelete(-1)"></service-card-edit>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import ServiceCard from "@/components/ServiceCard.vue";
import ServiceCardEdit from "@/components/ServiceCardEdit.vue";
import Api from "@/api/backend";

export default {
  data() {
    return {
      data: { data: {} },
      edit: false,
      newService: {},
      service: null
    };
  },
  components: {
    ServiceCard,
    ServiceCardEdit
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    services() {
      return this.data.data["service"];
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
      Api()
        .get(`service`)
        .then(res => res.data)
        .then(res => {
          this.service = res;
        });
    },
    onDelete(i) {
      this.edit = false;
      this.newService = {};
      if (i > -1) {
        this.data.data.service = this.data.data.service.filter(
          (x, n) => n !== i
        );
      }
      this.sendData();
    },
    onSave(i) {
      this.edit = false;
      if (i === -1) {
        this.data.data["service"].push(Object.assign({}, this.newService));
      }
      this.data.data["service"] = this.services.filter(
        x => Object.keys(x).length > 0
      );
      this.sendData();
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
