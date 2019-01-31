<template>
  <div>
    <VTextField
      v-model="newPhone"
      :label="label"
      mask="phone"
      prefix="+7"
      prepend-icon="phone"
      :rules="[rules.counter]"
      @input="onEdit"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Телефон' },
    phone: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      newPhone: '',
      rules: {
        counter: value => value.length === 10 || 'В номере должно быть 10 цифр'
      }
    };
  },
  watch: { phone: 'update' },
  mounted() {
    this.update();
  },
  methods: {
    onEdit() {
      this.$emit('onEdit', this.newPhone);
    },
    update() {
      this.newPhone = this.phone;
    }
  }
};
</script>