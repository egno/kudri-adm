<template>
  <BranchesLayout @add="onAction('newFilial')">
    <template slot="content">
      <VLayout class="branches__cities">
        <div 
          v-for="(branches, city) in branchesByCities" 
          :key="city" 
          class="branches__city"
          :class="{_active: selectedCity === city}"
          @click="selectedCity = city"
        >
          {{ city.split(', ')[0] }}
        </div>
        <div class="branches__city" :class="{_active: !selectedCity}" @click="selectedCity = null">
          Все города
        </div>
      </VLayout>
      <div v-for="(branches, city) in branchesByCities" :key="city" class="branches__group">
        <template v-if="selectedCity === city || !selectedCity">        
          <div class="city-branch">
            <div class="city-branch__city">
              {{ city.split(', ')[0] }}
            </div>
            <div class="city-branch__count"> 
              {{ branches.length }} филиала
            </div><!-- todo добавить склонение слова филиала -->
          </div>
          <VLayout  
            justify-start
            align-start 
            wrap 
            class="branches__cards"
          >
            <div
              v-for="(item, i) in branches"
              :key="i"
              class="card-wrapper"
            >
              <FilialCard
                :branch="item"
                :pinned="item.id === businessId"
                @onSave="onSave"
                @click="showCheckoutModal(item)"
              >
                {{ i }} {{ item.id }}
              </FilialCard>
            </div>
          </VLayout>
        </template>  
      </div>
      <Modal :visible="checkoutModal" :template="checkoutTemplate" />
      <Modal :visible="deleteModal" />
    </template>
  </BranchesLayout>
</template>

<script>
import Api from '@/api/backend'
import FilialCard from '@/components/branches/FilialCard.vue'
import Business from '@/classes/business'
import { mapActions, mapGetters } from 'vuex'
import BranchesLayout from '@/components/branches/BranchesLayout'
import Modal from '@/components/common/Modal'

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { BranchesLayout, FilialCard, Modal },
  data () {
    return {
      formActions: [
        {
          label: 'Добавить филиал',
          action: 'newFilial',
          default: true
        },
        {
          label: 'Удалить филиал',
          action: 'deleteFilial',
          default: false
        }
      ],
      edit: false,
      branchDesiredToCheckout: undefined,
      branchesList: {},
      branchesByCities: {},
      checkoutModal: false,
      selectedCity: undefined,
      checkoutTemplate: {
        header: 'Перейти в филиал?',
        text: '<div>Вы будете перемещены</div><div>в филиал Estel Professional.</div>',
        leftButton: 'ОТМЕНА',
        rightButton: 'ПЕРЕЙТИ'
      },
      deleteModal: false
    }
  },
  computed: {
    ...mapGetters(['businessId','businessInfo', 'businessInn']),
  },
  watch: {
    businessInn: 'fetchData'
  },
  created () {
    this.fetchData()
  },
  mounted () {
    this.setActions(this.formActions)
    this.$root.$on('onAction', this.onAction)
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.onAction)
  },
  methods: {
    ...mapActions(['setActions']),
    fetchData () {
      if (!this.businessInn) return
      Api()
        .get(`business?j->>inn=eq.${this.businessInn}`)
        .then(res => res.data)
        .then(res => {
          this.branchesList = res
          this.getCities()
        })
    },
    getCities () {
      this.branchesList.forEach(branch => {
        if (!branch.j || !branch.j.address) {
          return
        }
        if (branch.j.address.city) {
          const city = branch.j.address.city

          if (!this.branchesByCities[city]) {
            this.$set(this.branchesByCities, city, [])
          } 
          this.branchesByCities[city].push(branch)          
        }
      })
    },
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.branchesList.unshift(new Business({ access: true, parent:this.businessId, name: this.businessInfo.name }))
      }
    },
    onSave (payload) {
      this.sendData(payload)
    },
    sendData (branchesList) {
      branchesList.j.phones = branchesList.j.phones.filter(x => x > '')
      branchesList.parent = this.businessId
      if (!branchesList.id) {
        Api().post(`business`, branchesList)
        // .then(res => {
        //   const newId = this.locationId(res.headers);
        //   if (newId) {
        //   router.push({ name: 'businessCard', params: { id: newId } });
        //   }
        // });
      } else {
        Api().patch(`business?id=eq.${branchesList.id}`, branchesList)
      }
    },
    showCheckoutModal (branch) {
      this.checkoutModal = true
      this.branchDesiredToCheckout = branch
    }
  }
}
</script>

<style lang="scss">
  .card-wrapper {
    margin: 0 10px 20px 0;
  }

  .city-branch {
    display: flex;
    align-items: baseline;
    margin-bottom: 32px;
    line-height: 24px;

    &__city {
      padding-right: 11px;
      font-family: Roboto Slab, serif;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      color: #07101C;
    }

    &__count {
      padding-left: 11px;
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: #8995AF;
      border-left: 1px solid rgba(137, 149, 175, 0.1);
    }

  }
</style>

