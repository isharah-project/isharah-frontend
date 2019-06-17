<template>
  <ContentLoader rtl primaryColor="white">
    <rect
      x="0"
      y="0"
      rx="20"
      ry="20"
      width="100%"
      height="80"
    />
  </ContentLoader>
  <!-- <v-layout row wrap class="white light-box-shadow small-round-corners pa-2 mt-4">
    <ContentLoader>
      <rect x="0" y="0" width="250" height="10" />
      <rect x="20" y="20" width="220" height="10" />
      <rect x="20" y="40" width="170" height="10" />
      <rect x="0" y="60" width="250" height="10" />
      <rect x="20" y="80" width="200" height="10" />
      <rect x="20" y="100" width="80" height="10" />
    </ContentLoader>
  </v-layout> -->
</template>
<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  components: { ContentLoader }
}
</script>
