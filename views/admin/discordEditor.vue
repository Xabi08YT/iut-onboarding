<script setup lang="ts">
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../app/components/ui/card";
import {Input} from "../../app/components/ui/input";
import {Button} from "../../app/components/ui/button";
import {toast, Toaster, useToast} from "../../app/components/ui/toast";
import { ref } from "vue";

const runtimeConfig = useRuntimeConfig();
const requestURL = useRequestURL();
const rootUrl = requestURL.origin + runtimeConfig.app.baseURL;

let discordLink = ref("");

let applyDiscord = async () => {
  let res = await fetch(`${rootUrl}/api/v1/discord`, {method: "PUT", body: JSON.stringify({link: discordLink.value})});
  getDiscordLink();
  if (res.ok) {
    toast({title: "Lien mis à jour avec succès"});
    await fetch(`${rootUrl}/api/v1/session`, {method: "PUT"});
  } else {
    toast({title: "Une erreur est survenue.",
      description:await res.json().then(data => data.message),
      variant:"destructive"});
  }

};

let getDiscordLink = () => {
  fetch(`${rootUrl}/api/v1/discord`).then(async (res) => discordLink.value = await res.text())
};

getDiscordLink();
</script>

<template>
  <Card class="flex flex-col">
    <Toaster />
    <CardHeader>
      <CardTitle>Editer le lien du discord</CardTitle>
      <CardDescription>Ici vous pouvez editer le lien vers le discord. Le QR code sera généré automatiquement.</CardDescription>
    </CardHeader>
    <CardContent>
      <Input name="discord" type="text" v-model="discordLink" class="w-full" />
      <Button @click="applyDiscord()" class="w-full mt-[10px]">Enregistrer</Button>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
