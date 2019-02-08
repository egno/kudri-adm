<template>
  <div>
    <VTextField
      v-model="val"
      mask="time"
      class="workmode"
      placeholder="00:00"
      return-masked-value
      :rules="[rules.time]"
      @blur="onEdit"
    />
  </div>
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
      val: null,
      rules: {
        time: value =>
          this.checkTime(value) ||
          'Время должно быть в промежутке от 00:00 до 23:59'
      }
    };
  },
  watch: {
    time: 'loadVal'
  },
  mounted() {
    this.loadVal();
  },
  methods: {
    checkTime(val) {
      if (!val) {
        return true;
      }
      return val.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]/) !== null;
    },
    loadVal() {
      this.val = this.time;
    },
    onEdit() {
      this.$emit('onEdit', this.val);
    }
  }
};
</script>

<style scoped>
.v-text-field {
  max-width: 4em;
}
</style>
