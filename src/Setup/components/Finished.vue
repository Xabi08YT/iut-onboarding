<template>
    <div class="setupContent" v-show="isActive">
        <h1>Hello World</h1>
    </div>
</template>
<script>
export default {
  props: {
    isActive: Boolean
  }
};
</script>
