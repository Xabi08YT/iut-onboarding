<script setup>
import { navigateTo } from "nuxt/app";
import JPOEventEditor from "@@/views/JPO/jpoPanel.vue";
import AdminTopBar from "../components/AdminTopBar.vue";

const runtimeConfig = useRuntimeConfig();
const requestURL = useRequestURL();
const rootUrl = requestURL.origin + runtimeConfig.app.baseURL.slice(0,-1);
const nuxtApp = useNuxtApp();

let admin = ref(false);

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn = await fetch(`${rootUrl}/api/v1/session`);

  if (!loggedIn.ok) {
    nuxtApp.runWithContext(() => {
      navigateTo('/login');
    });
    return
  }
  let {roles} = await loggedIn.json();
  if (!roles.includes("ADMIN") && !roles.includes("MAINTAINER") && !roles.includes("CULTURE")) {
    nuxtApp.runWithContext(() => {
      navigateTo('/login');
    });
  }
};

const goToAdmin = () => {
  return navigateTo("/admin")
}

const goToHP = () => {
  return navigateTo("/hp");
};

const goToCulture = () => {
  return navigateTo("/culturepanel");
};

init();
</script>


<template>
  <AdminTopBar/>
  <div id="jpopanel" class="w-screen h-screen flex justify-center items-center">
    <JPOEventEditor/>
  </div>
</template>

<style scoped>
#jpopanel {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
  height: 100dvh;
}
</style>
