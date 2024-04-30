<template>
    <div class="view-content">
      <LoginPrompt
        v-if="Object.keys(views).includes('login')"
        :isActive="currentView == 'login'"
      />
      <Main
        v-if="Object.keys(views).includes('main')"
        :isActive="currentView == 'main'"
      />
    </div>
</template>

<script>
import LoginPrompt from "./views/LoginPrompt.vue";
import Main from "./views/Main.vue";

export default {
  data() {
    return {
      currentView: "main",
      views: {
        login : {
          allowed: () => true
        },
        main : {
          allowed: () => true
        },
      },
    };
  },
  components: {
    LoginPrompt,
    Main,
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
