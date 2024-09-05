<template>
    <div class="dashboardPage" v-show="showing">
        <h1 class="dashboardPageTitle">Hello World</h1>
    </div>
</template>

<script>
export default {
  props: {
    showing: Boolean
  }
};
</script>
