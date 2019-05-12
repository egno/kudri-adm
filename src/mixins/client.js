import { debounce } from 'lodash'
import Api from '@/api/backend'

/* !!! This mixin requires the fullName ref to select/combobox !!! */
export default {
  data () {
    return {
      clientDisplay (c) {
        return `${ c.j.name.fullname }${ c.j.phone? c.j.phone : c.j.phones[0] }`
      },
      suggestedClients: [],
    }
  },
  created () {
    this.debouncedGetClients = debounce(this.getClientsByName, 350)
  },
  methods: {
    getClientsByName (companyId, val) {
      Api()
        .get(`client?company_id.eq.${companyId}&j->name->>fullname=ilike.*${val}*`)
        .then(({ data }) => {
          this.suggestedClients = data.filter(c => c.business_id !== this.filial)
        })
    },
    onInputName (companyId, val) {
      if (!val) {
        this.suggestedClients = []
        return
      }

      const match = val.match(/[а-яА-ЯёЁ ]+/g)

      val = match? match[0] : ''
      this.$refs.fullName.lazySearch = val
      if (!val || val.length < 3) {
        this.suggestedClients = []
        return
      }
      this.debouncedGetClients(companyId, val)
    },
  }
}
