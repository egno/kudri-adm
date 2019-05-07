export function logo (provider) {
    return (
        provider &&
        provider.j &&
        provider.j.logo &&
        provider.j.logo !== '' &&
        provider.j.logo !== null &&
        `${process.env.VUE_APP_IMAGES}providers/${provider.j.logo}`
    )
}