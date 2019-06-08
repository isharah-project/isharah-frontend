<template>
  <v-app id="app" light>
    <v-navigation-drawer v-model="navigationDrawer.isOpened" right disable-route-watcher disable-resize-watcher app>
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="font-weight-bold">
              إشارة
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list dense class="pt-0">
        <template v-for="link in shownNavDrawerLinks">
          <nuxt-link
            is="v-list-tile"
            v-if="!link.children"
            :key="link.path"
            :to="link.path"
            class="grey-text"
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
              class="grey-text"
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
      <nuxt-link to="/" class="font-weight-bold ml-5 mr-2 logo grey-text">
        إشارة
      </nuxt-link>
      <!--<v-toolbar-title class="font-weight-bold headline ml-5">-->
      <!--إشارة-->
      <!--</v-toolbar-title>-->
      <v-toolbar-items class="hidden-sm-and-down">
        <template v-for="link in shownToolbarLinks">
          <nuxt-link
            is="v-btn"
            v-if="!link.children"
            :key="link.path"
            :to="link.path"
            active-class="toolbar-btn-active"
            class="grey-text toolbar-btn"
            flat
          >
            {{ link.text }}
          </nuxt-link>
          <v-menu v-else :key="link.path" offset-y open-on-hover>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                :class="{ 'toolbar-btn-active': chickChildrenPathsMatch(link) }"
                class="grey-text"
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
                <nuxt-link is="v-btn" class="ma-0 grey-text small-round-corners" :to="child.path" flat>
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
        v-if="!isLoggedIn"
        class="toolbar-btn blue-border-btn"
        :ripple="false"
        active-class="login-btn-active"
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
              round
              v-on="on"
            >
              {{ userName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-tile>
              <nuxt-link is="v-btn" to="/profile" flat round>
                الصفحة الشخصية
              </nuxt-link>
            </v-list-tile>
            <v-list-tile>
              <v-btn flat round @click="logout()">
                تسجيل الخروج
              </v-btn>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
    <v-snackbar
      v-model="snackbarState"
      :color="$store.state.snackbar.color"
      :timeout="4500"
      top
      left
    >
      <span>
        {{ $store.state.snackbar.message }}
        <v-btn flat @click="snackbarState = false">إغلاق</v-btn>
      </span>
    </v-snackbar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer class="app-footer white grey-text py-3" height="">
      <ul class=" mx-auto pl-0 pb-3">
        <li class="mx-2">
          <nuxt-link to="/privacy-policy" class="grey-text">
            سياسة الخصوصية
          </nuxt-link>
        </li>
        <li class="mx-2">
          <nuxt-link to="/terms-and-conditions" class="grey-text">
            الشروط والأحكام
          </nuxt-link>
        </li>
        <li class="mx-2">
          <nuxt-link to="/contact_us" class="grey-text">
            تواصل معنا
          </nuxt-link>
        </li>
      </ul>
      <p class="mb-2 grey--text text--darken-1">
        جميع الحقوق محفوظة  &copy; لموقع إشارة
      </p>
      <p class="mb-0 grey--text text--darken-1">
        صنع بكل
        <v-icon class="heart red-text">
          favorite
        </v-icon>
        بواسطة فريق إشارة
      </p>
    </v-footer>
  </v-app>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      navigationDrawer: {
        isOpened: false
      }
    }
  },
  computed: {
    links () {
      return [
        { path: '/dictionary?page=1', text: 'القاموس', icon: 'library_books' },
        { path: '/contribute/practice', text: 'تدرب على إشارة', icon: 'videocam' },
        { path: '/contribute/add_gesture', text: 'أضف إشارة', icon: 'videocam' },
        { path: '/contribute/review', text: 'قيّم الإشارات', icon: 'rate_review', hidden: !this.isUser(['Admin', 'Reviewer']) },
        // { path: '/contribute', text: 'شارك معنا', icon: 'accessibility' },
        // { path: '/contact_us', text: 'تواصل معنا', icon: 'contact_mail' },
        { path: '/for_developers', text: 'للمطورين', icon: 'code' }
      ]
    },
    snackbarState: {
      get: function () {
        return this.$store.state.snackbar.state
      },
      set: function (state) {
        this.$store.commit('setSnackBarState', { open: state })
      }
    },
    userName () {
      if (this.$store.state.user) {
        return `${this.$store.state.user.first_name} ${this.$store.state.user.last_name}`
      } else {
        return ''
      }
    },
    shownToolbarLinks () {
      let links = _.cloneDeep(this.links)
      return links.filter((link) => {
        if (link.hidden) return false
        if (link.children) {
          link.children = link.children.filter((child) => {
            return !child.hidden
          })
        }
        return true
      })
    },
    shownNavDrawerLinks () {
      return this.shownToolbarLinks.concat([
        { path: '/privacy-policy', text: 'سياسة الخصوصية', icon: 'assignment' },
        { path: '/terms-and-conditions', text: 'الشروط والأحكام', icon: 'assignment_turned_in' },
        { path: '/contact_us', text: 'تواصل معنا', icon: 'contact_mail' }
      ])
    }
  },
  methods: {
    logout () {
      this.$store.commit('logout')
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
.toolbar-btn {
  transition: none;
}
.toolbar-btn-active {
  border-bottom: solid 2px $blue;
  font-weight: bold;
}
.login-btn-active {
  font-weight: bold;
}
.logo {
  font-size: 30px;
  text-decoration: none;
}
.app-footer {
  flex-direction: column;
  box-shadow: 0 -3px 46px rgba(0, 0, 0, 0.03);
}
.app-footer ul li {
  display: inline-block;
}
.app-footer ul li a {
  text-decoration: none;
}
.app-footer .heart {
  animation: heart-beat infinite 1.5s;
}

@keyframes heart-beat {
  0% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.15);
  }
  25% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
</style>
