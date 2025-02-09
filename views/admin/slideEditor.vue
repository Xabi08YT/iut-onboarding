<script setup>

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";
import {Input} from "../../components/ui/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/ui/card";
import {Switch} from "../../components/ui/switch";
import {ScrollArea} from "../../components/ui/scroll-area";
import {toast} from "../../components/ui/toast";
import {deepObjectClone} from "../../lib/utils";

let slides = ref([]);
let compareSlidesUser = ref([]);

/**
 * Fill the content related to the slides
 * @returns {Promise<void>}
 */
const initSlides = async () => {
  let res = await fetch("/info/api/v1/slide");
  let data = await res.json();
  slides.value = deepObjectClone(data);
  compareSlidesUser.value = [...deepObjectClone(slides.value)];
};

const init = async () => {
  await initSlides();

  /**
   * Seeking for any changes
   */
  watch(compareSlidesUser.value, async () => {
    for (let s of compareSlidesUser.value) {
      if (!JSON.stringify(slides.value).includes(JSON.stringify(s))) {
        slides.value[s.id - 1] = deepObjectClone(s);
        let res = await fetch("/info/api/v1/slide", {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(s)
        });
        if (res.ok) {
          toast({
            title: "Slide updated successfully",
          });
        } else {
          toast({
            title: "Slide was not updated",
            description: (await res.json()).message,
            variant: "destructive",
          });
        }
      }
    }
  });
};

init();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Slides actives</CardTitle>
      <CardDescription>Ici vous pouvez editer les slides activées et leur temps d'apparition. Les modifications sont
        automatiquement appliquées.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea class="h-[250px] sm:h-[400px] md:h-[500px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="text-center">Nom</TableHead>
              <TableHead class="text-center">Temps (s)</TableHead>
              <TableHead class="text-center">Actif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, index) in compareSlidesUser " :key="index">
              <TableCell class="text-center">{{ item.name }}</TableCell>
              <TableCell><Input type="number" v-model=item.time class="text-center min-w-[75px]"/></TableCell>
              <TableCell class="text-center">
                <Switch :checked=item.active @update:checked="(value) => {
                    compareSlidesUser[index].active = value;
                  }"/>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
