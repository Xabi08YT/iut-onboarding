<template>
    <div class="setupContent" v-show="isActive">
        <h1>Construction de la base de données initiale...</h1>
    </div>
</template>
<script>
export default {
  props: {
    isActive: Boolean
  }
};
</script>
<style>
</style>
