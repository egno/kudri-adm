export const businessMixins = {
  computed: {
    phones() {
      if (!(this.data && this.data.j)) {
        return [];
      }
      if (!this.data.j.phones) {
        return [];
      }
      if (Array.isArray(this.data.j.phones)) {
        return this.data.j.phones;
      }
      return [this.data.j.phones];
    }
  },
  methods: {
    appendHttpToUrl(url) {
      if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
        return url;
      } else {
        return 'http://' + url;
      }
    },
    dataPrefill(data) {
      if (!data) {
        data = {};
      }
      if (!data.j) {
        data.j = {};
      }
      if (!data.j.phones) {
        data.j.phones = [];
      }
      if (!data.j.links) {
        data.j.links = {};
      }
      if (!data.j.services) {
        data.j.services = [];
      }
      if (!data.j.schedule) {
        data.j.schedule = {};
      }
      if (!data.j.schedule.data) {
        data.j.schedule.data = [
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
          ['', '']
        ];
      }
      return data;
    },
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
