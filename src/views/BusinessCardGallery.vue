<template>
  <v-container
    fluid
    grid-list-sm
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
      >
        <album
          title="Компания"
          :images="imagesBusiness"
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
        />
      </v-flex>
      <v-flex
        xs12
        sm6
      >
        <album
          title="Услуги"
          :images="imagesServices"
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
  </v-container>
</template>

<script>
import Album from '@/components/gallery/Album.vue';
import GalleryCard from '@/components/gallery/GalleryCard.vue';
import { mapGetters } from 'vuex';
import Api from '@/api/backend';

export default {
  components: { Album, GalleryCard },
  data() {
    return {
      data: []
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
    imagesServices() {
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
    }
  }
};
</script>
