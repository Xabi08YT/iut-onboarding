<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../app/components/ui/table";
import { Conference } from "../../types/conference";

let refreshInterval;

let conferences = ref([]);
let getConferece = () => {
  fetch(`${useRequestURL()}api/v1/conference`, { method: "GET" })
      .then(async (res) => {
        const data = await res.json();
        conferences.value = data.content || [];
        nextConferences.value = [...conferences.value.filter((e) => new Date(e.when) >= new Date())];
      })
      .catch(error => console.error('Error fetching conferences:', error));
};
getConferece();

let nextConferences = ref([]);

const props = defineProps({
  isActive: Boolean,
});

onMounted(() => {
  refreshInterval = setInterval(() => {
    nextConferences.value = [...conferences.value.filter((e) => new Date(e.when) >= new Date())];
  }, 10000);
});

onUnmounted(() => clearInterval(refreshInterval));
</script>

<template>
  <div class="view-container" v-show="isActive">
    <h1 class="view-title">Prochaines conférences</h1>
    <div class="announcment">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="tableTitle">
              À
            </TableHead>
            <TableHead class="tableTitle">
              Par
            </TableHead>
            <TableHead class="tableTitle"></TableHead>
            <TableHead class="tableTitle">
              Salle
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(item) in nextConferences" class="Spaced">
            <TableCell class="tableTitle">
              {{ item.when.toString().split("T")[1].split(":")[0] + "h " + item.when.toString().split("T")[1].split(":")[1]}}
            </TableCell>
            <TableCell class="tableTitle names">
              {{ item.who }}
            </TableCell>
            <TableCell class="tableTitle">
              {{ item.who.toString().includes("DUTOUR") ? "Cheffe de département" : "Chef de département adjoint"}}
            </TableCell>
            <TableCell class="tableTitle roomName">
              {{ item.room }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<style scoped>

.tableTitle {
  text-align: center;
  font-weight: bold;
  color: black;
  font-size: 2rem;
}

.roomName {
  color: rgb(41, 154, 189);
  text-align: center;
}

.names {
  text-align: left;
}

</style>