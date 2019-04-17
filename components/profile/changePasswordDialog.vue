<template>
  <v-card class="relative-position small-round-corners light-box-shadow text-xs-center">
    <v-btn
      icon
      class="btn-position"
      @click="closeDialog()"
    >
      <v-icon>close</v-icon>
    </v-btn>
    <v-container>
      <v-card-text>
        <h2>
          تغيير كلمة السر
        </h2>
      </v-card-text>
      <v-form ref="passwordForm" @submit.prevent="changePassword">
        <v-text-field
          v-model="user.current_password"
          label="كلمة السر الحالية"
          type="password"
          validate-on-blur
          :rules="[...validationRules.required, validationRules.passwordLengthCheck]"
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          label="كلمة السر الجديدة"
          type="password"
          validate-on-blur
          :rules="[...validationRules.required, validationRules.passwordLengthCheck]"
        ></v-text-field>
        <v-text-field
          v-model="user.password_confirmation"
          label="تأكيد كلمة السر"
          type="password"
          validate-on-blur
          :rules="[...validationRules.required, validationRules.passwordConfirmation]"
        ></v-text-field>
        <v-btn
          :ripple="false"
          dark
          flat
          round
          class="blue-cyan-gradient fixed-size-btn btn-shadow"
          type="submit"
        >
          تغيير كلمة السر
        </v-btn>
        <div v-for="error in errors" :key="error" class="red--text">
          - {{ error }}
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      errors: [],
      user: {
        current_password: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  computed: {
    validationRules () {
      let self = this
      return {
        required: [
          v => !!v || 'الخانة مطلوبة'
        ],
        passwordConfirmation () {
          if (
            self.user.password &&
            self.user.password_confirmation &&
            self.user.password !== self.user.password_confirmation
          ) {
            return 'كلمة السر و تأكيد كلمة السر غير متطابقين'
          } else {
            return true
          }
        },
        passwordLengthCheck (value) {
          if ((value && value.length < 6)) {
            return 'الحد الادني لكلمة السر 6 خانات'
          } else {
            return true
          }
        }
      }
    }
  },
  methods: {
    changePassword () {
      if (this.$refs.passwordForm.validate()) {
        this.$axios.$put('auth', {
          'current_password': this.user.current_password,
          'password': this.user.password,
          'password_confirmation': this.password_confirmation
        }).then(() => {
          // this.$store.commit('setUser', r.data)
          // TODO: show success msg
          this.closeDialog()
          this.errors = []
        }).catch(() => {
          this.errors = ['كلمة السر الحالية غير صحيحة']
        })
      }
    },
    closeDialog () {
      this.$emit('closeDialog', false)
    }
  }
}
</script>
<style>
.relative-position {
  position: relative;
}
.btn-position {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 3;
}
</style>
