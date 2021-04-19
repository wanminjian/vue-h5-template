<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view class="router"></router-view>
      </keep-alive>
      <router-view class="router" v-else></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      transitionName :  'fold-left'
    }
  },
  watch: {
    $route(to, from) {
      if (to.meta.index > from.meta.index) {
        this.transitionName = 'fold-left';
      } else {
        this.transitionName = 'fold-right';
      }
    }
  }
}
</script>
<style lang="scss"></style>
