<template>
    <div id="SetupView">
        <CreatingDB :isActive="currentView == 'dbc'" />
        <AddFirstUser :isActive="currentView == 'addusr'" />
        <FinishedSetup :isActive="currentView == 'finished'" />
    </div>
</template>
<script>
import CreatingDB from "./components/CreatingDB.vue";
import AddFirstUser from "./components/AddFirstUser.vue";
import FinishedSetup from "./components/Finished.vue";

export default {
  data() {
    return {
      currentView: "dbc"
    };
  },
  components: {
    AddFirstUser,
    CreatingDB,
    FinishedSetup
  }
};
</script>
<style>
#SetupView {
  width: 100vw;
  height: 100vh;
  background: url("assets/background.jpeg");
}

.setupContent {
  position: absolute;
  margin-top: 10%;
  margin-left: 28%;
  padding: 50px;
  background-color: #FFFFFF;
  border-radius: 21px;
  width: 800px;
}

.setupContent h1 {
  font-size: 50px;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  text-align: center;
}
</style>
