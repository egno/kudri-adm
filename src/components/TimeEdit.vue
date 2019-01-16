<template>
  <VFlex>
    <VTextField
      v-model="time"
      mask="time"
      placeholder="00:00"
      return-masked-value
      :rules="[rules.time]"
      @change="onEdit"
    />
  </VFlex>
</template>

<script>
export default {
  props: {
    caption: { type: String, default: '' },
    time: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rules: {
        time: value =>
          this.checkTime(value) ||
          'Время должно быть в промежутке от 00:00 до 23:59'
      }
    };
  },
  methods: {
    checkTime(val) {
      if (!val) {
        return true;
      }
      return val.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]/) !== null;
    },
    onEdit(payload) {
      this.$emit('onEdit', payload);
    }
  }
};
</script>

<style scoped>
.v-text-field {
  max-width: 4em;
}
</style>
