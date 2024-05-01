<template>
    <div class="view-content" v-show="showing">
        <h1>Hello World</h1>
    </div>
</template>

<script>
export default {
  props: {
    showing: Boolean
  }
};
</script>
