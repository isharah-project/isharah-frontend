import { deserialize } from 'jsonapi-deserializer'

export const state = () => ({
  user: null,
  deserialize,
  snackbar: {
    state: false,
    message: '',
    color: ''
  }
})

export const mutations = {
  setUser (state, user) {
    state.user = user
  },
  logout (state) {
    this.$auth.logout()
    this.$router.push({ path: '/' })
    state.user = null
  },
  setSnackBarState (state, { open }) {
    state.snackbar.state = open
  },
  // TODO: following 3 methods need to be refactored into 1
  showSuccessMsg (state, { message }) {
    state.snackbar.state = true
    state.snackbar.message = message
    state.snackbar.color = 'green'
  },
  showErrorMsg (state, { message }) {
    state.snackbar.state = true
    state.snackbar.message = message
    state.snackbar.color = 'red'
  },
  showInfoMsg (state, { message }) {
    state.snackbar.state = true
    state.snackbar.message = message
    state.snackbar.color = 'blue'
  }
}

export const actions = {
  fetchUserAndUpdate () {
    return this.$axios.get('auth/validate_token')
  }
}
