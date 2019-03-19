
<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap class="justify-center pt-4">
      <v-flex xs12 sm6 md4 >
        <v-card v-bind:class="{ [`elevation-${8}`]: true }" class="py-4" >
          <v-card-text v-if="signin">تسجيل الدخول</v-card-text>
          <v-card-text v-else>إنشاء حساب</v-card-text>
          <v-form class="mx-5" v-if="signin" @submit.prevent = "login" ref="loginForm">
            <v-text-field label="البريد الالكتروني" v-model="email" :rules="emailRules"></v-text-field>
            <v-text-field label="كلمة السر" type="password" v-model="password" :rules="textRules"></v-text-field>
            <v-btn
              :ripple="false"
              dark
              flat
              round
              class="blue-cyan-gradient fixed-size-btn"
              type="submit"
              v-if="signin"
            >
              دخول
            </v-btn>
          </v-form>
          <v-form class="mx-5" lazy-validation v-else @submit.prevent = "register" ref="signupForm">
            <v-text-field label="البريد الالكتروني" v-model="email" :rules="emailRules"></v-text-field>
            <v-text-field
              label="كلمة السر"
              type="password"
              v-model="password"
              :rules="textRules"></v-text-field>
            <v-text-field
              label="تأكيد كلمة السر"
              type="password"
              v-model="password_confirmation"
              :error-messages=" this.password_confirmation !== null && this.password !== null && this.password === this.password_confirmation ? [] : ['كلمة السر و تأكيد كلمة السر غير متطابقين']"
              :rules="textRules"></v-text-field>
            <v-text-field label = "الأسم الأول" v-model="first_name" :rules="textRules" ></v-text-field>
            <v-text-field label = "الأسم الأخير" v-model="last_name" :rules="textRules" ></v-text-field>
            <v-select label = "النوع"  :items= "gender_list" :rules="textRules"></v-select>
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
                  v-on="on"
                  :rules="textRules"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="date_of_birth"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save"
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
          </v-form>
          <v-card-text v-if="signin">
            ليس لديك حساب؟
            <v-btn @click="signup" flat class="blue--text">
            إنشاء حساب
            </v-btn>
          </v-card-text>
          <v-btn color="#3b5998" dark round>
            تسجيل الدخول عن طريق فيسبوك
            <v-icon light left>$vuetify.icons.facebook</v-icon>
          </v-btn>
          <v-btn color="#D44638" dark round>
            تسجيل الدخول عن طريق جوجل
            <v-icon light left>$vuetify.icons.gmail</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      signin: true,
      emailRules: [
        v => !!v || 'الايميل مطلوب',
        v => /.+@.+..+./.test(v) || 'يجب ان يكون الايميل بالشكل الصحيح'
      ],
      textRules: [
        v => !!v || 'الخانة مطلوبة'
      ],
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
      menu: false
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date)
    },
    signup () {
      this.signin = false
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
          // yro7 page y2olo eno y-check elemail w y-confirm
        }).catch((e) => {
          console.log(e)
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
        }).then(
          this.$router.push({ path: process.env.FRONTEND_URL + '/' })
        )
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
