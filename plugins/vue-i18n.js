import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ar from '~/locales/ar.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'ar',
  messages: {
    ar
  }
})

export default ({ app, store }) => {
  app.i18n = i18n
  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }

    return `/${app.i18n.locale}/${link}`
  }
}
export { i18n }
