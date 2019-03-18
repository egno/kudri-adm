<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <h2>Оповещения</h2>
      </v-flex>
      <v-flex>
        Провайдер SMS:
        {{ businessSettings.notifications.provider.name }}
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="businessSettings.notifications.provider.key"
          label="Ключ"
        />
      </v-flex>
      <v-flex>
        <h3>События</h3>
      </v-flex>
      <v-flex
        v-for="(event, i) in businessSettings.notifications.events"
        :key="i"
      >
        <v-switch
          v-model="event.enabled"
          :label="event.title"
        />
        <PhoneEdit v-if="typeof event.phone !== 'undefined'" :phone="event.phone" @onEdit="event.phone = $event" />
      </v-flex>
      <v-flex>
        <v-btn @click="save">
          Сохранить
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import BusinessSettings from '@/classes/business_settings'
import { mapGetters } from 'vuex'
import PhoneEdit from '@/components/business/PhoneEdit.vue'

export default {
    components:{PhoneEdit},
  data () {
    return {
      businessSettings: new BusinessSettings()
    }
  },
  computed: {
    ...mapGetters(['businessId'])
  },
  watch: {
    businessId: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      if (!this.businessId) return
      this.businessSettings.load(this.businessId)
    },
    save () {
      this.businessSettings.save()
    }
  }
}
</script>
