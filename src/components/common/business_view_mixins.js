export const businessMixins = {
    computed: {
        id () {
            return this.$route.params.id
        }
    }
}