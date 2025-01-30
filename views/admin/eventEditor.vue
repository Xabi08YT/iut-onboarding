<script setup>

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/ui/card";
import {ScrollArea} from "../../components/ui/scroll-area";
import {Button} from "../../components/ui/button";
import {toast} from "../../components/ui/toast";
import {deepObjectClone} from "../../lib/utils";

let events = ref([]);
const channels = ["Etudiant", "Enseignants", "DDE", "Département"];

/**
 * Format a date to a readable format
 * @param date date string
 * @returns string Date in the readable format
 */
const formatDate = (date) => {
  let dt = date.split("T");
  dt[1] = dt[1].replace("Z", "");
  let dp = dt[0].split("-");
  let newD = `${dp[2]}/${dp[1]}/${dp[0]} `;
  let newT = dt[1].split(".")[0];
  return `${newT} ${newD}`;
};

/**
 * Fill the content related to the events
 * @returns {Promise<void>}
 */
const initEvents = async () => {
  let res = await fetch("/info/api/v1/event");
  let data = await res.json();
  events.value = deepObjectClone(data);
};

/**
 * Call the api to delete the event with the furnished id
 * @param id
 * @returns {Promise<void>}
 */
const deleteEvent = async (id) => {
  let res = await fetch("/info/api/v1/event", {
    method: "DELETE",
    body: JSON.stringify(id)
  });
  if(res.ok) {
    toast({
      title: "Event deleted successfully",
    });
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to delete event",
      description: msg.message,
      variant: "destructive",
    });
  }

  await initEvents();
};

/**
 * Call the api to modify the event and replace it with the furnished object
 * @param modified
 * @returns {Promise<void>}
 */
const editEvent = async (modified) => {
  let res = await fetch("/info/api/v1/event", {
    method: "PUT",
    body: JSON.stringify(modified)
  });
  if(res.ok) {
    toast({
      title: "Event Modified successfully",
    });
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to modify event",
      description: msg.message,
      variant: "destructive",
    });
  }

  await initEvents();
};

/**
 * Call the api to create a new event
 * @param newEvent
 * @returns {Promise<void>}
 */
const addEvent = async (newEvent) => {
  let res = await fetch("/info/api/v1/event", {
    method: "POST",
    body: JSON.stringify(newEvent)
  });
  if(res.ok) {
    toast({
      title: "Event created successfully",
    });
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to create event",
      description: msg.message,
      variant: "destructive",
    });
  }

  await initEvents();
};

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn = await fetch("/info/api/v1/session");

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }

  await initEvents();
};

init();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex justify-between">
        <div>Editeur d'annonces</div>
        <Button>
          <LucideCirclePlus/>
        </Button>
      </CardTitle>
      <CardDescription class="text-left">Ici vous pouvez ajouter, supprimer ou éditer des annonces à afficher.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea class="h-[250px] sm:h-[250px] md:h-[250px] lg:h-[200px] xl:h-[300px] 2xl:h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="text-center">Titre</TableHead>
              <TableHead class="text-center">Diffusé du</TableHead>
              <TableHead class="text-center">Au</TableHead>
              <TableHead class="text-center">Sur le canal</TableHead>
              <TableHead class="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, index) in events " :key="index">
              <TableCell class="text-center">{{ item.title }}</TableCell>
              <TableCell class="text-center">{{ formatDate(item.startTS) }}</TableCell>
              <TableCell class="text-center">{{ formatDate(item.endTS) }}</TableCell>
              <TableCell class="text-center">{{ channels[item.channel] }}</TableCell>
              <TableCell class="text-center flex justify-center">
                <Dialog>
                  <DialogTrigger>
                    <Button>
                      <LucidePen/>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier une annonce</DialogTitle>
                      <DialogDescription>Ici vous pouvez editer une annonce existante.</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" @click=deleteEvent(item.id)>
                  <LucideTrash2/>
                </Button>
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