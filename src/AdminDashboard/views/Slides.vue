<script setup>

import enabledViews from "../../enabledViews.json";

</script>

<template>
    <div class="dashboardPage" v-show="showing">
        <h1 class="dashboardPageTitle">Paramètres des Slides</h1>
        <div v-for="(value, name) in enabledViews" v-bind:key="name" >
        <SlideParams :hasParams="true" :slideName="name"/>
        </div>
    </div>
</template>

<script>
import SlideParams from "../components/SlideParams.vue";

export default {
  props: {
    showing: Boolean
  },
  components: {
    SlideParams,
  }
};
</script>
