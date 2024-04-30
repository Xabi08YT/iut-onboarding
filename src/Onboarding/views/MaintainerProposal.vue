<template>
  <div class="view-container" v-show="isActive">
    <div class="view-content" id="maintainer">
        <img class="image" src="../assets/maintainer_ad.png" alt="Maintainer" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isActive: Boolean,
  },
  components: {},
};
</script>

<style scoped>
.view-content > img {
  height: 900px;
}

#maintainer {
  margin-top: 55px;
}
</style>
