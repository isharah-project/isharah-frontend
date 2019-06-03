<template>
  <v-container class="mt-3">
    <PageHeader icon="videocam" text="أضف إشارة" class="mb-0" />
    <GestureUpload
      submitEndPoint="gestures"
      autoCompleteEndPoint="autocomplete/words"
      autoCompleteItemText="name"
      autoCompleteLabel="اختر الكلمة"
      :autoCompleteDeserializeResults="true"
    />
  </v-container>
</template>

<script>
import PageHeader from '~/components/generic/PageHeader'
import GestureUpload from '~/components/contribute/GestureUpload'

export default {
  components: {
    PageHeader,
    GestureUpload
  }
}
</script>

<style>

</style>
