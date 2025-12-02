<script setup>
import { navigateTo } from "nuxt/app";
import JPOEventEditor from "@@/views/JPO/jpoPanel.vue";
import {Button} from "~/components/ui/button";

let admin = ref(false);

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn = await fetch("api/v1/session");

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }
  let {roles} = await loggedIn.json();
  if (!roles.includes("ADMIN") && !roles.includes("MAINTAINER") && !roles.includes("CULTURE")) {
    return navigateTo("/login");
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
  <div v-if="admin" class="flex justify-center m-2">
    <Button class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToAdmin()">Admin Panel</Button>
    <Button class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToCulture()">Culture Panel</Button>
    <Button class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToHP()">HP Panel</Button>
  </div>
  <div id="jpopanel" class="w-screen h-screen flex justify-center items-center">
    <div class="w-1/2 h-[90%]">
      <JPOEventEditor class="mx-0 lg:mb-[25px] min-w-full min-h-[500px] lg:min-h-full mb-[25px]  "/>
    </div>
  </div>
</template>

<style scoped>
#jpopanel {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
  height: 100dvh;
}
</style>
