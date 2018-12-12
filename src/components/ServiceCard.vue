<template>
  <v-card>
    <v-toolbar>
      <v-btn small fab bottom right absolute color="light-grey" @click="edit = true">
        <v-icon>edit</v-icon>
      </v-btn>
      <v-toolbar-title primary-title>
        <div>
          <h4>{{item.name}}</h4>
          <div class="caption grey--text text--darken-1">{{item.category}}</div>
        </div>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <div>
        <span class="font-weight-bold">Цена:</span>
        от {{item.price}}
      </div>
      <div>
        <span class="font-weight-bold">Продолжительность:</span>
        {{item.duration}} мин.
      </div>
      <span></span>
      {{item.note}}
    </v-card-text>
    <v-dialog v-model="edit">
      <service-card-edit :item="item" @onSave="onSave" @onDelete="onDelete"></service-card-edit>
    </v-dialog>
  </v-card>
</template>

<script>
import ServiceCardEdit from "@/components/ServiceCardEdit.vue";

export default {
  data() {
    return {
      edit: false
    };
  },
  props: {
    item: {}
  },
  components: { ServiceCardEdit },
  methods: {
    onDelete() {
      this.edit = false;
      this.$emit("onDelete", this.item);
    },
    onSave() {
      this.edit = false;
      //   this.item = Object.assign(this.item, data);
      this.$emit("onSave", this.item);
    }
  }
};
</script>
