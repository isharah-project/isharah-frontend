
<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap class="justify-center pt-4">
      <v-flex xs12 sm6 md4 >
        <v-card v-bind:class="{ [`elevation-${8}`]: true }" class="py-4" >
          <v-card-text v-if="signin">تسجيل الدخول</v-card-text>
          <v-card-text v-else>إنشاء حساب</v-card-text>
          <v-form class="mx-5">
            <v-text-field required label="البريد الالكتروني" :rules="emailRules"></v-text-field>
            <v-text-field required label="كلمة السر" type="password" :rules="textRules"></v-text-field>
            <v-text-field required label = "تأكيد كلمة السر" :rules="textRules" v-if="!signin" type = "password"></v-text-field>
            <v-text-field label = "اسم المستخدم" :rules="textRules" v-if="!signin"></v-text-field>
            <v-text-field label = "رقم التليفون" v-if="!signin" type= "number"></v-text-field>
            <v-text-field label = "تاريخ الميلاد" v-if="!signin" type = "date" value = "2000-12-30"></v-text-field>
          </v-form>
          <v-btn
            :ripple="false"
            dark
            flat
            round
            class="blue-cyan-gradient fixed-size-btn"
            @click="login"
            v-if="signin"
          >
            دخول
          </v-btn>
          <v-btn
            :ripple="false"
            dark
            flat
            round
            class="blue-cyan-gradient fixed-size-btn"
            @click="register"
            v-else
          >
            انشاء
          </v-btn>
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
    <!-- <v-btn @click="register">
      Register
    </v-btn>
    <v-btn
      :ripple="false"
      dark
      flat
      round
      class="blue-cyan-gradient"
      @click="login"
    >
      Login
    </v-btn>
    <v-btn
      :ripple="false"
      dark
      flat
      round
      class="red-gradient fixed-size-btn"
      @click="logout"
    >
      Logout
    </v-btn> -->
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
      ]
    }
  },
  methods: {
    signup () {
      this.signin = false
    },
    register () {
      this.$axios.$post('auth', {
        'email': 'tarek.alqaddy@gmail.com',
        'password': 'password',
        'password_confirmation': 'password',
        'first_name': 'youssef',
        'last_name': 'fares',
        'gender': 'male',
        'city': 'Cairo',
        'country': 'Egypt',
        'date_of_birth': '20/03/1996',
        'confirm_success_url': '/'
      }).then((r) => {
        console.log(r)
      }).catch((e) => {
        console.log(e)
      })
    },
    login () {
      this.$auth.loginWith('local', {
        data: {
          email: 'youssefares@egsl.com',
          password: 'password'
        }
      })
    },
    logout () {
      this.$auth.logout()
    }
  }
}
</script>

<style scoped>

</style>
