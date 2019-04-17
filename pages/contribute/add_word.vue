<template>
  <v-container>
    <PageHeader icon="videocam" text="أضف كلمة للقاموس" class="mb-0" />
    <VideoUpload
      submitEndPoint="gestures"
      autoCompleteEndPoint="autocomplete/words"
      :autoCompleteItemText="false"
      :autoCompleteDeserializeResults="false"
      :categories="categories"
    />
  </v-container>
</template>

<script>
import PageHeader from '~/components/generic/PageHeader'
import VideoUpload from '~/components/contribute/VideoUpload'

export default {
  components: {
    PageHeader,
    VideoUpload
  },
  data () {
    return {
      categories: []
    }
  },
  async asyncData ({ app, store, $axios }) {
    try {
      let response = (await $axios.get('/categories')).data
      let categories = store.state.deserialize(response)
      return { categories }
    } catch (e) {
      // TODO
      console.log(e)
    }
  }
}
</script>

<style>

</style>
