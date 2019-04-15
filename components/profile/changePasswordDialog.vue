<template>
  <v-card class="small-round-corners light-box-shadow text-xs-center">
    <v-btn
      absolute
      icon
      fab
      right
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
  props: {
    upcomingUser: {
      type: Object,
      required: true
    }
  },
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
        passwordLengthCheck () {
          if ((self.user.password && self.user.password.length < 6) ||
              (self.user.current_password && self.user.current_password.length < 6)) {
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
        }).then((r) => {
          this.$store.commit('setUser', r.data)
          this.closeDialog()
          this.errors = []
        }).catch((e) => {
          this.errors = []
          this.errors.push('كلمة السر الحالية غير صحيحة')
        })
      }
    },
    closeDialog () {
      this.$emit('close-dialog', false)
    }
  }
}
</script>
<style>
  .btn-position {
    right: 5px;
  }
</style>
