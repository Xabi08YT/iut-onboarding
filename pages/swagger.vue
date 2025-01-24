<script setup lang="ts">
import { SwaggerUIBundle } from "swagger-ui-dist";
import {onMounted} from "vue";

onMounted(async () => {
  let specs = await fetch(`/info/api/v1/doc`);
  specs = await specs.json();
  console.log(specs);
  SwaggerUIBundle({
    dom_id: "#swagger-ui",
    spec: specs,
  });
});
</script>

<template>
  <div id="swagger-ui">Coming soon</div>
</template>

<style>
@import "swagger-ui-dist/swagger-ui.css";
</style>
