<template>
  <v-container
    fluid
    grid-list-sm
  >
    <v-card
      v-if="data"
      flat
      class="grey lighten-5"
    >
      <v-card-title>
        <v-layout row>
          <v-flex>
            <UserAvatar
              class="ma-1"
              :name="data.j.name || data.j.email"
              :src="data.j.avatar"
            />
          </v-flex>
          <v-flex>
            <v-layout column>
              <v-flex class="caption grey--text text--darken-2">
                {{ data.j.category }}
              </v-flex>
              <v-flex>{{ data.j.name }}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-responsive>
        <v-layout
          row
          fill-height
          wrap
        >
          <gallery-card
            v-for="(service, n) in services"
            :key="service+n"
            :title="service"
            :employee="id"
            :service="service"
            :images="serviceImages(service)"
          />
          <gallery-card
            key="others"
            title="Прочее"
            :employee="id"
            :images="serviceImages()"
          />
        </v-layout>
      </v-responsive>
    </v-card>
  </v-container>
</template>

<script>
import GalleryCard from '@/components/gallery/GalleryCard.vue';
import UserAvatar from '@/components/avatar/UserAvatar.vue';
import Api from '@/api/backend';
import { mapActions } from 'vuex';

export default {
  components: { GalleryCard, UserAvatar },
  data() {
    return {
      data: undefined,
      images: []
    };
  },
  computed: {
    id() {
      return this.$route && this.$route.params && this.$route.params.employee;
    },
    business() {
      return this.data && this.data.parent;
    },
    services() {
      return this.data && this.data.j && this.data.j.services;
    }
  },
  watch: {
    id: 'load',
    business: 'loadBusiness'
  },
  methods: {
    ...mapActions(['setBusiness']),
    load() {
      if (!this.id) return;
      Api()
        .get(`employee?id=eq.${this.id}`)
        .then(res => res.data[0])
        .then(res => {
          this.data = res;
          this.loadBusiness(res.parent);
        });
    },
    loadBusiness() {
      if (!this.business) return;
      this.setBusiness(this.business);
      Api()
        .get(`gallery?employees=cs.{${this.id}}`)
        .then(res => res.data)
        .then(res => {
          this.images = res;
        });
    },
    serviceImages(service) {
      if (service) {
        return (
          this.images &&
          this.images.filter(x => x.services.some(s => s === service))
        );
      } else {
        return (
          this.images &&
          this.images.filter(
            x => !x.services.some(s => this.services.some(ss => ss === s))
          )
        );
      }
    }
  },
  mounted() {
    this.load();
  }
};
</script>
