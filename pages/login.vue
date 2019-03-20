
<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap class="justify-center pt-4">
      <v-flex xs12 sm6 md5 lg4>
        <v-card class="py-4 light-box-shadow">
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
              <v-text-field v-model="email" label="البريد الالكتروني" :rules="validationRules.emailRules"></v-text-field>
              <v-text-field v-model="password" label="كلمة السر" type="password" :rules="validationRules.required"></v-text-field>
              <div class="red--text" v-for="error in errors" :key="error">{{ error }}</div>
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
              <v-text-field v-model="email" label="البريد الالكتروني" :rules="validationRules.emailRules"></v-text-field>
              <v-text-field
                v-model="password"
                label="كلمة السر"
                type="password"
                :rules="validationRules.required"
              ></v-text-field>
              <v-text-field
                v-model="password_confirmation"
                label="تأكيد كلمة السر"
                type="password"
                :error-messages="validationRules.passwordCheck()"
                :rules="validationRules.required"
              ></v-text-field>
              <v-text-field v-model="first_name" label="الأسم الأول" :rules="validationRules.required"></v-text-field>
              <v-text-field v-model="last_name" label="الأسم الأخير" :rules="validationRules.required"></v-text-field>
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
                    v-model="date_of_birth"
                    label="تاريخ الميلاد"
                    prepend-icon="event"
                    readonly
                    :rules="validationRules.required"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="date_of_birth"
                  :max="new Date().toISOString().substr(0, 10)"
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
              <div class="red--text" v-for="error in errors" :key="error">{{ error }}</div>
            </v-form>
            <v-card-text v-if="state === 'signin'">
              ليس لديك حساب؟
              <v-btn flat class="blue--text" @click="changeState('signup')">
                إنشاء حساب
              </v-btn>
            </v-card-text>
            <v-btn color="#3b5998" dark round>
              تسجيل الدخول عن طريق فيسبوك
              <v-icon light left>
                {{ $vuetify.icons.facebook }}
              </v-icon>
            </v-btn>
            <v-btn color="#D44638" dark round>
              تسجيل الدخول عن طريق جوجل
              <v-icon light left>
                {{ $vuetify.icons.gmail }}
              </v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      state: 'signin',
      email: '',
      password: '',
      password_confirmation: '',
      first_name: '',
      last_name: '',
      gender: '',
      city: '',
      country: '',
      date_of_birth: '',
      gender_list: ['ذكر', 'انثى'],
      date: null,
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
          v => /.+@.+..+./.test(v) || 'يجب ان يكون البريد الالكتروني بالشكل الصحيح'
        ],
        required: [
          v => !!v || 'الخانة مطلوبة'
        ],
        passwordCheck () {
          if (self.password === '' || self.password_confirmation === '') {
            return []
          }
          if (self.password_confirmation && self.password && self.password === self.password_confirmation) {
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
    changeState (page) {
      this.state = page
    },
    genderSelect () {
      if (this.gender === 'ذكر') {
        return 'male'
      }
      return 'female'
    },
    register () {
      if (this.$refs.signupForm.validate()) {
        this.$axios.$post('auth', {
          'email': this.email,
          'password': this.password,
          'password_confirmation': this.password,
          'first_name': this.first_name,
          'last_name': this.last_name,
          'gender': this.genderSelect(),
          'city': 'Cairo',
          'country': 'Egypt',
          'date_of_birth': this.date_of_birth,
          'confirm_success_url': process.env.FRONTEND_URL + '/login'
        }).then((r) => {
          this.changeState('email-confirmation')
        }).catch((e) => {
          console.log(e.response)
          this.errors = []
          this.errors.push(...e.response.data.errors.full_messages)
        })
      }
    },
    login () {
      if (this.$refs.loginForm.validate()) {
        this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        }).then((r) => {
          this.$router.push({ path: '/' })
        }).catch((e) => {
          this.errors = []
          this.errors.push(...e.response.data.errors)
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
