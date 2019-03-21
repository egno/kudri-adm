import BusinessSchedule from '@/classes/businessSchedule'

export const businessMixins = {
  computed: {
    id () {
      return this.$route && this.$route.params && this.$route.params.id
    },
    employee_id () {
      return this.$route && this.$route.params && this.$route.params.employee
    },
    phones () {
      if (!(this.data && this.data.j)) {
        return []
      }
      if (!this.data.j.phones) {
        return []
      }
      if (Array.isArray(this.data.j.phones)) {
        return this.data.j.phones
      }
      return [this.data.j.phones]
    }
  },
  methods: {
    prependHttpToUrl (url) {
      if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
        return url
      } else {
        return 'http://' + url
      }
    },
    dataPrefill (data) {
      if (!data) {
        data = {}
      }
      if (!data.j) {
        data.j = {}
      }
      if (!data.j.phones) {
        data.j.phones = []
      }
      if (!data.j.links) {
        data.j.links = {
          vk: '',
          instagram: '',
          others: [{ uri: '' }]
        }
      }
      if (!data.j.address) {
        data.j.address = {}
      }
      if (!data.j.services) {
        data.j.services = []
      }
      if (!data.j.weekSchedule) {
        data.j.weekSchedule = {}
      }
      if (Array.isArray(data.j.weekSchedule)) {
        data.j.weekSchedule = { data: data.j.weekSchedule }
      }
      if (!data.j.weekSchedule.data) {
        data.j.weekSchedule.data = [
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
          ['', '']
        ]
      }
      return data
    },
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  }
}

export const scheduleMixin = {
  props: {
    weekSchedule: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    'weekSchedule' () {
      this.update()
      this.setDays()
    }
  },
  data () {
    return {
      dow: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
      newWeekSchedule: this.weekSchedule && new BusinessSchedule(this.weekSchedule),
      days: undefined
    }
  },
  created () {
    this.update()
    this.setDays()
  },
  methods: {
    setDays () {
      let weekSchedule = this.newWeekSchedule && this.newWeekSchedule.data
      let days = []

      if (!weekSchedule) {
        return
      }

      this.dow.map((dayName, dayIndex) => {
        days.push({
          dayName,
          dayIndex,
          value: weekSchedule[dayIndex]
        })
      })

      this.days = days
    },
    update () {
      this.newWeekSchedule = this.weekSchedule && new BusinessSchedule(this.weekSchedule)
    }
  }
}
