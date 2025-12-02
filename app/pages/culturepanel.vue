<script setup>
import { navigateTo } from "nuxt/app";
import CEventEditor from "@@/views/culturepanel/cEventEditor.vue";
import {Button} from "~/components/ui/button";
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
    return
  }
  if(roles.includes("ADMIN")){
    admin.value = true;
  }
};

const goToAdmin = () => {
  return navigateTo("/admin");
};

const goToHP = () => {
  return navigateTo("/hp");
};

const goToJPO = () => {
  return navigateTo("/jpo");
};

init();
</script>

<template>
  <AdminTopBar/> 
  <div id="culturepanel" class="w-screen h-screen flex justify-center items-center">
    <div class="w-1/2 h-[90%]">
      <c-event-editor class="mx-0 lg:mb-[25px] min-w-full min-h-[500px] lg:min-h-full mb-[25px]  "/>
    </div>
  </div>
</template>

<style scoped>
#culturepanel {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
  height: 100dvh;
}
</style>
