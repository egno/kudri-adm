<template>
  <div>
    <div
      v-if="mini"
      class="add-menu-list-mini"
    >
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
        <VListTile
          v-for="(item, i) in adds"
          :key="i"
          active-class="accent"
          @click="onAction"
        >
          <v-list-tile-content>
            <VListTileTitle>{{ item }}</VListTileTitle>
          </v-list-tile-content>
        </VListTile>
      </VListGroup>
    </v-list>
  </div>
</template>

<script>
export default {
  data: () => ({
    adds: ['Менеджера', 'Компанию', 'Частного мастера'],
    expand: false,
    mini: false
  }),
  methods: {
    onAction() {}
  }
};
</script>

