<template>
  <v-card-title>
    <slot />
    <div class="right-button">
      <v-btn
        icon
        @click="$emit('close')"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </div>
  </v-card-title>
</template>

<style scoped>
.right-button {
  position: absolute;
  right: 0;
  top: 0;
  background: #fff;
}
</style>
