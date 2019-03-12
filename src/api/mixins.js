import axios from 'axios'

export const backendMixins = {
  methods: {
    locationId (headers) {
      if (!(headers && headers.location)) return
      const res = headers.location.match(/eq\.(.*)$/)
      if (!res) return
      return res[1]
    },
    saveImage (img) {
      this.avatarEdit = false
      var blobBin = atob(img.toDataURL().split(',')[1])
      var array = []
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i))
      }
      var file = new Blob([new Uint8Array(array)], { type: 'image/png' })
      let formData = new FormData()
      let newFileName = `${this.uuidv4()}.png`
      formData.append('file', file, newFileName)
      let vm = this
      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        .then(function () {
          vm.data.j.avatar = newFileName
        })
        .then(() => vm.sendData())
        .catch(function () {
          console.log('FAILURE!!')
        })
    }
  }
}
