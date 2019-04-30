<template>
  <div>
    <PageHeader text="تعديل البيانات" icon="edit"></PageHeader>
    <v-card class="small-round-corners light-box-shadow pa-5 mb-5">
      <v-form ref="editForm" @submit.prevent="submitEdit">
        <v-text-field
          v-model="userClone.first_name"
          label="الاسم الأول"
          validate-on-blur
          :rules="generalValidationRules.required"
        >
        </v-text-field>
        <v-text-field
          v-model="userClone.last_name"
          label="الاسم الأخير"
          validate-on-blur
          :rules="generalValidationRules.required"
        >
        </v-text-field>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="500"
          max-width="290px"
          lazy
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="userClone.date_of_birth"
              label="تاريخ الميلاد"
              prepend-icon="event"
              readonly
              validate-on-blur
              :rules="generalValidationRules.required"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            ref="picker"
            v-model="userClone.date_of_birth"
            :max="minAge()"
            min="1950-01-01"
            @change="saveDate"
          ></v-date-picker>
        </v-menu>
        <v-btn
          :ripple="false"
          dark
          flat
          round
          class="blue-cyan-gradient fixed-size-btn btn-shadow"
          type="submit"
        >
          تعديل
        </v-btn>
        <div v-for="error in editErrors" :key="error" class="red--text">
          - {{ error }}
        </div>
      </v-form>
    </v-card>
    <PageHeader text="تغيير كلمة السر" icon="https"></PageHeader>
    <v-card class="small-round-corners light-box-shadow pa-5">
      <v-form ref="passwordForm" @submit.prevent="changePassword">
        <v-text-field
          v-model="user.current_password"
          label="كلمة السر الحالية"
          type="password"
          validate-on-blur
          :rules="[...generalValidationRules.required, validationRules.passwordLengthCheck]"
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          label="كلمة السر الجديدة"
          type="password"
          validate-on-blur
          :rules="[...generalValidationRules.required, validationRules.passwordLengthCheck]"
        ></v-text-field>
        <v-text-field
          v-model="user.password_confirmation"
          label="تأكيد كلمة السر"
          type="password"
          validate-on-blur
          :rules="[...generalValidationRules.required, validationRules.passwordConfirmation]"
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
    </v-card>
  </div>
</template>
<script>
import PageHeader from '~/components/generic/PageHeader'
export default {
  components: { PageHeader },
  props: {
    userClone: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      date: null,
      today: new Date().toISOString(),
      maxYear: 0,
      editErrors: [],
      menu: false,
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
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    saveDate (date) {
      this.$refs.menu.save(date)
    },
    minAge () {
      this.maxYear = Number(this.today.substr(0, 4)) - 18
      return `${this.maxYear}${this.today.substr(4, 6)}`
    },
    submitEdit () {
      if (this.$refs.editForm.validate()) {
        this.$axios.$put('auth', {
          'first_name': this.userClone.first_name,
          'last_name': this.userClone.last_name,
          'date_of_birth': this.userClone.date_of_birth
        }).then((r) => {
          this.$store.commit('showSuccessMsg', {
            message: 'تم تعديل البيانات بنجاح'
          })
          this.$store.commit('setUser', r.data)
          this.editErrors = []
        }).catch((e) => {
          this.editErrors = []
          this.editErrors.push(...e.response.data.errors.full_messages)
        })
      }
    },
    changePassword () {
      if (this.$refs.passwordForm.validate()) {
        this.$axios.$put('auth', {
          'current_password': this.user.current_password,
          'password': this.user.password,
          'password_confirmation': this.password_confirmation
        }).then(() => {
          this.$store.commit('showSuccessMsg', {
            message: 'تم تغيير كلمة السر بنجاح'
          })
          this.errors = []
          this.user.password = ''
          this.user.current_password = ''
          this.user.password_confirmation = ''
        }).catch(() => {
          this.errors = ['كلمة السر الحالية غير صحيحة']
        })
      }
    }
  }
}
</script>
