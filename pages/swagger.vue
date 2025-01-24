<script setup lang="ts">
import { SwaggerUIBundle } from "swagger-ui-dist";

setTimeout(async () => {
  SwaggerUIBundle({
    dom_id: "#swagger-ui",
    spec: await fetch("/api/v1/doc"),
  });
});
</script>

<template>
  <div id="swagger-ui">Coming soon</div>
</template>

<style>
@import "swagger-ui-dist/swagger-ui.css";
</style>
