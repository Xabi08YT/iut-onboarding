<script setup lang="ts">
import {Input} from "../components/ui/input";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card";
import {Button} from "../components/ui/button";

let username = "";
let password = "";

const login = async () => {
  await fetch("/info/api/v1/session", {
    headers: {"Content-Type": "application/json"}, method: "POST", body: JSON.stringify({
      username,
      password
    })});
};

</script>

<template>
  <div class="flex justify-center items-center gap-2 w-screen h-screen" id="login">
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Pour continuer, veuillez vous connecter</CardDescription>
      </CardHeader>
      <CardContent class="">
        <Input type="text" placeholder="username" class="mt-[5px]" v-model="username"/>
        <Input type="password" placeholder="password" class="mt-[5px]" v-model="username"/>
      </CardContent>
      <CardFooter>
        <Button class="mt-[5px] w-full">Se connecter</Button>
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
