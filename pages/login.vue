<template>
  <div>
    <v-btn @click="register">
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
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
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
