<template>
  <div>
    <YMap
      :coords="placemark.coords"
      zoom="10"
      style="width: 300px; height: 300px;"
      :cluster-options="{
        1: {clusterDisableClickZoom: true}
      }"
      :behaviors="['ruler']"
      :controls="['geolocationControl','searchControl','zoomControl']"
      map-type="map"
    >
      <YMapMarker
        marker-id="1"
        marker-type="placemark"
        :coords="placemark.coords"
        hint-content="Hint content 1"
        :balloon="{header: 'header', body: 'body', footer: 'footer'}"
        :icon="{color: 'pink'}"
        cluster-name="1"
      />
    </YMap>
  </div>
</template>

<script>
import YMap from '@/components/yandex/YMap';
import YMapMarker from '@/components/yandex/Marker';
import { geocode } from '@/api/yandex_map';

export default {
  components: { YMap: YMap, YMapMarker: YMapMarker },
  props: {
    address: { type: String, default: null },
    lat: { type: Number, default: null },
    lon: { type: Number, default: null }
  },
  data() {
    return {
      placemark: {
        coords: [54.8, 39.8],
        properties: {}, // define properties here
        options: {}, // define options here
        clusterName: '1',
        balloonTemplate: '<div>"Your custom template"</div>',
        callbacks: { click: function() {} }
      }
    };
  },
  watch: {
    address: 'findAddress'
  },
  methods: {
    findAddress() {
      if (!this.address) {
        return;
      }
      geocode(this.address).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
