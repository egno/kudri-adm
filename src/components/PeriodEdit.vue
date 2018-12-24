<template>
  <VFlex
    d-flex
    xs12
    sm6
    md4
    lg3
    xl2
  >
    <VCard>
      <VContainer>
        <VLayout
          column
          align-center
        >
          <VFlex>
            <div>{{ caption }}</div>
          </VFlex>
          <VLayout row>
            <VFlex>
              <TimeEdit
                :time="period[0]"
                @onEdit="onEdit(0, $event)"
              />
            </VFlex>
            <VFlex>
              <TimeEdit
                :time="period[1]"
                @onEdit="onEdit(1, $event)"
              />
            </VFlex>
          </VLayout>
        </VLayout>
      </VContainer>
    </VCard>
  </VFlex>
</template>

<script>
import TimeEdit from '@/components/TimeEdit.vue';
export default {
  components: { TimeEdit },
  props: {
    caption: { type: String, default: '' },
    period: {
      type: Array,
      default() {
        return ['', ''];
      }
    }
  },
  methods: {
    onEdit(i, payload) {
      this.period[i] = payload;
      this.$emit('onEdit');
    }
  }
};
</script>
