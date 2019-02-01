<template>
  <v-card>
    <v-container
      grid-list-sm
      fluid
      align-content-space-between
      fill-height
      pa-2
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="(image, n) in currentImages"
          :key="n"
          xs4
        >
          <v-card
            flat
            tile
            class="d-flex"
          >
            <v-img :src="image">
              <v-layout
                slot="placeholder"
                fill-height
                align-center
                justify-center
                ma-0
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                />
              </v-layout>
            </v-img>
          </v-card>
        </v-flex>
        <v-flex
          v-if="more"
          xs4
        >
          <v-btn
            block
            depressed
            large
            @click="full=true"
          >
            Ещё {{ images.length - currentImages.length }}
          </v-btn>
        </v-flex>
        <v-flex
          v-if="addPlace"
          xs4
        >
          <form
            enctype="multipart/form-data"
            novalidate
          >
            <div class="dropbox">
              <input
                type="file"
                multiple
                :name="uploadFieldName"
                :disabled="!isInitial"
                accept="image/*"
                class="input-file"
                @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
              >
              <p v-if="isInitial">
                Drag your file(s) here to begin
                <br>or click to browse
              </p>
              <p v-if="!isInitial">
                Uploading {{ fileCount }} files...
              </p>
            </div>
          </form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    edit: { type: Boolean, default: false },
    images: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      full: false,
      index: 0,
      isInitial: true,
      maxImages: 9,
      uploadFieldName: 'file'
    };
  },
  computed: {
    currentImages() {
      if (!this.full) {
        return this.images.slice(
          0,
          this.maxImages -
            (this.edit || this.images.length !== this.maxImages ? 1 : 0)
        );
      }
      return this.images;
    },
    more() {
      return this.images.length > this.currentImages.length;
    },
    addPlace() {
      return this.edit && !this.more;
    }
  },
  methods: {
    filesChange(fieldName, fileList) {
      const formData = new FormData();
      if (!fileList.length) return;
      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });
      this.saveImage(formData);
    },
    saveImage(formData) {
      this.isInitial = false;
      let vm = this;
      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            // TODO подтянуть реальный id бизнеса
            business_id: '1a7ce435-0a77-11e9-9a7e-f7a172b556a7'
          }
        })
        .then(() => {
          vm.isInitial = true;
        })
        .catch(function() {
          console.log('FAILURE!!');
          vm.isInitial = true;
        });
    }
  }
};
</script>
