<template>
    <div class="view-content">
      <LoginPrompt/>
    </div>
</template>
<script>
import LoginPrompt from "./views/LoginPrompt.vue";
import { getToken } from "./localStorage.js";

export default {
  data() {
    return {
      msg: "ok",
    };
  },
  methods :{
    grantAccess() {
      let token = getToken();
    },
  },
  components: {
    LoginPrompt,
  }
};
</script>
<style>
#admin {
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 1.2em;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
