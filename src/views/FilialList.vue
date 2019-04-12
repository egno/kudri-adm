<template>
  <BranchesLayout :is-creating="!businessIsFilial && isCreating" :is-button-visible="!businessIsFilial" @add="createBranch('newFilial')" @close="onClose">
    <template v-if="!businessIsFilial && isCreating" slot="content">
      <div class="businesscard-tabs__tab-wrapper">
        <div class="businesscard-tabs__tab">
          <div class="businesscard-tabs__tab-header" :class="{_active: infoTab}" @click="infoTab = !infoTab">
            Информация
          </div>
          <div class="businesscard-tabs__tab-header" :class="{_active: !infoTab}" @click="infoTab = !infoTab">
            Режим работы
          </div>
        </div>
      </div>
      <VLayout class="businesscard-tabs__content">
        <BusinessCardEdit
          :business-info="newBranch"
          :current-tab="infoTab? 'infoTab' : 'scheduleTab'"
          @tabChange="infoTab=!infoTab"
          @save="debouncedSendData"
          @formChange="isFormChanged = true"
        />
      </VLayout>
      <Modal
        :visible="showSave"
        :template="saveModalTemplate"
        @rightButtonClick="closeWithoutSaving"
        @leftButtonClick="showSave = false"
        @close="showSave = false"
      >
        <template slot="text">
          <div class="uno-modal__text">
            {{ saveModalTemplate.text }}
          </div>
        </template>
      </Modal>
    </template>
    <template v-else slot="content">
      <VLayout wrap class="branches__cities">
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
              {{ branches.length | formatFilial }}
            </div>
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
                :is-editable="!businessIsFilial"
                @click="showCheckoutDialog(item)"
                @delete="showDeleteDialog(item)"
              >
                {{ i }} {{ item.id }}
              </FilialCard>
            </div>
          </VLayout>
        </template>
      </div>
      <Modal
        :visible="checkoutModalVisible"
        :template="checkoutTemplate"
        @close="checkoutModalVisible = false"
        @leftButtonClick="checkoutModalVisible = false; branchToCheckout = null"
        @rightButtonClick="checkout"
      >
        <template slot="text">
          <div
            v-if="branchToCheckout && branchToCheckout.j && branchToCheckout.j.name"
            class="uno-modal__text"
          >
            Вы будете перемещены в филиал <b>{{ branchToCheckout.j.name }}.</b>
          </div>
          <div v-else class="uno-modal__text">
            Вы будете перемещены в филиал.
          </div>
        </template>
      </Modal>
      <Modal
        :visible="deleteModalVisible"
        :template="deleteTemplate"
        @close="deleteModalVisible = false"
        @leftButtonClick="deleteModalVisible = false; branchToDelete = null"
        @rightButtonClick="deleteBranch"
      >
        <template slot="text">
          <div
            v-if="branchToDelete && branchToDelete.j && branchToDelete.j.name"
            class="uno-modal__text"
          >
            Это приведет к удалению филиала <b>{{ branchToDelete.j.name }}.</b> Вся информация филиала будет удалена.
          </div>
          <div v-else class="uno-modal__text">
            Это приведет к удалению филиала. Вся информация филиала будет удалена.
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
import { mapState, mapActions, mapGetters } from 'vuex'
import BranchesLayout from '@/components/branches/BranchesLayout'
import Modal from '@/components/common/Modal'
import BusinessCardEdit from '@/components/business/BusinessCardEdit.vue'
import { debounce } from 'lodash'
import { formatDate } from '@/components/calendar/utils'
import { filials} from "../components/business/mixins"
import { conjugateFilial } from '@/components/utils'

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { BranchesLayout, FilialCard, Modal, BusinessCardEdit },
  filters: {
    formatFilial (n) {
      return conjugateFilial(n)
    }
  },
  mixins: [filials],
  data () {
    return {
      isCreating: false,
      isFormChanged: false,
      branchToCheckout: undefined,
      branchToDelete: undefined,
      branchesList: [],
      branchesByCities: {},
      checkoutModalVisible: false,
      selectedCity: undefined,
      checkoutTemplate: {
        header: 'Перейти в филиал?',
        text: '<div>Вы будете перемещены</div><div>в филиал Estel Professional.</div>',
        leftButton: 'ОТМЕНА',
        rightButton: 'ПЕРЕЙТИ'
      },
      deleteModalVisible: false,
      newBranch: null,
      infoTab: true,
      saveModalTemplate: {
        header: 'Данные были изменены.',
        text: `Выйти без сохранения?`,
        leftButton: 'ОТМЕНА',
        rightButton: 'ДА'
      },
      showSave: false
    }
  },
  computed: {
    ...mapState({
      categories: state => state.business.businessCategories
    }),
    ...mapGetters(['businessId','businessInfo', 'businessIsFilial']),
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
    this.debouncedSendData = debounce(this.sendData, 300)
  },
  mounted () {
    this.setActions(this.formActions)
    this.$root.$on('onAction', this.createBranch)
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.createBranch)
  },
  methods: {
    ...mapActions(['setActions', 'setBusiness']),
    checkout () {
      if (!this.branchToCheckout) {
        return
      }
      const id = this.branchToCheckout.id

      this.setBusiness(id)
      this.checkoutTo(id)
    },
    checkoutTo (id) {
      this.$router.push({
        name: 'businessVisit',
        params: {
          id,
          date: formatDate(new Date())
        }
      })
    },
    closeWithoutSaving () {
      this.showSave = false
      this.isCreating = false
      this.newBranch = null
      this.infoTab = true
    },
    deleteBranch () {
      Api()
        .delete(`business?id=eq.${this.branchToDelete.id}`)
        .then(() => {
          this.getFilials()
          this.branchToDelete = null
          this.deleteModalVisible = false
        })
        .catch(err => {
          console.log(err)
          return false
        })
    },
    getFilials () {
      const id = this.businessIsFilial
        ? this.businessInfo && this.businessInfo.parent
        : this.businessId

      if (!id) return
      this.getFilialsOf(id)
        .then(res => {
          this.branchesList = res
          this.groupBranches()
        })
    },
    groupBranches () {
      this.branchesByCities = {}
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
    createBranch (payload) {
      if (payload === 'newFilial') {
        this.newBranch = new Business({
          id: 'new',
          parent:this.businessId,
          name: this.businessInfo.name,
        })
        if (this.businessInfo && this.businessInfo.j) {
          this.newBranch.inn = this.businessInfo.j.inn
          this.newBranch.schedule = Object.assign({}, this.businessInfo.j.schedule)
          if (this.categories && this.categories.includes(this.businessInfo.j.category)) {
            this.newBranch.category = this.businessInfo.j.category
          }
        }
        this.isCreating = true
      }
    },
    onClose () {
      this.isFormChanged? this.showSave = true : this.isCreating = false
    },
    sendData (branch) {
      branch.j.phones = branch.j.phones.filter(x => x > '')
      branch.parent = this.businessId
      if (branch.id === 'new') {
        branch.id = null
      }
      branch.save()
        .then(() => {
          this.getFilials()
          this.isCreating = false
          this.isFormChanged = false
          this.newBranch = null
          this.infoTab = true
        })
    },
    showCheckoutDialog (branch) {
      if (branch.id === this.businessId) {
        this.checkoutTo(this.businessId)
      } else {
        this.checkoutModalVisible = true
        this.branchToCheckout = branch
      }
    },
    showDeleteDialog (branch) {
      this.deleteModalVisible = true
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

