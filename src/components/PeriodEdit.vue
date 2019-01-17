<template>
  <VFlex d-flex>
    <VCard>
      <VContainer>
        <VLayout
          column
          align-center
          justify-center
        >
          <VFlex>
            <VLayout row>
              <VFlex>
                <v-switch
                  v-if="showSwitch"
                  v-model="switchValue"
                />
              </VFlex>
              <VFlex>
                <v-card-text>{{ caption }}</v-card-text>
              </VFlex>
            </VLayout>
          </VFlex>
          <VLayout row>
            <VFlex>
              <TimeEdit
                enabled="!showSwitch || switchValue"
                :time="startVal"
                @onEdit="onEditStart"
              />
            </VFlex>
            <VFlex>
              <TimeEdit
                enabled="!showSwitch || switchValue"
                :time="endVal"
                @onEdit="onEditEnd"
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
    periodStart: {
      type: String,
      default: undefined
    },
    periodEnd: {
      type: String,
      default: undefined
    },
    showSwitch: { type: Boolean, default: false },
    switch: { type: Boolean, default: false }
  },
  data() {
    return {
      switchValue: undefined,
      startVal: undefined,
      endVal: undefined
    };
  },
  watch: {
    switchValue: 'loadValues',
    periodStart: 'loadValues',
    periodEnd: 'loadValues'
  },
  mounted() {
    this.loadValues();
  },
  methods: {
    onEditStart(payload) {
      this.startVal = payload;
      this.$emit('onEdit', [this.startVal, this.endVal]);
    },
    onEditEnd(payload) {
      this.endVal = payload;
      this.$emit('onEdit', [this.startVal, this.endVal]);
    },
    loadValues() {
      this.switchValue = this.switch;
      this.startVal = this.periodStart;
      this.endVal = this.periodEnd;
    }
  }
};
</script>
