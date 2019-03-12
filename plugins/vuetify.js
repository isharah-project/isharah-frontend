import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/src/stylus/main.styl'
import { i18n } from '~/plugins/vue-i18n'

Vue.use(Vuetify, {
  rtl: true,
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  },
  theme: {
    primary: '#2196F3'
  }
})
