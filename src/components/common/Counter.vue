<template>
  <div class="counter">
    <div class="counter__control _down" @click="onDecrement" />

    <input :id="id" type="text" :value="quantity" @input.prevent="setNewValue" @blur="onBlur">

    <div class="counter__control _up" @click="onIncrement" />
  </div>
</template>

<script>
  export default {
    name: 'Counter',
    props: ['value', 'maxValue', 'id'],
    data () {
      return {
        quantity: this.value || 1
      }
    },
    computed: {
      maxQuantity () {
        return this.maxValue || 999
      }
    },
    methods: {
      onBlur () {
        if (!this.quantity) {
          this.quantity = 1
          this.$emit('changeCount', this.quantity)
        }
      },
      onIncrement () {
        if (this.maxQuantity && this.quantity <= this.maxQuantity - 1) {
          this.quantity++
          this.$emit('changeCount', this.quantity)
        } 
      },
      onDecrement () {
        this.quantity > 1? --this.quantity : this.quantity = 1
        this.$emit('changeCount', this.quantity)
      },
      setNewValue (event) {
        let value = event.target.value.replace(/\D/g, '')
        value = parseInt(value)

        if (!event.target.value) {
          this.quantity = 0
          event.target.value = ''
        } else if (value <= this.maxQuantity) {
          this.quantity = value
          event.target.value = value
        } else {
          this.quantity = this.maxQuantity
          event.target.value = this.maxQuantity
        }
        this.$emit('changeCount', this.quantity)
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

      &._down {
        left: 0.0625rem;
        background: url('../../assets/images/minus.png') center no-repeat ;
      }

      &._up {
        right: 0.0625rem;
        background: url('../../assets/images/plus.png') center no-repeat ;
      }
    }
  }
</style>
