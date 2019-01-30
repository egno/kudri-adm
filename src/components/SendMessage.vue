<template>
  <VDialog v-model="edit">
    <VCard flat>
      <VCardTitle>Сообщение</VCardTitle>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  props: {
    edit: { type: Boolean, default: false }
  }
};
</script>
