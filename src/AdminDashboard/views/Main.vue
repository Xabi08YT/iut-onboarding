<template>
    <div class="view-content">
        <TopBar />
    </div>
</template>

<script>
import TopBar from "./TopBar.vue";

export default {
  data() {
    return {
      msg: "Hello world!",
    };
  },
  components: {
    TopBar,
  }
};
</script>

<style>
</style>
