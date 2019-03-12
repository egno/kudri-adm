<template>
  <v-container
    fluid
    grid-list-lg
    pa-0
    pt-3
  >
    <v-layout column>
      <v-flex>
        <v-layout
          row
          wrap
        >
          <v-flex
            py-0
            xs12
            sm7
            offset-md2
            md7
            offset-lg3
            lg6
            offset-xl4
            xl4
          >
            <v-text-field
              v-model="searchString"
              label="Поиск"
              prepend-inner-icon="search"
              clearable
            />
          </v-flex>
          <v-spacer />
          <div py-1>
            <v-btn
              :disabled="!!newService"
              depressed
              @click="onNew"
            >
              <v-icon>add</v-icon>Добавить услугу
            </v-btn>
          </div>
        </v-layout>
      </v-flex>

      <v-flex>
        <v-layout column>
          <v-flex>
            <v-layout row>
              <v-flex
                v-if="newService"
                xs12
                md6
                lg4
                xl3
              >
                <ServiceCard
                  :item="newService"
                  edit-mode
                  @onDelete="onDelete(-1)"
                  @onSave="onSave(-1, $event)"
                />
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex
            v-for="group in employeeServiceGroups"
            :key="group"
          >
            <v-layout column>
              <v-flex>
                <span class="title">
                  {{ group || 'Прочие' }}
                </span>
              </v-flex>
              <v-flex>
                <v-layout
                  row
                  wrap
                  fill-height
                >
                  <v-flex
                    v-for="service in groupServices(group)"
                    :key="'serv'+service.n"
                    xs12
                    md6
                    lg4
                    xl3
                  >
                    <ServiceCard
                      :item="service"
                      :employee="item.id"
                      :employee-name="fullName"
                      @onDelete="onDelete(service.n)"
                      @onSave="onSave(service.n, $event)"
                    />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ServiceCard from '@/components/service/ServiceCard.vue'
import { serviceInit } from '@/components/business/utils'
import { fullName } from '@/components/business/utils'

export default {
  components: { ServiceCard },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      newService: undefined,
      searchString: ''
    }
  },
  computed: {
    ...mapGetters([]),
    employeeServices () {
      return (
        this.item &&
        this.item.j &&
        this.item.j.services.map((x, n) => ({ ...serviceInit(x), ...{ n: n } }))
      )
    },
    employeeServiceGroups () {
      return [
        ...new Set(
          this.filteredServices && this.filteredServices.map(x => x.group)
        )
      ].sort((a, b) => (a < b ? -1 : 1))
    },
    filteredServices () {
      return this.employeeServices.filter(
        x =>
          !this.searchString ||
          (x.name &&
            x.name.toUpperCase().indexOf(this.searchString.toUpperCase()) >
              -1) ||
          (x.group &&
            x.group.toUpperCase().indexOf(this.searchString.toUpperCase()) >
              -1) ||
          (x.notes &&
            x.notes.toUpperCase().indexOf(this.searchString.toUpperCase()) >
              -1) ||
          (x.price && x.price == this.searchString) ||
          (x.duration && x.duration == this.searchString)
      )
    },
    fullName () {
      return fullName(this.item)
    }
  },
  methods: {
    groupServices (group) {
      return this.filteredServices.filter(
        x => (!group && !x.group) || group === x.group
      )
    },
    onDelete (n) {
      if (n === -1) {
        this.newService = undefined
        return
      }
      let services = this.employeeServices
      services.splice(n, 1)
      this.$emit('onSave', services)
    },
    onNew () {
      this.newService = serviceInit()
    },
    onSave (n, payload) {
      let services = this.employeeServices
      if (n === -1) {
        services.unshift(this.newService)
        this.newService = undefined
      } else {
        services.splice(n, 1, payload)
      }
      this.$emit('onSave', services)
    }
  }
}
</script>
