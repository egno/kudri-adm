<template>
  <v-card
    hover
    ripple
    @click="edit=true"
  >
    <v-card-title>
      <v-layout column>
        <v-flex py-0>
          <div class="caption grey--text text--darken-1">
            {{ item.group }}
          </div>
        </v-flex>
        <v-flex py-0>
          <h4>{{ item.name }}</h4>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-layout column>
        <v-flex py-0>
          <div>
            <span class="caption grey--text text--darken-1">
              Цена: от
            </span>
            <span class="text-value">
              {{ item.price }}
            </span>
            <span>₽</span>
          </div>
        </v-flex>
        <v-flex py-0>
          <div>
            <span class="caption grey--text text--darken-1">
              Продолжительность:
            </span>
            <span class="text-value">
              {{ item.duration }}
            </span>
            <span>мин.</span>
          </div>
        </v-flex>
        <v-flex v-if="item.notes">
          <div>{{ item.notes }}</div>
        </v-flex>
        <v-flex v-if="item.employees">
          <span class="caption grey--text text--darken-1">
            Сотрудников:
          </span>
          <span class="text-value">
            {{ item.employees }}
          </span>
        </v-flex>
        <v-flex px-0>
          <GalleryTiles
            :service="item.name"
            :employee="employee"
            :rows="1"
            fixed
          />
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-navigation-drawer
      v-model="edit"
      right
      temporary
      fixed
    >
      <ServiceCardEdit
        :item="item"
        :employee="employee"
        :employee-name="employeeName"
        @onDelete="onDelete"
        @onSave="onSave($event)"
        @close="edit=false"
      />
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import ServiceCardEdit from '@/components/service/ServiceCardEdit.vue';
import GalleryTiles from '@/components/gallery/GalleryTiles.vue';

export default {
  components: { GalleryTiles, ServiceCardEdit },
  props: {
    access: { type: Boolean, default: false },
    editMode: { type: Boolean, default: false },
    employee: { type: String, default: undefined },
    employeeName: { type: String, default: undefined },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      edit: false
    };
  },
  watch: {
    editMode: 'onInit'
  },
  mount() {
    this.onInit();
  },
  methods: {
    onInit() {
      console.log(this.editMode);
      this.edit = this.editMode;
    },
    onDelete() {
      this.edit = false;
      this.$emit('onDelete');
    },
    onSave(payload) {
      this.edit = false;
      this.$emit('onSave', payload);
    }
  }
};
</script>

<style scoped>
.text-value {
  padding-left: 0.5em;
  padding-right: 0.2em;
}
</style>

