<template>
  <v-card>
    <v-card-text>
      <v-layout column>
        <v-flex
          v-for="param in params"
          :key="param.code"
        >
          <v-text-field
            v-model="values[param.code]"
            :label="param.title"
          />
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    provider: {
      type: Object,
      default () {
        return {}
      }
    },
    values: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      paramsInfo: {
        login: {
          title: 'Логин'
        },
        password: {
          title: 'Пароль'
        },
        key: {
          title: 'Ключ API'
        }
      }
    }
  },
  computed: {
    params () {
      return (
        this.provider &&
        this.provider.j &&
        this.provider.j.services &&
        this.provider.j.services.sms &&
        this.provider.j.services.sms.params.map(x => {
          return { ...{ code: x.name }, ...this.paramsInfo[x.name] }
        })
      )
    }
  }
}
</script>

