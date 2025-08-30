<script lang="ts">
import {defineComponent} from 'vue'
import {Card, CardContent, CardDescription, CardTitle} from "../../components/ui/card";
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";

export default defineComponent({
  name: "discordEditor.vue",
  components: {Button, Input, CardContent, Card, CardDescription, CardTitle},
  data: {
    discordLink: await fetch("api/v1/discord")
  },
  methods: {
    applyDiscord: () => {
      await fetch("api/v1/discord", {method: "POST", body: JSON.stringify({link: this.discordLink})});
    }
  }
})
</script>

<template>
  <Card>
    <CardTitle>Editer le lien du discord</CardTitle>
    <CardDescription>Ici vous pouvez editer le lien vers le discord. Le QR code sera généré automatiquement.</CardDescription>
    <CardContent>
      <Input name="discord" type="text" :model-value="discordLink" />
      <Button onclick="applyDiscord()">Enregistrer</Button>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
