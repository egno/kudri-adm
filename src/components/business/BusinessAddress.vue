<template>
  <div>
    <div>
      <span :class="captionClass">
        Адрес
      </span>
      &nbsp;
      <span>{{ address }}</span>
      <VBtn
        small
        icon
        @click="showDetails = !showDetails"
      >
        <VIcon>{{ showDetails ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</VIcon>
      </VBtn>
    </div>
    <VSlideYTransition>
      <AddressMap v-show="showDetails">
        I'm a thing. But, like most politicians, he promised more than he could deliver.
        You won't have time for sleeping, soldier, not with all the bed making you'll be doing.
        Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
      </AddressMap>
    </VSlideYTransition>
  </div>
</template>

<script>
import AddressMap from '@/components/business/AddressMap.vue';

export default {
  components: { AddressMap },
  props: {
    address: { type: String, default: null },
    captionClass: {
      type: String,
      default:
        'caption font-weight-bold text-no-wrap grey--text text--lighten-1'
    }
  },
  data() {
    return {
      showDetails: false
    };
  }
};
</script>
