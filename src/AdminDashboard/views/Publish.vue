<template>
    <div class="dashboardPage" v-show="showing">
        <h1 class="dashboardPageTitle">Publier une annonce</h1>
    </div>
</template>

<script>
export default {
  props: {
    showing: Boolean
  }
};
</script>
