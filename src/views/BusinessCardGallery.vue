<template>
  <v-container
    fluid
    grid-list-md
  >
    <v-layout
      v-if="$route.name === 'businessCardGallery'"
      justify-space-around
      row
      wrap
    >
      <v-flex
        xs12
        sm6
        md4
        lg3
        xl2
      >
        <album
          title="Компания"
          :images="imagesBusiness"
          aspect-ratio="1"
          @showSlider="showSlider($event)"
        />
      </v-flex>
      <v-flex
        xs12
        sm6
        md4
        lg3
        xl2
      >
        <album
          title="Сотрудники"
          :to="{name:'businessCardEmployeeGallery', params:{id: id}}"
          :images="empImages"
          aspect-ratio="1"
          @showSlider="showSlider($event)"
        />
      </v-flex>
      <v-flex
        xs12
        sm6
        md4
        lg3
        xl2
      >
        <album
          title="Работы"
          :to="{name:'businessCardServiceGallery', params:{id: id}}"
          :images="imagesEmployees"
          aspect-ratio="1"
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
        v-for="emp in empList"
        :key="emp.id"
        xs12
        sm6
        md4
        lg3
        xl2
      >
        <album
          :employee="emp.id"
          :title="emp.title"
          :subtitle="emp.subtitle"
          :to="{name:'businessCardServiceGallery', params:{id: id}, query:{employee: emp.id}}"
          :images="emp.images"
          aspect-ratio="1"
          :placeholder="defaultEmployeeImage"
          @showSlider="showSlider($event)"
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
        :employee-filter="employee_id"
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
import GalleryImages from '@/components/gallery/GalleryImages.vue';
import { mapGetters } from 'vuex';
import Api from '@/api/backend';
import { deleteImage } from '@/components/gallery/utils';
import { fullName } from '@/components/business/utils';

export default {
  components: { Album, AlbumSlider, GalleryImages },
  data() {
    return {
      data: [],
      defaultEmployeeImage: require('@/assets/user.svg'),
      sliderImages: undefined,
      sliderTitle: '',
      selectedImage: 0
    };
  },
  computed: {
    ...mapGetters(['business', 'employee']),
    empList() {
      return (
        this.employee &&
        this.employee
          .filter(x => x.j && x.j.image)
          .map(x => ({
            id: x.id,
            title: fullName(x),
            subtitle: x.j.category,
            images: x.j.image ? [{ id: x.j.image }] : undefined
          }))
          .sort((a, b) => (a.subtitle < b.subtitle ? -1 : 1))
      );
    },
    empImages() {
      return [
        ...new Set(this.empList && this.empList.map(x => x.images).flat())
      ];
    },
    employee_id() {
      return this.$route && this.$route.query && this.$route.query.employee;
    },
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
