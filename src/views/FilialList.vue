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
                @delete="showDeleteModal(item)"
              >
                {{ i }} {{ item.id }}
              </FilialCard>
            </div>
          </VLayout>
        </template>  
      </div>
      <Modal
        :visible="checkoutModal"
        :template="checkoutTemplate"
        @close="checkoutModal = false"
        @leftButtonClick="checkoutModal = false"
        @rightButtonClick="checkout"
      />
      <Modal
        :visible="deleteModal"
        :template="deleteTemplate"
        @close="deleteModal = false"
        @leftButtonClick="deleteModal = false"
        @rightButtonClick="deleteBranch"
      />
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
      branchDesiredToDelete: undefined,
      branchesList: [],
      branchesByCities: {},
      checkoutModal: false,
      selectedCity: undefined,
      checkoutTemplate: {
        header: 'Перейти в филиал?',
        text: '<div>Вы будете перемещены</div><div>в филиал Estel Professional.</div>',
        leftButton: 'ОТМЕНА',
        rightButton: 'ПЕРЕЙТИ'
      },
      deleteModal: false,
    }
  },
  computed: {
    ...mapGetters(['businessId','businessInfo', 'businessInn']),
    deleteTemplate () {
      if (!this.branchDesiredToDelete || !this.branchDesiredToDelete.j || !this.branchDesiredToDelete.j.name) {
        return {
          header: 'Удалить филиал?',
          text: `Это приведет к удалению филиала. Вся информация филиала будет удалена.`,
          leftButton: 'ОТМЕНА',
          rightButton: 'УДАЛИТЬ'
        }
      }
      return {
        header: 'Удалить филиал?',
        text: `Это приведет к удалению филиала ${this.branchDesiredToDelete.j.name}. Вся информация филиала будет удалена.`,
        leftButton: 'ОТМЕНА',
        rightButton: 'УДАЛИТЬ'
      }
    }
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
    ...mapActions(['setActions', 'setBusiness']),
    checkout () {
      if (!this.branchDesiredToCheckout) {
        return
      }
      const id = this.branchDesiredToCheckout.id
      this.setBusiness(id)
      this.$router.push({ name: 'businessCard', params: { id: id } })
    },
    deleteBranch () {

    },
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
          if (!this.branchesByCities[city].includes(branch)) {
            this.branchesByCities[city].push(branch)
          }
        }
      })
    },
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.branchesList.unshift(new Business({ access: true, parent:this.businessId, name: this.businessInfo.name }))
        this.getCities()
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
      if (branch.id === this.businessId) {
        this.$router.push({ name: 'businessCard', params: { id: this.businessId } })
      } else {
        this.checkoutModal = true
        this.branchDesiredToCheckout = branch
      }
    },
    showDeleteModal (branch) {
      this.deleteModal = true
      this.branchDesiredToDelete = branch
    },
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

