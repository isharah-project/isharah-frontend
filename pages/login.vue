<template>
  <v-layout column align-center wrap class="py-4 mt-4">
    <v-card class="py-4 light-box-shadow text-xs-center login-card small-round-corners">
      <v-card-text v-if="state === 'email-confirmation'">
        تم ارسال رسالة على البريد الالكتروني لتأكيد حسابك
        <v-btn class="blue-gradient btn-shadow mt-3" round dark @click="state = 'signin'">
          الرجوع
        </v-btn>
      </v-card-text>
      <div v-else>
        <Loader :active="loading">
          <v-card-text>
            <h2>
              {{ headerText }}
            </h2>
          </v-card-text>
          <v-card-text class="subheading d-block pt-0">
            سجل الدخول الآن لتستطيع مشاركة فيديوهاتك ومساعدة المتعلمين والباحثين بلغة الإشارة المصرية.
          </v-card-text>
          <v-btn flat round class="btn-shadow" @click="loginWithFacebook">
            تسجيل الدخول عن طريق فيسبوك
            <FBLogo />
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
            <GoogleLogo />
          </v-btn>
          <v-card-text>
            بالاستمرار فإنك تقر بأنك قرأت و وافقت على
            <br />
            <nuxt-link to="/privacy-policy">
              سياسة الخصوصية
            </nuxt-link> و
            <nuxt-link to="/terms-and-conditions">
              الشروط واﻷحكام
            </nuxt-link>
          </v-card-text>
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
                  :rules="[...generalValidationRules.required, ...validationRules.passwordLength]"
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
                      label="الاسم الأول"
                      validate-on-blur
                      :rules="generalValidationRules.required"
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="user.last_name"
                      label="الاسم الأخير"
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
                      :rules="[
                        ...generalValidationRules.required,
                        ...validationRules.passwordLength,
                        ...validationRules.passwordStrength
                      ]"
                    />
                  </v-flex>
                  <v-flex>
                    <v-combobox
                      v-model="user.city"
                      label="المحافظة"
                      :items="egyptGovernorates"
                      validate-on-blur
                      :rules="generalValidationRules.required"
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
                          v-model="arabicDOB"
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
        </Loader>
      </div>
    </v-card>
  </v-layout>
</template>

<script>
import Loader from '~/components/generic/Loader'
import moment from 'moment'
import FBLogo from '~/assets/images/fb-logo.svg'
import GoogleLogo from '~/assets/images/google-logo.svg'

export default {
  components: {
    Loader,
    FBLogo,
    GoogleLogo
  },
  data () {
    return {
      loading: false,
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
      return {
        passwordLength: [
          v => (v && v.length >= 8) || 'الحد الادني لكلمة السر 8 خانات'
        ],
        passwordStrength: [
          v => /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*()-=_+.?]+)$/.test(v) ||
            'كلمة السر يجب أن تحتوي على أحرف و أرقام'
        ]
      }
    },
    arabicDOB: {
      get () {
        if (this.user.date_of_birth) {
          return moment(this.user.date_of_birth).locale('ar').format('Do MMMM YYYY')
        }
        return ''
      },
      set () {
        // left black on purpose
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
    this.checkAuthQueryParams()
  },
  methods: {
    saveDate (date) {
      this.$refs.menu.save(date)
    },
    minAge () {
      let maxYear = moment().subtract(18, 'years')
      return moment(maxYear).format('YYYY-MM-DD')
    },
    changeState (state) {
      this.errors = []
      this.state = state
      if (state === 'signup') {
        this.$refs.loginForm.reset()
      } else if (state === 'signin') {
        this.$refs.signupForm.reset()
      }
    },
    register () {
      if (this.$refs.signupForm.validate()) {
        this.loading = true
        this.$axios.$post('auth',
          {
            'email': this.user.email,
            'password': this.user.password,
            'first_name': this.user.first_name,
            'last_name': this.user.last_name,
            'city': this.user.city,
            'country': 'مصر',
            'date_of_birth': this.user.date_of_birth,
            'confirm_success_url': process.env.FRONTEND_URL + '/login'
          })
          .then(() => {
            this.errors = []
            this.changeState('email-confirmation')
          })
          .catch((e) => {
            this.errors = []
            this.errors.push(...e.response.data.errors.full_messages)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    login () {
      if (this.$refs.loginForm.validate()) {
        this.loading = true
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
        }).finally(() => {
          this.loading = false
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
    checkAuthQueryParams () {
      let query = this.$route.query
      if ((query.auth_token || query['access-token']) && query.uid && query.client_id && query.expiry) {
        let authHeaders = {
          'access-token': query.auth_token || query['access-token'],
          'uid': query.uid,
          'client': query.client_id,
          'expiry': query.expiry,
          'token-type': 'Bearer'
        }
        // set token in the custom key in $auth storage & manually set token
        // in the default key as user is logged in now, this is needed for
        // $auth to keep user logged in in case of a refresh
        this.$auth.$storage.setUniversal('fullToken', JSON.stringify(authHeaders))
        this.$auth.setToken(this.$auth.$state.strategy, JSON.stringify(authHeaders))
        this.$axios.get('/auth/validate_token')
          .then(() => {
            this.$router.push('/')
          })
          .catch(() => {
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
.login-card {
  width: 400px;
}
.or-divider {
  position: absolute;
  right: 50%;
  top: 307px;
  transform: translateX(50%);
  background: #fff;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 26px;
  border-radius: 50%;
  /*border: 1px solid rgba(0,0,0,0.12);*/
}
a {
  text-decoration: none;
}

@media screen and (max-width: 400px) {
  .login-card {
    width: 90%;
  }
}
</style>
