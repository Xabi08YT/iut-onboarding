<script setup lang="ts">
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {Toaster} from "~/components/ui/toast";
import { Textarea } from '@/components/ui/textarea';
import { navigateTo } from "nuxt/app";
import { ref } from "vue";

let admin = ref(false);

const send = () => {
    // TODO
}

const init = async () => {
  let loggedIn = await fetch("api/v1/session");

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }
  let {roles} = await loggedIn.json();
  if (!roles.includes("ADMIN") && !roles.includes("MAINTAINER") && !roles.includes("CULTURE")) {
    return navigateTo("/login");
  }
  if(roles.includes("ADMIN")){
    admin.value = true;
  }
};

const goToAdmin = () => {
  return navigateTo("/admin");
};

const goToCulture = () => {
  return navigateTo("/culturepanel");
};

init();

</script>

<template>
  <div v-if="admin" class="flex justify-center m-2">
    <Button class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToAdmin()">Admin Panel</Button>
    <Button class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 ml-2" @click="goToCulture()">Culture Panel</Button>
  </div>
  <div class="flex justify-center items-center gap-2 w-screen" id="login">
    <Toaster />
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Envoi de fichier ical.</CardTitle>
        <CardDescription>Veuillez renseigner le texte ical que vous souhaitez soumettre.</CardDescription>
      </CardHeader>
      <CardContent class="">
        <Textarea placeholder="Content" />
      </CardContent>
      <CardFooter>
        <Button class="mt-[5px] w-full" @click="send">Envoyer</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
#login {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
  height: 100dvh;
}
</style>
