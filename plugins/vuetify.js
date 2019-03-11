import Vue from 'vue'
import Vuetify from 'vuetify'
import { i18n } from '~/plugins/vue-i18n'
import 'vuetify/src/stylus/main.styl'

Vue.use(Vuetify, {
  rtl: true,
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})
