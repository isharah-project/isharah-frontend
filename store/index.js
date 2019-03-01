export const state = () => ({
  user: null
})

export const mutations = {
  setUser (state, user) {
    state.user = user
  },
  clearUser (state) {
    state.user = null
  }
}
