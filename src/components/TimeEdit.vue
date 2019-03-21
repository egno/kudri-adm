<template>
  <VTextField
    v-model="val"
    mask="time"
    class="time-edit"
    :placeholder="placeholder"
    return-masked-value
    :rules="[rules.time]"
    @blur="onEdit"
  />
</template>

<script>
export default {
  props: {
    caption: { type: String, default: '' },
    time: {
      type: String,
      default: ''
    },
    placeholder: { type: String, default: '00:00' }
  },
  data () {
    return {
      val: null,
      rules: {
        time: value =>
          this.checkTime(value) ||
          'Время должно быть в промежутке от 00:00 до 23:59'
      }
    }
  },
  watch: {
    time: 'loadVal',
  },
  mounted () {
    this.loadVal()
  },
  methods: {
    checkTime (val) {
      if (!val) {
        return true
      }
      return val.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]/) !== null
    },
    loadVal () {
      this.val = this.time
    },
    onEdit () {
      this.$emit('onEdit', this.val)
    }
  }
}
</script>

<style lang="scss">
.time-edit {
  margin-top: 0;
  padding: 0;
  & .v-input__slot:before {
    display: none;
  }
  & .v-text-field__details {
    display: none;
  }
  & .v-text-field input {
    padding: 0;
  }
}

</style>
