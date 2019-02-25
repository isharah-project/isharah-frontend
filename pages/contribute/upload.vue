<template>
  <section>
    <input ref="fileInput" type="file">
    <video ref="video">
    </video>
  </section>
</template>

<script>

export default {
  data () {
    return {
      fileReader: new FileReader()
    }
  },
  mounted () {
    this.$refs.fileInput.onchange = (event) => {
      // this.fileReader.readAsArrayBuffer(event.target.files[0])
      let source = document.createElement('source')
      source.setAttribute('src', URL.createObjectURL(event.target.files[0]))
      this.$refs.video.appendChild(source)
      this.$refs.video.setAttribute('controls', true)
    }
  },
  methods: {
  }
}
</script>

<style>

</style>
