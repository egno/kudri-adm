<template>
  <v-container
    fluid
    grid-list-md
  >
    <v-layout
      v-if="$route.name === 'businessCardGallery'"
      justify-space-around
      column
    >
      <v-flex
        xs12
        sm6
      >
        <album
          title="Компания"
          :images="imagesBusiness"
          @showSlider="showSlider($event)"
        />
      </v-flex>
      <v-flex
        xs12
        sm6
      >
        <album
          title="Сотрудники"
          :to="{name:'businessCardEmployeeGallery', params:{id: id}}"
          :images="imagesEmployees"
          @showSlider="showSlider($event)"
        />
      </v-flex>
      <v-flex
        xs12
        sm6
      >
        <album
          title="Работы"
          :to="{name:'businessCardServiceGallery', params:{id: id}}"
          :images="imagesEmployees"
          @showSlider="showSlider($event)"
        />
      </v-flex>
    </v-layout>

    <v-layout
      v-if="$route.name === 'businessCardEmployeeGallery'"
      justify-space-around
      row
      wrap
    >
      <v-flex
        v-for="emp in employee"
        :key="emp.id"
      >
        <gallery-card
          :to="{name: 'employeeGallery', params: {employee: emp.id}}"
          :title="emp.j && emp.j.name"
          :subtitle="emp.j && emp.j.category"
          :employee="emp.id"
          :images="employeeImages(emp.id)"
        />
      </v-flex>
    </v-layout>

    <v-layout
      v-if="$route.name === 'businessCardServiceGallery'"
      justify-space-around
      row
      wrap
    >
      <gallery-images
        :images="serviceImages"
        @showSlider="showSlider($event)"
        @deleteImage="deleteImage($event)"
      />
    </v-layout>
    <album-slider
      :display="!!sliderImages"
      :title="sliderTitle"
      :images="sliderImages"
      :select="selectedImage"
      @close="onSliderClose()"
    />
  </v-container>
</template>

<script>
import Album from '@/components/gallery/Album.vue';
import AlbumSlider from '@/components/gallery/AlbumSlider.vue';
import GalleryCard from '@/components/gallery/GalleryCard.vue';
import GalleryImages from '@/components/gallery/GalleryImages.vue';
import { mapGetters } from 'vuex';
import Api from '@/api/backend';
import { deleteImage } from '@/components/gallery/utils';

export default {
  components: { Album, AlbumSlider, GalleryCard, GalleryImages },
  data() {
    return {
      data: [],
      sliderImages: undefined,
      sliderTitle: '',
      selectedImage: 0
    };
  },
  computed: {
    ...mapGetters(['business', 'employee']),
    id() {
      return this.$route.params.id;
    },
    imagesBusiness() {
      return this.data && this.data.filter(x => x.j && x.j.business);
    },
    imagesEmployees() {
      return (
        this.data &&
        this.data.filter(x => x.employees && x.employees.some(e => !!e))
      );
    },
    serviceImages() {
      return (
        this.data &&
        this.data.filter(x => x.services && x.services.some(e => !!e))
      );
    }
  },
  watch: {
    business: 'load'
  },
  mounted() {
    this.load();
  },
  methods: {
    deleteImage(image) {
      console.log(image);
      if (!image) return;
      const idx = this.data.findIndex(x => x.id === image);
      if (!idx === -1) return;
      deleteImage(image)
        .then(() => {
          this.data.splice(idx, 1);
        })
        .catch(err => {
          console.log(err);
        });
    },
    load() {
      if (!this.business) return;
      Api()
        .get(`gallery?business_id=eq.${this.business}`)
        .then(res => res.data)
        .then(res => {
          this.data = res;
        });
    },
    employeeImages(id) {
      return (
        id &&
        this.business &&
        this.data &&
        this.data.filter(x => x.employees && x.employees.some(e => e === id))
      );
    },
    onSliderClose() {
      this.sliderImages = undefined;
      this.selectedImage = undefined;
      this.sliderTitle = undefined;
    },
    showSlider(payload) {
      this.sliderImages = payload.images;
      this.selectedImage = payload.selected;
      this.sliderTitle = payload.title;
    }
  }
};
</script>
