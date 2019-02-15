export function imagePath(src, business) {
  return (
    src &&
    src !== '' &&
    src !== null &&
    `${process.env.VUE_APP_IMAGES}${business}/${src}`
  );
}
