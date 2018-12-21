<template>
  <div>
    <YandexMap
      :coords="placemark.coords"
      zoom="10"
      style="width: 300px; height: 300px;"
      :cluster-options="{
        1: {clusterDisableClickZoom: true}
      }"
      :behaviors="['ruler']"
      :controls="['zoomControl']"
      map-type="map"
    >
      <YmapMarker
        marker-id="1"
        marker-type="placemark"
        :coords="placemark.coords"
        hint-content="Hint content 1"
        :balloon="{header: 'header', body: 'body', footer: 'footer'}"
        :icon="{color: 'green'}"
        cluster-name="1"
      />
    </YandexMap>
  </div>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

export default {
  components: { YandexMap: yandexMap, YmapMarker: ymapMarker },
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
  }
};
</script>
