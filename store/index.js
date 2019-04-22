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
  setSnackBarValues (state, snackbar) {
    console.log('2')
    state.snackbar.state = snackbar.state
    state.snackbar.message = snackbar.message
    state.snackbar.color = snackbar.color
    console.log('3')
  },
  changeSnackBarState (state, snackBarState) {
    state.snackbar.state = snackBarState
  }
}
