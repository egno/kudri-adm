<template>
  <div>
    <div class="add-menu-list-mini">
      <div class="items">
        <div
          v-for="(item, i) in adds"
          :key="i"
        >
          <a href="#">
            {{ item }}
          </a>
        </div>
      </div>
    </div>
    <v-list v-if="navigationMini">
      <VListTile>
        <v-list-tile-action>
          <v-btn icon>
            <v-icon>add</v-icon>
          </v-btn>
        </v-list-tile-action>
      </VListTile>
    </v-list>

    <v-list v-else>
      <VListGroup
        v-model="expand"
        no-action
        :class="{'accent': !expand}"
      >
        <VListTile
          slot="activator"
          class="add-menu-button"
        >
          <v-list-tile-content>
            <VListTileTitle>
              <span class="title">
                Добавить
              </span>
            </VListTileTitle>
          </v-list-tile-content>
        </VListTile>
        <template v-for="(item, i) in adds">
          <VListTile
            :key="i"
            ripple
            active-class="accent"
            @click="onAction"
          >
            <v-list-tile-content class="list-group-item-unshift">
              <VListTileTitle>
                <span class="body-1">
                  {{ item }}
                </span>
              </VListTileTitle>
            </v-list-tile-content>
          </VListTile>
        </template>
      </VListGroup>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data: () => ({
    adds: ['Менеджера', 'Компанию', 'Частного мастера'],
    expand: false,
    mini: false
  }),
  computed: {
    ...mapGetters(['navigationMini'])
  },
  methods: {
    onAction() {}
  }
};
</script>

<style>
.list-group-item-unshift {
  margin-left: -3em;
}
</style>
