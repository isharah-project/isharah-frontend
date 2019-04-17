<template>
  <v-app id="app" light>
    <v-navigation-drawer v-model="navigationDrawer.isOpened" right disable-route-watcher disable-resize-watcher app>
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              EgSl
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list dense class="pt-0">
        <template v-for="link in links">
          <nuxt-link
            is="v-list-tile"
            v-if="!link.children"
            :key="link.path"
            :to="link.path"
            @click="setNavDrawer(false)"
          >
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ link.text }}</v-list-tile-title>
            </v-list-tile-content>
          </nuxt-link>
          <v-list-group
            v-else
            :key="link.path"
            prepend-icon="accessibility"
            value="true"
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>{{ link.text }}</v-list-tile-title>
              </v-list-tile>
            </template>
            <nuxt-link
              is="v-list-tile"
              v-for="(child, i) in link.children"
              :key="i"
              :to="child.path"
              @click="setNavDrawer(false)"
            >
              <v-list-tile-action>
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>{{ child.text }}</v-list-tile-title>
            </nuxt-link>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="app-toolbar" color="white" app>
      <v-toolbar-side-icon v-if="$vuetify.breakpoint.smAndDown" @click="setNavDrawer(true)"></v-toolbar-side-icon>
      <v-toolbar-title>
        EgSl
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <template v-for="link in links">
          <nuxt-link
            is="v-btn"
            v-if="!link.children"
            :key="link.path"
            :to="link.path"
            flat
          >
            {{ link.text }}
          </nuxt-link>
          <v-menu v-else :key="link.path" offset-y open-on-hover>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                :class="{ 'v-btn--active': chickChildrenPathsMatch(link) }"
                v-on="on"
              >
                {{ link.text }}
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="(child, i) in link.children"
                :key="i"
              >
                <nuxt-link is="v-btn" class="ma-0 pa-0" :to="child.path" flat>
                  {{ child.text }}
                </nuxt-link>
              </v-list-tile>
            </v-list>
          </v-menu>
        </template>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <nuxt-link
        is="v-btn"
        v-if="!loggedIn"
        :ripple="false"
        :class="{ 'blue-border-btn': $route.path !== '/login' }"
        to="/login"
        flat
        round
      >
        تسجيل الدخول
      </nuxt-link>
      <div v-else class="text-xs-center">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on }">
            <v-btn
              flat
              v-on="on"
            >
              {{ $store.state.user.first_name }} {{ $store.state.user.last_name }}
            </v-btn>
          </template>
          <v-list>
            <v-list-tile>
              <nuxt-link is="v-btn" class="ma-0 pa-2 mx-2" to="/profile" flat>
                الصفحة الشخصية
              </nuxt-link>
            </v-list-tile>
            <v-list-tile>
              <v-btn class="my-0 pa-2 mx-2" flat @click="logout()">
                تسجيل الخروج
              </v-btn>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      navigationDrawer: {
        isOpened: false
      },
      koko: null,
      links: [
        { path: '/', text: 'الرئيسية', icon: 'home' },
        { path: '/dictionary?page=1', text: 'القاموس', icon: 'library_books' },
        { path: '/contribute',
          text: 'شارك معنا',
          icon: 'accessibility',
          children: [
            { path: '/contribute/upload', text: 'ارفع فيديو', icon: 'videocam' },
            { path: '/contribute/review', text: 'قيم الإشارات', icon: 'rate_review' }
          ]
        },
        { path: '/contact_us', text: 'تواصل معنا', icon: 'contact_mail' },
        { path: '/for_developers', text: 'للمطورين', icon: 'code' }
      ]
    }
  },

  computed: {
    loggedIn () {
      return Boolean(this.$store.state.user)
    }
  },
  methods: {
    logout () {
      this.$store.commit('logout', this.$store.state)
    },
    setNavDrawer (value) {
      this.navigationDrawer.isOpened = value
    },
    chickChildrenPathsMatch (link) {
      return link.children.some(child => child.path === this.$route.path)
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/helpers/index.scss";

#app {
  background: $app-grey;
}
.app-toolbar {
  box-shadow: $toolbar-shadow !important;
}
</style>
