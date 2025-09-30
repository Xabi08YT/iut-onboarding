<script setup lang="ts">
import {Input} from "../components/ui/input";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card";
import {Button} from "../components/ui/button";
import {toast, Toaster, useToast} from "../components/ui/toast";
import { navigateTo } from "nuxt/app";

let username = "";
let password = "";

const login = async () => {
  let res = await fetch("api/v1/session", {
    headers: {"Content-Type": "application/json"}, method: "POST", body: JSON.stringify({
      username,
      password
    })});
  if(res.ok) {
    toast({title: "Utilisateur connecté"});
    let msg = await res.json();
    console.log(msg);
    if(msg.goto == "CHOOSE") {
      return navigateTo("/waitroom");
    } else if(msg.goto == "CULTURE") {
      return navigateTo("/culturepanel");
    }
    return navigateTo("/admin");
  }

  toast({
    title: "Une erreur est survenue",
    description: await res.json().then(data => data.message),
    variant: "destructive",
  });
};

</script>

<template>
  <div class="flex justify-center items-center gap-2 w-screen h-screen" id="login">
    <Toaster />
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Pour continuer, veuillez vous connecter</CardDescription>
      </CardHeader>
      <CardContent class="">
        <Input type="text" placeholder="username" class="mt-[5px]" v-model="username"/>
        <Input type="password" placeholder="password" class="mt-[5px]" v-model="password"/>
      </CardContent>
      <CardFooter>
        <Button class="mt-[5px] w-full" @click="login">Se connecter</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
#login {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
}
</style>
