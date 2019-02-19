<template>
  <VLayout
    column
    d-flex
  >
    <div>Режим работы</div>
    <VFlex
      justify-space-around
      row
      wrap
    >
      <VFlex>
        <PeriodEdit
          v-for="(item, i) in modes"
          :key="i"
          :itemindex="i"
          :selected="modesIndexes[i]"
          :period-start="item[0]"
          :period-end="item[1]"
          @onEdit="onEdit(i,$event)"
          @selectDay="selectDay(i, $event)"
        />
      </VFlex>
      <VBtn
        v-if="addButton"
        class="transparent add"
        @click="addMode"
      >
        Добавить режим работы
      </VBtn>
    </VFlex>
  </VLayout>
</template>

<script>
import PeriodEdit from '@/components/PeriodEdit.vue';
import _ from 'lodash';

export default {
  components: { PeriodEdit },
  props: {
    schedule: {
      type: Object,
      default() {
        return {
          type: 'week',
          data: [
            ['11', '22'],
            ['11', '22'],
            ['121', '12'],
            ['121', '12'],
            ['', ''],
            ['', ''],
            ['', '']
          ]
        };
      }
    }
  },
  data() {
    return {
      dow: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
      modes: [],
      qwe: [
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', '']
      ]
    };
  },
  computed: {
    addButton() {
      if (_.findIndex(this.modes, function(o) { return o[0] === '' && o[1] === '' || o[0] === null || o[1] === null }) === -1) {
        return true
      } else {
        return false
      }
    },
    modesIndexes() {
      let indexes = [];
      for (let i = 0; i < this.modes.length; i++) {
        let item = this.modes[i].join('');
        let index = this.getAllIndexes(this.schedule.data, item);
        indexes.push(index);
      }
      return indexes;
    }
  },
  mounted() {
    this.modes = _.uniqBy(this.schedule.data, function(e) {
      return [e[0], e[1]].join();
    });
    this.modes = _.remove(this.modes, function(n) {
      return n[0] !== '';
    });
  },
  methods: {
    addMode() {
      if (_.findIndex(this.modes, function(o) { return o[0] === '' && o[1] === '' || o[0] === null || o[1] === null }) === -1) {
        this.modes.push([null, null]);
      }
    },
    getAllIndexes(arr, val) {
      let arrString = [];
      arr.forEach(function(element) {
        arrString.push(element.join(''));
      });
      let indexes = [],
        i = -1;
      while ((i = arrString.indexOf(val, i + 1)) !== -1) {
        indexes.push(i);
      }
      return indexes;
    },
    selectDay(i, payload) {
      let p = payload[0];
      this.$set(this.schedule.data, p, [payload[1], payload[2]]);
      this.$emit('onEdit', this.schedule);
    },
    onEdit(i, payload) {
      let indexes = this.modesIndexes[i];
      indexes.forEach(el => {
        this.$set(this.schedule.data, el, payload);
      });
      this.$emit('onEdit', this.schedule);
      this.modes = _.uniqBy(this.schedule.data, function(e) {
        return [e[0], e[1]].join();
      });
      this.modes = _.remove(this.modes, function(n) {
        return n[0] !== '';
      });
    }
  }
};
</script>
