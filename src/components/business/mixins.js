export const businessMixins = {
  computed: {
    phones() {
      if (!(this.data && this.data.data)) {
        return [];
      }
      if (!this.data.data.phone) {
        return [];
      }
      if (Array.isArray(this.data.data.phone)) {
        return this.data.data.phone;
      }
      return [this.data.data.phone];
    }
  },
  methods: {
    uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }
};
