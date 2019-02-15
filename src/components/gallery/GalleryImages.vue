<template>
  <v-layout>
    <v-flex xs12>
      <v-card
        xs12
        flat
      >
        <v-card-title>
          <v-layout row>
            <v-flex
              xs12
              sm6
            >
              <v-select
                v-model="selectedService"
                :items="services"
                label="Услуга"
                multiple
                chips
                deletable-chips
                clearable
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-select
                v-model="selectedEmployee"
                :items="employees"
                item-value="id"
                item-text="name"
                label="Мастер"
                multiple
                chips
                deletable-chips
                clearable
              />
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-responsive>
          <v-layout
            row
            wrap
          >
            <v-flex
              v-for="(image,n) in selectedImages"
              :key="image.id"
              xs6
              sm4
              md3
              lg2
              xl1
              @click="showSlider(n)"
            >
              <image-card
                :src="image.src"
                :title="image.service"
                :subtitle="image.employee && fullName(image.employee)"
              />
            </v-flex>
          </v-layout>
        </v-responsive>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import ImageCard from '@/components/gallery/ImageCard.vue';
import { imagePath } from '@/components/gallery/utils';
import { fullName } from '@/components/business/utils';

export default {
  components: { ImageCard },
  props: {
    images: { type: Array, default: undefined }
  },
  data() {
    return {
      selectedEmployee: [],
      selectedService: []
    };
  },
  computed: {
    ...mapGetters({ employeeList: 'employee' }),
    employees() {
      return [
        ...new Set(
          this.images &&
            this.images
              .map(x => x.employees)
              .flat()
              .filter(x => !!x)
        )
      ].map(x => {
        const emp = this.getEmployee(x);
        return (
          emp && {
            id: emp.id,
            name: fullName(emp) || emp.id,
            category: emp.j && emp.j.category
          }
        );
      });
    },
    selectedImages() {
      return (
        this.images &&
        this.images
          .filter(
            x =>
              (this.selectedService.length === 0 ||
                this.selectedService.some(s =>
                  x.services.some(ss => ss === s)
                )) &&
              (this.selectedEmployee.length === 0 ||
                this.selectedEmployee.some(s =>
                  x.employees.some(ss => ss === s)
                ))
          )
          .map(x => ({
            id: x.id,
            src: imagePath(x.id, x.business_id),
            employee: this.getEmployee(
              x.employees && x.employees.filter(e => !!e)[0]
            ),
            service: x.services && x.services.filter(e => !!e)[0]
          }))
      );
    },
    services() {
      return [
        ...new Set(
          this.images &&
            this.images
              .map(x => x.services)
              .flat()
              .filter(x => !!x)
        )
      ];
    }
  },
  methods: {
    fullName(emp) {
      return fullName(emp);
    },
    getEmployee(id) {
      return this.employeeList && this.employeeList.filter(e => e.id === id)[0];
    },
    showSlider(n) {
      this.$emit('showSlider', {
        selected: n,
        images: this.selectedImages
      });
    }
  }
};
</script>
