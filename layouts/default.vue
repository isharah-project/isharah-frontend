<template>
  <v-app id="app" light>
    <v-navigation-drawer v-model="navigationDrawer.isOpened" right disable-route-watcher app>
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
          <v-list-tile v-if="!link.children" :key="link.path" @click="$router.push(link.path)">
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ link.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
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
            <v-list-tile
              v-for="(child, i) in link.children"
              :key="i"
              @click="$router.push(child.path)"
            >
              <v-list-tile-action>
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>{{ child.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="app-toolbar" color="white" app>
      <v-toolbar-title>
        EgSl
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <template v-for="link in links">
          <v-btn v-if="!link.children" :key="link.path" :href="!link.children ? link.path : ''" flat>
            {{ link.text }}
          </v-btn>
          <v-menu v-else :key="link.path" offset-y open-on-hover>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
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
                <v-btn class="ma-0 pa-0" :href="child.path" flat>
                  {{ child.text }}
                </v-btn>
              </v-list-tile>
            </v-list>
          </v-menu>
        </template>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn :ripple="false" class="blue-border-btn" href="/login" flat round>
        تسجيل الدخول
      </v-btn>
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
        { path: '/dictionary', text: 'القاموس', icon: 'library_books' },
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
