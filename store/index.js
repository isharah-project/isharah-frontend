import { deserialize } from 'jsonapi-deserializer'

export const state = () => ({
  user: null,
  deserialize
})

export const mutations = {
  setUser (state, user) {
    state.user = user
  },
  clearUser (state) {
    this.$auth.logout()
    this.$router.push({ path: '/' })
    state.user = null
  }
}
