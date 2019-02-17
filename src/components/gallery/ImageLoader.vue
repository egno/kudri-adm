<template>
  <div>
    <form
      enctype="multipart/form-data"
      novalidate
    >
      <div class="dropbox">
        <input
          type="file"
          :multiple="multiple"
          :name="uploadFieldName"
          :disabled="!!status"
          accept="image/*"
          class="input-file"
          @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
        >
        <p v-if="!status">
          {{ placeText }}
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { uuidv4 } from '@/components/utils';

export default {
  props: {
    aspectRatio: { type: Number, default: 1 },
    multiple: { type: Boolean, default: false },
    placeText: { type: String, default: 'Перетащите фалы сюда' },
    src: { type: String, default: undefined },
    placeHolder: { type: String, default: undefined }
  },
  data() {
    return {
      fileCount: undefined,
      status: undefined,
      uploadFieldName: 'file'
    };
  },
  computed: {
    ...mapGetters(['business'])
  },
  methods: {
    filesChange(fieldName, fileList) {
      const formData = new FormData();
      let fileNames = [];
      if (!fileList.length) return;
      Array.from(Array(fileList.length).keys()).map(x => {
        const newFile = { file: fileList[x].name, path: uuidv4() };
        fileNames.push(newFile);
        formData.append(fieldName, fileList[x], newFile.path);
      });
      this.saveImage(formData, fileNames);
    },
    saveImage(formData, fileNames) {
      this.status = 'process';
      let vm = this;
      if (!this.business) return;
      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            businessid: this.business
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.$emit('onFilesUpload', fileNames);
          }
        })
        .then(() => {
          vm.status = '';
        })
        .catch(function() {
          console.log('FAILURE!!');
          vm.status = '';
        });
    }
  }
};
</script>
