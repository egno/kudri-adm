<template>
  <div
    class="notif"
    :class="{active: count > 0}"
  >
    <div
      v-if="count > 0"
      class="count"
    >
      {{ count }}
    </div>
  </div>
</template>

<script>

export default {
  props: {
    source: { type: String, default: () => '' }
  },
  data: () => ({
    count: 3,
  }),
};
</script>
<style lang="scss">
  .notif {
    width: 60px;
    border-left: 1px solid rgba(137, 149, 175, 0.1);
    background: url('../assets/bellh.svg') no-repeat center center;
    background-size: 20px;
    cursor: pointer;
    position: relative;
    &.active {
      background: url('../assets/bell.svg') no-repeat center center;
      background-size: 20px;
    }
    .count {
      position: absolute;
      width: 16px;
      height: 16px;
      background: #07101C;
      color: #fff;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-content: center;
      top: 24px;
      right: 14px;
      font-size: 11px;
    }
  }
</style>