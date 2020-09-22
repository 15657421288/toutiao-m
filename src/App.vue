<template>
  <div id="app">
    <keep-alive include="LayoutIndex">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'APP'
}
</script>

<style lang="less"></style>
