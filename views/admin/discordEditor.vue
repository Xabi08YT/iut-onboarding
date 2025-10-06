<script setup>
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {toast, Toaster, useToast} from "~/components/ui/toast";

let discordLink = ref("");

let applyDiscord = async () => {
  let res = await fetch("api/v1/discord", {method: "PUT", body: JSON.stringify({link: discordLink.value})});
  getDiscordLink();
  if (res.ok) {
    toast({title: "Lien mis à jour avec succès"});
  } else {
    toast({title: "Une erreur est survenue.",
    description:await res.json().then(data => data.message),
    variant:"destructive"});
  }

};

let getDiscordLink = () => {
  fetch("api/v1/discord").then(async (res) => discordLink.value = await res.text())
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
      <Button @click="applyDiscord()" class="w-full">Enregistrer</Button>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
