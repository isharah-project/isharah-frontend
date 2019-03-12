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

    <v-toolbar class="elevation-0" color="white" app>
      <v-toolbar-title>
        EgSl
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="link in links" :key="link.path" :href="link.path" flat>
          {{ link.text }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn class="blue-border" flat round>
        تسجيل الدخول
      </v-btn>
    </v-toolbar>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      navigationDrawer: {
        isOpened: false
      },
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
</style>
