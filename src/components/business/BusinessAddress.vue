<template>
  <div>
    <div>
      <span :class="captionClass">
        Адрес
      </span>
      &nbsp;
      <span
        class="ymaps-geolink"
        data-type="biz"
      >
        {{ address }}
      </span>
      <VBtn
        small
        icon
        @click="showDetails = !showDetails"
      >
        <VIcon>{{ showDetails ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</VIcon>
      </VBtn>
    </div>
    <VSlideYTransition>
      <AddressMap
        v-show="showDetails"
        :address="address"
      />
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
  },
  mounted() {
    this.$http
      .get('https://api-maps.yandex.ru/2.1/?lang=en_US&load=Geolink')
      .then(res => {
        if (res.status === 200) {
          let scr = document.createElement('script');
          scr.innerHTML = res.body;
          document.body.appendChild(scr);
        }
      });
  }
};
</script>
