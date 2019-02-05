<template>
  <VFlex class="text-xs-center">
    <h2 class="display-3">
      Мой профиль
    </h2>
    <VForm ref="FormManagerProfile">
      <VBtn
        class="avatar"
        fab
        left
        large
        @click="avatarEdit = !avatarEdit"
      >
        <UserAvatar
          :name="name"
          size="4em"
          :src="avatar"
        />
      </VBtn>
      <VTextField
        v-model="fname"
        name="fname"
        label="Имя"
        type="text"
        :rules="[required]"
      />
      <VTextField
        v-model="flastname"
        name="flastname"
        label="Фамилия"
        :rules="[required]"
        type="text"
      />
      <VTextField
        v-model="femail"
        name="femail"
        label="e-mail"
        type="email"
        :rules="[required, email]"
      />
      <VBtn
        color="success"
        @click="saveProfile"
      >
        Сохранить
      </VBtn>
    </VForm>
    <VDialog
      v-model="avatarEdit"
      max-width="350px"
    >
      <VueAvatarEditor
        :avatar="avatar"
        @finished="saveImage"
      />
    </VDialog>
  </VFlex>
</template>

<script>
import UserAvatar from '@/components/avatar/UserAvatar.vue';
import VueAvatarEditor from '@/components/avatar/VueAvatarEditor.vue';

export default {
  components: {
    UserAvatar,
    VueAvatarEditor
  },
  data() {
    return {
      data: undefined,
      avatarEdit: false,
      fname: '',
      flastname: '',
      femail: '',
      required: v => !!v || 'Обязательное поле',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Введите действительный e-mail.';
      }
    };
  },
  computed: {
    initiales() {
      return this.fname + ' ' + this.flastname;
    },
    avatar() {
      return null;
    },
    name() {
      return this.initiales || null;
    }
  },
  methods: {
    saveProfile() {
      if (this.$refs.FormManagerProfile.validate()) {
        console.log('Profile saved!');
      }
    },
    saveImage() {
      // TODO
      console.log('saveImage');
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.drawer {
  .title {
    font-size: 18px !important;
  }
}
.avatar {
  margin-bottom: 35px;
}
.display-3 {
  margin-bottom: 75px;
}
.v-input {
  margin-bottom: 15px;
}
.v-text-field {
  input,
  label {
    &.v-label--active {
      transform: scale(1) translateY(-18px);
    }
  }
}
</style>
