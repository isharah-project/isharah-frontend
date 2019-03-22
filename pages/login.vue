
<template>
  <v-layout row wrap class="justify-center pt-4">
    <v-card  class="py-4 light-box-shadow text-xs-center card-size">
      <v-card-text v-if="state === 'email-confirmation'">
        تم ارسال رسالة على البريد الالكتروني لتأكيد حسابك
      </v-card-text>
      <div v-else>
        <v-card-text v-if="state === 'signin'">
          تسجيل الدخول
        </v-card-text>
        <v-card-text v-if="state === 'signup'">
          إنشاء حساب
        </v-card-text>
        <v-form v-if="state === 'signin'" ref="loginForm" class="mx-5" @submit.prevent="login">
          <v-text-field v-model="user.email" label="البريد الالكتروني" :rules="validationRules.emailRules"></v-text-field>
          <v-text-field v-model="user.password" label="كلمة السر" type="password" :rules="validationRules.required"></v-text-field>
          <div v-for="error in errors" :key="error" class="red--text">
            {{ error }}
          </div>
          <v-btn
            :ripple="false"
            dark
            flat
            round
            class="blue-cyan-gradient fixed-size-btn"
            type="submit"
          >
            دخول
          </v-btn>
        </v-form>
        <v-form v-if="state==='signup'" ref="signupForm" class="mx-5" @submit.prevent="register">
          <v-text-field v-model="user.email" label="البريد الالكتروني" :rules="validationRules.emailRules"></v-text-field>
          <v-text-field
            v-model="user.password"
            label="كلمة السر"
            type="password"
            :rules="validationRules.required"
          ></v-text-field>
          <v-text-field
            v-model="user.password_confirmation"
            label="تأكيد كلمة السر"
            type="password"
            :error-messages="validationRules.passwordCheck()"
            :rules="validationRules.required"
          ></v-text-field>
          <v-text-field v-model="user.first_name" label="الأسم الأول" :rules="validationRules.required"></v-text-field>
          <v-text-field v-model="user.last_name" label="الأسم الأخير" :rules="validationRules.required"></v-text-field>
          <v-select label="النوع" :items="gender_list" :rules="validationRules.required"></v-select>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="user.date_of_birth"
                label="تاريخ الميلاد"
                prepend-icon="event"
                readonly
                :rules="validationRules.required"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="user.date_of_birth"
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
            class="blue-cyan-gradient fixed-size-btn"
            type="submit"
          >
            إنشاء
          </v-btn>
          <div v-for="error in errors" :key="error" class="red--text">
            - {{ error }}
          </div>
        </v-form>
        <v-card-text v-if="state === 'signin'">
          ليس لديك حساب؟
          <v-btn flat class="blue--text" @click="changeState('signup')">
            إنشاء حساب
          </v-btn>
        </v-card-text>
        <v-btn color="#3b5998" dark round class="less-font-size">
          تسجيل الدخول عن طريق فيسبوك
          <v-icon light left>
            {{ $vuetify.icons.facebook }}
          </v-icon>
        </v-btn>
        <v-btn color="#D44638" dark round class="less-font-size">
          تسجيل الدخول عن طريق جوجل
          <v-icon light left>
            {{ $vuetify.icons.gmail }}
          </v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      state: 'signin',
      user: {
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        gender: '',
        city: '',
        country: '',
        date_of_birth: ''
      },
      gender_list: ['ذكر', 'انثى'],
      date: null,
      today: new Date().toISOString(),
      maxYear: 0,
      errors: [],
      menu: false
    }
  },
  computed: {
    validationRules () {
      let self = this
      return {
        emailRules: [
          v => !!v || 'البريد الالكتروني مطلوب',
          v => /(?!\.)[\w.-]+@[a-z0-9.-]+\.[a-z]{2,4}/.test(v) || 'يجب ان يكون البريد الالكتروني بالشكل الصحيح'
        ],
        required: [
          v => !!v || 'الخانة مطلوبة'
        ],
        passwordCheck () {
          if (self.user.password === '' || self.user.password_confirmation === '') {
            return []
          }
          if (self.user.password_confirmation && self.user.password && self.user.password === self.user.password_confirmation) {
            return []
          } else {
            return ['كلمة السر و تأكيد كلمة السر غير متطابقين']
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
      this.maxYear = this.today.substr(0, 4) - 18
      return this.maxYear + this.today.substr(4, 6)
    },
    changeState (page) {
      this.errors = []
      this.state = page
      if (page === 'signup') {
        this.user.email = this.user.password = ''
      }
    },
    genderSelect () {
      if (this.user.gender === 'ذكر') {
        return 'male'
      }
      return 'female'
    },
    register () {
      if (this.$refs.signupForm.validate()) {
        this.$axios.$post('auth', {
          'email': this.user.email,
          'password': this.user.password,
          'password_confirmation': this.user.password_confirmation,
          'first_name': this.user.first_name,
          'last_name': this.user.last_name,
          'gender': this.genderSelect(),
          'city': 'Cairo',
          'country': 'Egypt',
          'date_of_birth': this.user.date_of_birth,
          'confirm_success_url': process.env.FRONTEND_URL + '/login'
        }).then((r) => {
          this.errors = []
          this.changeState('email-confirmation')
        }).catch((e) => {
          this.errors = []
          this.errors.push(...e.response.data.errors.full_messages)
        })
      }
    },
    login () {
      if (this.$refs.loginForm.validate()) {
        this.$auth.loginWith('local', {
          data: {
            email: this.user.email,
            password: this.user.password
          }
        }).then((r) => {
          this.errors = []
          this.$router.push({ path: '/' })
        }).catch((e) => {
          this.errors = []
          this.errors.push('خطأ في البريد الالكتروني او كلمة السر')
        })
      }
    },
    logout () {
      this.$auth.logout()
    }
  }
}
</script>

<style scoped>

</style>
