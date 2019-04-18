<template>
  <div class="counter">
    <div class="counter__control _down" @click="onDecrement" />

    <input :id="id" type="text" :value="value" @input.prevent="setNewValue">

    <div class="counter__control _up" @click="onIncrement" />
  </div>
</template>

<script>
  export default {
    name: 'Counter',
    props: {
      id: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        default: 0
      },
      maxValue: {
        type: Number,
        default: 999
      },
      minValue: {
        type: Number,
        default: 0
      },
      interval: {
        type: Number,
        default: 1
      }
    },
    methods: {
      onIncrement () {
        if (this.value <= this.maxValue - this.interval) {
          this.$emit('changeCount', this.value + this.interval)
        } 
      },
      onDecrement () {
        if (this.value >= this.minValue + this.interval) {
          this.$emit('changeCount', this.value - this.interval)
        }
      },
      setNewValue (event) {
        let value = event.target.value.replace(/\D/g, '')
        let newVal

        value = parseInt(value)

        if (!event.target.value) {
          newVal = 0
          event.target.value = ''
        } else if (value <= this.maxValue) {
          newVal = value
          event.target.value = value
        } else {
          newVal = this.maxValue
          event.target.value = this.maxValue
        }
        this.$emit('changeCount', newVal)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/styles/common';
  
  .counter {
    @extend %vertical-align;

    input {
      width: 74px;
      text-align: center;
      outline: none;
    }

    &__control {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      outline: none;
      background-color: #8995AF;
      background-position: center;
      background-repeat: no-repeat;

      &._down {
        left: 0.0625rem;
        background-image: url('../../assets/images/svg/minus-white.svg');
      }

      &._up {
        right: 0.0625rem;
        background-image: url('../../assets/images/svg/plus-white.svg');
        background-size: 12px;
      }
    }
  }
</style>
