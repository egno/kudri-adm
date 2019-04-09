<template>
  <BranchesLayout :is-creating="isCreating" @add="onAction('newFilial')">
    <template v-if="isCreating" slot="content">
      <div class="businesscard__tab-wrapper">
        <div class="businesscard__tab">
          <div class="businesscard__tab-header" :class="{_active: infoTab}" @click="infoTab = !infoTab">
            Информация
          </div>
          <div class="businesscard__tab-header" :class="{_active: !infoTab}" @click="infoTab = !infoTab">
            Режим работы
          </div>
        </div>
      </div>
      <VLayout class="businesscard__content">
        <BusinessCardEdit
          :business-info="newBranch"
          :current-tab="infoTab? 'infoTab' : 'scheduleTab'"
          @tabChange="infoTab=!infoTab"
          @save="sendData"
        />
      </VLayout>
    </template>
    <template v-else slot="content">
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
                @onSave="sendData"
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
        @leftButtonClick="checkoutModal = false; branchToCheckout = null"
        @rightButtonClick="checkout"
      />
      <Modal
        :visible="deleteModal"
        :template="deleteTemplate"
        @close="deleteModal = false"
        @leftButtonClick="deleteModal = false; branchToDelete = null"
        @rightButtonClick="deleteBranch"
      >
        <template slot="text">
          <div
            v-if="branchToDelete && branchToDelete.j && branchToDelete.j.name"
            class="uno-modal__text"
          >
            Это приведет к удалению филиала {{ branchToDelete.j.name }}. Вся информация филиала будет удалена.
          </div>
          <div v-else class="uno-modal__text">
            Это приведет к удалению услуги.
          </div>
        </template>
      </Modal>
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
import BusinessCardEdit from '@/components/business/BusinessCardEdit.vue'

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { BranchesLayout, FilialCard, Modal, BusinessCardEdit },
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
      isCreating: false,
      branchToCheckout: undefined,
      branchToDelete: undefined,
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
      newBranch: null,
      infoTab: true
    }
  },
  computed: {
    ...mapGetters(['businessId','businessInfo']),
    deleteTemplate () {
      if (!this.branchToDelete || !this.branchToDelete.j || !this.branchToDelete.j.name) {
        return {
          header: 'Удалить филиал?',
          text: `Это приведет к удалению филиала. Вся информация филиала будет удалена.`,
          leftButton: 'ОТМЕНА',
          rightButton: 'УДАЛИТЬ'
        }
      }
      return {
        header: 'Удалить филиал?',
        text: `Это приведет к удалению филиала ${this.branchToDelete.j.name}. Вся информация филиала будет удалена.`,
        leftButton: 'ОТМЕНА',
        rightButton: 'УДАЛИТЬ'
      }
    }
  },
  watch: {
    businessId: 'getFilials'
  },
  created () {
    this.getFilials()
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
      if (!this.branchToCheckout) {
        return
      }
      const id = this.branchToCheckout.id
      this.setBusiness(id)
      this.$router.push({ name: 'businessCard', params: { id: id } })
    },
    deleteBranch () {
      Api()
        .delete(`business?id=eq.${this.branchToDelete.id}`)
        .catch(err => {
          console.log(err)
          return false
        })
    },
    getFilials () {
      if (!this.businessId) return
      Api()
        .get(`business?parent=eq.${this.businessId}`)
        .then(res => res.data)
        .then(res => {
          this.branchesList = res
          this.groupBranches()
        })
    },
    groupBranches () {
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
        this.newBranch = new Business({
          id: 'new',
          parent:this.businessId,
          name: this.businessInfo.name,
        })
        this.isCreating = true
      }
    },
    sendData (branch) {
      branch.j.phones = branch.j.phones.filter(x => x > '')
      branch.parent = this.businessId
      if (branch.id === 'new') {
        branch.id = null
      }
      branch.save() //todo add debounce
      // todo add commit to store
      // todo add this.creating = false;
    },
    showCheckoutModal (branch) {
      if (branch.id === this.businessId) {
        this.$router.push({ name: 'businessCard', params: { id: this.businessId } })
      } else {
        this.checkoutModal = true
        this.branchToCheckout = branch
      }
    },
    showDeleteModal (branch) {
      this.deleteModal = true
      this.branchToDelete = branch
    },
  }
}
</script>

<style lang="scss">
  @import '../assets/styles/common';
  @import '../assets/styles/infocard';
  @import '../assets/styles/businesscard-tabs';

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

