<template>
  <div>
    <h2>hello</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderNo: ''
    }
  },
  created() {
    this.orderNo = this.$route.params.orderNo
  }
}
</script>

<style lang="scss" scoped>

</style>
