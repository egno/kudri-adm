<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <VLayout
      row
      wrap
    >
      <VFlex
        xs12
        sm12
        md6
      >
        <BusinessMainInfo />
      </VFlex>
      <VFlex
        xs12
        sm12
        md6
      >
        <UserInfo />
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import BusinessMainInfo from "@/components/BusinessMainInfo.vue";
import UserInfo from "@/components/UserInfo.vue";

export default {
  components: { BusinessMainInfo, UserInfo },
  data () {
    return {
      data: { data: {} }
    };
  },
  computed: {
    id () {
      return this.$route.params.id;
    }
  }
};
</script>
