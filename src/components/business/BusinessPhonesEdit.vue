<template>
  <div>
    <span :class="captionClass">
      Телефоны
    </span>&nbsp;
    <PhoneEdit
      v-for="(phone, i) in newPhones"
      :key="i"
      :phone="phone"
      @onEdit="onEdit(i, $event)"
    />
    <VBtn @click="newPhones.push('')">
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
  watch: { phones: 'update' },
  mounted() {
    this.update();
  },
  methods: {
    onEdit(i, payload) {
      this.newPhones[i] = payload;
      this.$emit('onEdit', this.newPhones);
    },
    update() {
      this.newPhones = this.phones;
    }
  }
};
</script>
