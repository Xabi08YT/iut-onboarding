<script setup>
const props = defineProps({
  isActive: Boolean,
});
</script>

<template>
  <div class="view-container" v-show="isActive">
    <h1 class="view-title">Regardez le point de vue d'anciens étudiants !</h1>
    <div class="announcment" id="StudentPOVMSG">
      <h2>
        Si vous scannez ce code QR, vous pourrez visionner une vidéo <br/> de présentation du BUT INFO réalisée par un étudiant d'ici !
      </h2>
      <img src="/assets/VideoPresentationIUT.png"/>
    </div>
  </div>
</template>

<style scoped>
#StudentPOVMSG {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.25);
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 35px;
  font-family: Fredoka;
}

#StudentPOVMSG img {
  height:425px;
  margin-top: 25px;
}
</style>