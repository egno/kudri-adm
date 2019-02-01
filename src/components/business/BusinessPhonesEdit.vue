<template>
  <div>
    <span :class="captionClass">
      Телефоны
    </span>
    <div
      v-for="(phone, i) in newPhones"
      :key="i"
      class="phone-input"
    >
      <PhoneEdit
        :phone="phone"
        @onEdit="onEdit(i, $event)"
      />
      <VBtn
        v-if="newPhones.length > 1"
        depressed
        flat
        fab
        small
        @click="newPhones.splice(i, 1)"
      >
        <v-icon>delete</v-icon>
      </VBtn>
    </div>
    <VBtn
      :disabled="hasEmptyPhone"
      @click="newPhones.push('')"
    >
      Добавить телефон
    </VBtn>
  </div>
</template>

<script>
import PhoneEdit from '@/components/business/PhoneEdit.vue';
export default {
  components: {
    PhoneEdit
  },
  props: {
    captionClass: {
      type: String,
      default:
        'caption font-weight-bold text-no-wrap grey--text text--lighten-1'
    },
    phones: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      newPhones: []
    };
  },
  computed: {
    hasEmptyPhone() {
      return this.newPhones.some(x => !x);
    }
  },
  watch: { phones: 'update' },
  mounted() {
    this.update();
    this.newPhones.length === 0 ? this.newPhones.push('') : false;
  },
  methods: {
    onEdit(i, payload) {
      this.$set(this.newPhones, i, payload);
      this.$emit('onEdit', this.newPhones);
    },
    update() {
      this.newPhones = this.phones;
    }
  }
};
</script>
<style>
.phone-input {
  display: flex;
  width: 300px;
  justify-content: center;
  align-items: center;
}
</style>