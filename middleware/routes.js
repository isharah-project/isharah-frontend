export default function ({ store, route, redirect }) {
  if (route.name === 'profile' && !store.state.user) {
    redirect('/')
  }
  if (route.name === 'login' && store.state.user) {
    redirect('/')
  }
  if (route.name === 'contribute-practice' && !store.state.user) {
    redirect('/login')
  }
  if (route.name === 'contribute-add_gesture' && !store.state.user) {
    redirect('/login')
  }
  if (route.name === 'contribute-review' && !isUser(store.state.user, ['Admin', 'Reviewer'])) {
    redirect('/')
  }
}

function isUser (user, types) {
  return user && types.some(type => type === user.type)
}
