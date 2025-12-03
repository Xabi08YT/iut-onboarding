<script setup lang="ts">
import { SwaggerUIBundle } from "swagger-ui-dist";
import {onMounted} from "vue";

const runtimeConfig = useRuntimeConfig();
const requestURL = useRequestURL();
const rootUrl = requestURL.origin + runtimeConfig.app.baseURL;

onMounted(async () => {
  let specs = await fetch(`${rootUrl}/api/v1/doc`);
  specs = await specs.json();
  console.log(specs);
  SwaggerUIBundle({
    dom_id: "#swagger-ui",
    spec: specs,
  });
});
</script>

<template>
  <div id="swagger-ui">Loading swagger...</div>
</template>

<style>
@import "swagger-ui-dist/swagger-ui.css";
</style>
