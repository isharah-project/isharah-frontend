export default function ({ $axios, app, store }) {
  let headers = ['uid', 'access-token', 'client', 'expiry', 'token-type']
  $axios.onRequest((config) => {
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
      app.$auth.$storage.setUniversal('fullToken', JSON.stringify(authHeaders))
    }
    if (config.request.responseURL.includes('validate_token') ||
      config.request.responseURL.includes('login')) {
      let userData = store.state.deserialize(config.data)
      store.commit('setUser', userData)
    }
  })
}
