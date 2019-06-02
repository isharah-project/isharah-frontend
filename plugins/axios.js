export default function ({ $axios, app, store }) {
  let headers = ['uid', 'access-token', 'client', 'expiry', 'token-type']
  $axios.onRequest((config) => {
    // get token from custom key in auth storage
    let authHeaders = app.$auth.$storage.getUniversal('fullToken')
    if (authHeaders) {
      let parsedAuthHeaders = JSON.parse(authHeaders)
      headers.forEach((header) => {
        config.headers[header] = parsedAuthHeaders[header]
      })
    }
  })

  $axios.onResponse((config) => {
    let authHeaders = {}
    headers.forEach((header) => {
      authHeaders[header] = config.headers[header]
    })
    let oldAuthHeaders = app.$auth.$storage.getUniversal('fullToken')
    let newerToken = true
    if (oldAuthHeaders && Number(authHeaders.expiry) <= Number(oldAuthHeaders.expiry)) {
      newerToken = false
    }
    if (Object.keys(authHeaders).length >= 4 && newerToken) {
      // set token in the custom key in $auth storage & manually set token
      // in the default key as user is logged in now, this is needed for
      // $auth to keep user logged in in case of a refresh
      app.$auth.$storage.setUniversal('fullToken', JSON.stringify(authHeaders))
      app.$auth.setToken(app.$auth.$state.strategy, JSON.stringify(authHeaders))
    }
    if (config.request.responseURL.includes('validate_token') ||
      config.request.responseURL.includes('sign_in')) {
      let userData = store.state.deserialize(config.data)
      store.commit('setUser', userData)
    }
    if (config.request.responseURL.includes('sign_out')) {
      app.$auth.$storage.setUniversal('fullToken', false)
    }
  })
}
