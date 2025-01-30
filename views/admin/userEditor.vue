<script setup>

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/ui/card";
import {ScrollArea} from "../../components/ui/scroll-area";
import {Button} from "../../components/ui/button";
import {deepObjectClone} from "../../lib/utils";

let users = ref([]);

/**
 * Fill the content related to the users
 * @returns {Promise<void>}
 */
const initUsers = async () => {
  let res = await fetch("/info/api/v1/user");
  let data = await res.json();
  users.value = deepObjectClone(data);
};

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  await initUsers();
};

init();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex justify-between">
        <div>Administration des utilisateurs</div>
        <Button>
          <LucideCirclePlus/>
        </Button>
      </CardTitle>
      <CardDescription class="text-left">Ici vous ajouter, editer et supprimer des utilisateurs</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea class="h-[250px] sm:h-[250px] md:h-[250px] lg:h-[200px] xl:h-[300px] 2xl:h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="text-center">Identifiant</TableHead>
              <TableHead class="text-center">Role</TableHead>
              <TableHead class="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, index) in users " :key="index">
              <TableCell class="text-center">{{ item.username }}</TableCell>
              <TableCell class="text-center">{{ item.role.toString() }}</TableCell>
              <TableCell class="text-center block max-w-[50px] sm:max-w-full">
                <Button>
                  <LucidePen/>
                </Button>
                <Button variant="destructive">
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