<template>
  <div>
    <div class="select-code" />
    <VTextField
      v-model="newPhone"
      :label="label"
      mask="phone"
      prefix="+7"
      :rules="[rules.counter]"
      @input="onEdit"
    />
  </div>
</template>

<script>
export default {
  props: {
    disabled: { type: Boolean, default: false },
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
<style lang="scss">
  .select-code {
    width: 16px;
    height: 14px;
    position: absolute;
    left: 12px;
    top: 18px;
    background: url('../../assets/ru.svg') no-repeat center center;
    &:before {
      content: '';
      background: url('../../assets/arr-down.svg') no-repeat center center;
      width: 10px;
      height: 5px;
      position: absolute;
      right: -16px;
      top: 6px;
    }
  }
</style>