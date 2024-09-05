<template>
    <div class="dashboardPage" v-show="showing">
        <h1 class="dashboardPageTitle">Centre de déclenchement d'alertes</h1>
        <div class="AlertPageBody">
            <AlertComponent :AlertTitle="'Alerte Intrusion'" />
        </div>
    </div>
</template>

<script>
import AlertComponent from "../components/AlertComponent.vue";

export default {
  props: {
    showing: Boolean
  },
  components: {
    AlertComponent,
  }
};
</script>
