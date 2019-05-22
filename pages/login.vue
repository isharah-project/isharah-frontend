<template>
  <v-layout row wrap class="justify-center pt-4">
    <v-card class="py-4 light-box-shadow text-xs-center card-size small-round-corners">
      <v-card-text v-if="state === 'email-confirmation'">
        تم ارسال رسالة على البريد الالكتروني لتأكيد حسابك
      </v-card-text>
      <div v-else>
        <v-card-text>
          <h2>
            {{ headerText }}
          </h2>
        </v-card-text>
        <v-btn flat round class="btn-shadow" @click="loginWithFacebook">
          تسجيل الدخول عن طريق فيسبوك
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 0 30 30" width="30px" height="25px">
            <path style="fill:#3b5998" d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h10v-9h-3v-3h3v-1.611C16,9.339,17.486,8,20.021,8 c1.214,0,1.856,0.09,2.16,0.131V11h-1.729C19.376,11,19,11.568,19,12.718V14h3.154l-0.428,3H19v9h5c1.105,0,2-0.895,2-2V6 C26,4.895,25.104,4,24,4z" />
          </svg>
        </v-btn>
        <v-btn
          color="#000000"
          dark
          flat
          round
          class="btn-shadow"
          @click="loginWithGoogle"
        >
          تسجيل الدخول عن طريق جوجل
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="5 0 48 48"
            version="1.1"
            width="35px"
            height="25px"
          >
            <g id="surface1">
              <path style=" fill:#FFC107;" d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 33.652344 32.65625 29.222656 36 24 36 C 17.371094 36 12 30.628906 12 24 C 12 17.371094 17.371094 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 12.953125 4 4 12.953125 4 24 C 4 35.046875 12.953125 44 24 44 C 35.046875 44 44 35.046875 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z " />
              <path style=" fill:#FF3D00;" d="M 6.304688 14.691406 L 12.878906 19.511719 C 14.65625 15.109375 18.960938 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 16.316406 4 9.65625 8.335938 6.304688 14.691406 Z " />
              <path style=" fill:#4CAF50;" d="M 24 44 C 29.164063 44 33.859375 42.023438 37.410156 38.808594 L 31.21875 33.570313 C 29.210938 35.089844 26.714844 36 24 36 C 18.796875 36 14.382813 32.683594 12.71875 28.054688 L 6.195313 33.078125 C 9.503906 39.554688 16.226563 44 24 44 Z " />
              <path style=" fill:#1976D2;" d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 34.511719 30.238281 33.070313 32.164063 31.214844 33.570313 C 31.21875 33.570313 31.21875 33.570313 31.21875 33.570313 L 37.410156 38.808594 C 36.972656 39.203125 44 34 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z " />
            </g>
          </svg>
        </v-btn>
        <v-divider class="mb-3 mt-4" />
        <div class="or-divider">
          أو
        </div>
        <transition name="slide-fade" mode="out-in">
          <div v-if="state === 'signin'" key="3">
            <v-form ref="loginForm" class="mx-5" @submit.prevent="login">
              <v-text-field
                v-model="user.email"
                label="البريد الالكتروني"
                type="email"
                validate-on-blur
                :rules="[...generalValidationRules.required, ...generalValidationRules.email]"
              >
              </v-text-field>
              <v-text-field
                v-model="user.password"
                label="كلمة السر"
                type="password"
                validate-on-blur
                :rules="[...generalValidationRules.required, validationRules.passwordLengthCheck]"
              >
              </v-text-field>
              <div v-for="error in errors" :key="error" class="red--text">
                {{ error }}
              </div>
              <v-btn
                :ripple="false"
                dark
                flat
                round
                class="blue-cyan-gradient fixed-size-btn btn-shadow"
                type="submit"
              >
                دخول
              </v-btn>
            </v-form>
            <v-card-text>
              ليس لديك حساب؟
              <v-btn flat round class="blue--text" @click="changeState('signup')">
                إنشاء حساب
              </v-btn>
            </v-card-text>
          </div>
          <div v-if="state === 'signup'" key="4">
            <v-form ref="signupForm" class="mx-5" @submit.prevent="register">
              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field
                    v-model="user.first_name"
                    label="الأسم الأول"
                    validate-on-blur
                    :rules="generalValidationRules.required"
                  />
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-model="user.last_name"
                    label="الأسم الأخير"
                    validate-on-blur
                    :rules="generalValidationRules.required"
                  />
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="user.email"
                    label="البريد الالكتروني"
                    type="email"
                    validate-on-blur
                    :rules="[...generalValidationRules.required, ...generalValidationRules.email]"
                  />
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="user.password"
                    label="كلمة السر"
                    type="password"
                    validate-on-blur
                    :rules="[...generalValidationRules.required, validationRules.passwordLengthCheck]"
                  />
                </v-flex>
                <v-flex>
                  <v-combobox
                    v-model="user.city"
                    label="المحافظة"
                    :items="egyptGovernorate"
                    validate-on-blur
                    :rules="[...generalValidationRules.required, validationRules.cityCheck]"
                  />
                </v-flex>
                <v-flex>
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
                        validate-on-blur
                        :rules="generalValidationRules.required"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="user.date_of_birth"
                      :max="minAge()"
                      min="1950-01-01"
                      locale="ar-EG"
                      @change="saveDate"
                    />
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-btn
                :ripple="false"
                dark
                flat
                round
                class="blue-cyan-gradient fixed-size-btn btn-shadow"
                type="submit"
              >
                إنشاء
              </v-btn>
              <div v-for="error in errors" :key="error" class="red--text">
                - {{ error }}
              </div>
            </v-form>
            <v-card-text>
              لديك حساب؟
              <v-btn flat round class="blue--text" @click="changeState('signin')">
                تسجيل الدخول
              </v-btn>
            </v-card-text>
          </div>
        </transition>
      </div>
    </v-card>
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      state: 'signin',
      user: {
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        city: '',
        date_of_birth: ''
      },
      date: null,
      today: new Date().toISOString(),
      maxYear: 0,
      errors: [],
      menu: false
    }
  },
  computed: {
    headerText () {
      if (this.state === 'signin') {
        return 'تسجيل الدخول'
      } else if (this.state === 'signup') {
        return 'إنشاء حساب'
      }
      return ''
    },
    validationRules () {
      let self = this
      return {
        cityCheck (value) {
          if (self.egyptGovernorate.includes(value)) {
            return true
          }
          return `"${value}" ليست ضمن المحافظات`
        },
        passwordLengthCheck (value) {
          if (value && value.length < 8) {
            return 'الحد الادني لكلمة السر 8 خانات'
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
  created () {
    window.facebookLoginCB = this.facebookLogin
    this.checkFacebookLoginQueryParams()
  },
  methods: {
    saveDate (date) {
      this.$refs.menu.save(date)
    },
    minAge () {
      this.maxYear = moment().subtract(18, 'years').calendar()
      return moment(this.maxYear).format('YYYY-MM-DD')
    },
    changeState (page) {
      this.errors = []
      this.state = page
      if (page === 'signup') {
        this.$refs.loginForm.reset()
      } else if (page === 'signin') {
        this.$refs.signupForm.reset()
      }
    },
    register () {
      if (this.$refs.signupForm.validate()) {
        this.$axios.$post('auth', {
          'email': this.user.email,
          'password': this.user.password,
          'first_name': this.user.first_name,
          'last_name': this.user.last_name,
          'city': this.user.city,
          'date_of_birth': this.user.date_of_birth,
          'confirm_success_url': process.env.FRONTEND_URL + '/login'
        }).then(() => {
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
        }).then(() => {
          this.errors = []
          this.$router.push({ path: '/' })
        }).catch(() => {
          this.errors = []
          this.errors.push('خطأ في البريد الالكتروني او كلمة السر')
        })
      }
    },
    loginWithFacebook () {
      let redirectUrl = `${this.API_ENDPOINT}/auth/facebook?auth_origin_url=${this.FRONTEND_URL}/login`
      window.location.assign(redirectUrl)
    },
    loginWithGoogle () {
      let redirectUrl = `${this.API_ENDPOINT}/auth/google_oauth2?auth_origin_url=${this.FRONTEND_URL}/login`
      window.location.assign(redirectUrl)
    },
    checkFacebookLoginQueryParams () {
      let query = this.$route.query
      if (query.auth_token && query.uid && query.client_id && query.expiry) {
        let authHeaders = {
          'access-token': query.auth_token,
          'uid': query.uid,
          'client': query.client_id,
          'expiry': query.expiry,
          'token-type': 'Bearer'
        }
        this.$auth.$storage.setUniversal('fullToken', JSON.stringify(authHeaders))
        this.$axios.get('/auth/validate_token').then(() => {
          this.$router.push('/')
        }).catch(() => {
          this.$store.commit('showErrorMsg', {
            message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
          })
        })
      }
    }
  }
}
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.or-divider {
  position: absolute;
  right: 50%;
  top: 195px;
  transform: translateX(50%);
  background: #fff;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 26px;
  border-radius: 50%;
  /*border: 1px solid rgba(0,0,0,0.12);*/
}
</style>
