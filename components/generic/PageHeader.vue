<template>
  <v-layout :class="mb">
    <v-flex>
      <h1 class="display-1 font-weight-medium d-inline-flex">
        <v-icon class="heading-icon mx-2">
          {{ icon }}
        </v-icon>
        {{ text }}
      </h1>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    mb: {
      type: String,
      required: false,
      default: 'mb-4'
    }
  }
}
</script>

<style scoped>
.heading-icon {
  font-size: inherit;
}
</style>
