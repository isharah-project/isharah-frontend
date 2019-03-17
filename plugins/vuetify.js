import Vue from 'vue'
import Vuetify from 'vuetify'
import { i18n } from '~/plugins/vue-i18n'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify, {
  rtl: true,
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  },
  theme: {
    primary: '#2196F3'
  },
  icons: {
    'facebook': 'fab fa-facebook',
    'gmail': 'fab fa-google'
  }
})
