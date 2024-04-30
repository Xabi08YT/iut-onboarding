<template>
    <div class="view-content" v-show="isActive">
      <TopBar />
    </div>
</template>

<script>
import TopBar from "./TopBar.vue";

export default {
  props: {
    isActive: Boolean,
  },
  components: {
    TopBar,
  }
};
</script>

<style>
</style>
