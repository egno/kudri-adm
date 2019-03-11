<template>
  <v-hover>
    <v-card
      v-if="item.show"
      slot-scope="{ hover }"
      class="menu-item-card"
      color="rgba(0,0,0,0)"
      flat
      pa-0
    >
      <div class="menu-item-container">
        <div class="menu-item-left">
          <VListTile :to="item.route">
            <VListTileContent>
              <VListTileTitle class="body-1">
                {{ item.title }}
              </VListTileTitle>
            </VListTileContent>
            <VListTileAction>
              <span
                v-if="item.count"
                class="list-item--count"
              >
                {{ item.count }}
              </span>
            </VListTileAction>
          </VListTile>
        </div>
        <div
          v-show="item.action && ($route.name === (item.route && item.route.name) || hover)"
          class="add-btn"
          @click="$emit('onAction',item.action)"
        >
          <v-icon color="white">
            add
          </v-icon>
        </div>
      </div>
    </v-card>
    <div v-else />
  </v-hover>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style scoped>
.add-btn {
  width: 48px;
  height: 48px;
  background: #ef4d37;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.menu-item-container {
  display: flex;
}
.menu-item-left {
  flex-grow: 1;
}
</style>
