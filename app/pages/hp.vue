<script setup lang="ts">
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {Toaster} from "~/components/ui/toast";
import { Textarea } from '@/components/ui/textarea';
import { navigateTo } from "nuxt/app";
import { ref } from "vue";
import Input from "../components/ui/input/Input.vue";

let admin = ref(false);
let hpVersion = ref("")
let hpIcals = ref("")

const send = () => {
  let object = {version: hpVersion.value, icals: hpIcals.value};
  let res = await fetch("api/v1/hyperplanningEndpoint", {method:"PUT",body: JSON.stringify(object)})
  if (res.status === 200) {
    toast({titre:"Paramètres mis à jour avec succès"});
  } else {
    toast({titre: "Une erreur est survenue", description: await res.json(), variant: "destructive"});
  }
}

const get = async () => {
  let res = await fetch("api/v1/hyperplanningEndpoint");
  if (!res.ok) {
    toast({title: "Impossible de récuperer les paramètres Hyperplanning", description: await res.json(), variant: "destructive"});
  }
  console.log(res);
  let body = res.json()
  hpVersion.value =  body.version
  hpIcals.value = body.icals
}

const init = async () => {
  let loggedIn = await fetch("api/v1/session");

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }
  let {roles} = await loggedIn.json();
  if (!roles.includes("ADMIN") && !roles.includes("MAINTAINER") && !roles.includes("ENSEIGNANT")) {
    return navigateTo("/login");
  }

  await get();

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
        <CardTitle>Paramètres Hyperplanning</CardTitle>
        <CardDescription>Changement des paramètres relatifs aux emplois du temps HyperPlanning.</CardDescription>
      </CardHeader>
      <CardContent class="">
        <Label for="hpver">Version d'hyperplanning</Label>
        <Input id="hpver" type="text" placeholder="Version" v-model="hpVersion" />
        <Label for="hpical">Contenu du fichier JSON des icals</Label>
        <Textarea id="hpical" placeholder="Contenu" v-model="hpIcals"/>
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
