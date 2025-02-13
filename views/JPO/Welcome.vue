<script setup>
const props = defineProps({
  isActive: Boolean,
});
</script>

<template>
  <div class="view-container" v-show="isActive">
    <h1 class="view-title">🎉🎉 Bienvenue à l'IUT de gradignan ! 🎉🎉</h1>
    <div class="announcment" id="WelcomeMessage">
      <h2>
        Nous vous souhaitons une bonne matinée parmis nous pour la journée portes ouvertes !
      </h2>
      <img src="https://img.freepik.com/photos-gratuite/mot-bienvenue-disponible-lancement-ouvert_53876-124476.jpg?semt=ais_hybrid"/>
    </div>
  </div>
</template>

<style scoped>

</style>