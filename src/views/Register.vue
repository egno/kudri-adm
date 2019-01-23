<template>
  <div class="about">
    <RegisterForm />
  </div>
</template>


<script>
    import Api from '@/api/backend';
    import RegisterForm from '@/components/register/Register.vue';
    import { mapActions } from 'vuex';

    export default {
        components: { RegisterForm },
        data() {
            return {
                formActions: [
                    {
                        label: 'Добавить сотрудника',
                        action: 'newEmployee',
                        default: true
                    }
                ],
                edit: false,
                data: {}
            };
        },
        computed: {
            id() {
                return this.$route.params.id;
            }
        },
        mounted() {
            this.fetchData();
            this.setActions(this.formActions);
            this.$root.$on('onAction', this.onAction);
        },
        methods: {
            ...mapActions(['setActions']),
            fetchData() {
                Api()
                    .get(`employee?parent=eq.${this.id}`)
                    .then(res => res.data)
                    .then(res => {
                        this.data = res;
                    });
            },
            onAction(payload) {
                if (payload === this.formActions[0].action) {
                    this.data.push({ access: true, j: {} });
                }
            },
            onSave(payload) {
                this.sendData(payload);
            },
            sendData(data) {
                data.j.phones = data.j.phones.filter(x => x > '');
                data.parent = this.id;
                data.type = 'E';
                if (!data.id) {
                    Api().post(`employee`, data);
                    // .then(res => {
                    //   const newId = this.locationId(res.headers);
                    // if (newId) {
                    // router.push({ name: 'businessCard', params: { id: newId } });
                    // }
                    // });
                } else {
                    Api().patch(`employee?id=eq.${data.id}`, data);
                }
            }
        }
    };
</script>