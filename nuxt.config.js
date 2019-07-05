import MomentLocalesPlugin from 'moment-locales-webpack-plugin'
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
// const pkg = require('./package')
require('dotenv').config({ path: './.env' })

module.exports = {
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    FRONTEND_URL: process.env.FRONTEND_URL
  },
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: 'إشارة',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#2196F3' },
      { hid: 'title', name: 'title', content: 'إشارة' },
      { hid: 'description', name: 'description', content: 'قاموس لغة الإشارة مفتوحة المصدر للمتعلمين والباحثين' },
      { hid: 'og:title', name: 'og:title', content: 'إشارة' },
      { hid: 'og:description', name: 'og:description', content: 'قاموس لغة الإشارة مفتوحة المصدر للمتعلمين والباحثين' },
      { hid: 'og:image', name: 'og:image', property: 'og:image', content: 'https://isharah.com/meta-image.jpg' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'إشارة' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'قاموس لغة الإشارة مفتوحة المصدر للمتعلمين والباحثين' },
      { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: 'https://isharah.com/meta-image.jpg' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'mask-icon', color: '#2196F3', href: '/safari-pinned-tab.svg' },
      {
        rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons'
      },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Cairo:400,700' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: false,

  /*
  ** Global CSS
  */
  css: [
    // 'vuetify/src/stylus/app.styl',
    '~/assets/styles/main.styl',
    '~/assets/styles/main.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/vuetify',
    '~/plugins/vue-i18n',
    '~/plugins/mixin'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/auth'
  ],
  /*
  ** Router module
   */
  router: {
    middleware: 'routes'
  },
  /*
  ** Auth module
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/sign_in/', method: 'post', propertyName: 'auth.data' },
          logout: { url: '/auth/sign_out/', method: 'delete' },
          user: { url: '/auth/validate_token/', method: 'get' }
        }
      }
    }
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_ENDPOINT
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    plugins: [
      new MomentLocalesPlugin({
        // whitelist app locales
        localesToKeep: ['ar']
      }),
      new VuetifyLoaderPlugin()
    ],
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
      svgRule.test = /\.(png|jpe?g|gif|webp)$/
      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader'
      })
    },
    loaders: [
      {
        test: /\.styl$/,
        loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
}
