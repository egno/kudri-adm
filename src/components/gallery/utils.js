import Api from '@/api/backend'

export function imagePath (src, business) {
  return (
    src &&
    src !== '' &&
    src !== null &&
    `${process.env.VUE_APP_IMAGES}${business}/${src}`
  )
}

export function deleteImage (id) {
  if (!id)
    return new Promise(function (resolve, reject) {
      reject('no ID')
    })
  return Api().delete(`gallery?id=eq.${id}`)
}
