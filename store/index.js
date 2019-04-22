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
  changeSnackBarState (state, snackBarState) {
    state.snackbar.state = snackBarState
  }
}
