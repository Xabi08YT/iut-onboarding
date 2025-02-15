<script setup>
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";

const conferences = [
  {room: "001", who: "Mme DUTOUR", when: new Date("2025-02-15T09:15:00+01:00")},
  {room: "001", who: "Mme DUTOUR", when: new Date("2025-02-15T10:45:00+01:00")},
  {room: "006", who: "Mme DUTOUR", when: new Date("2025-02-15T11:30:00+01:00")},
  {room: "006", who: "Mme DUTOUR", when: new Date("2025-02-15T10:00:00+01:00")},
  {room: "001", who: "Mme DUTOUR", when: new Date("2025-02-15T12:15:00+01:00")},
  {room: "105", who: "M. JOURNET", when: new Date("2025-02-15T09:30:00+01:00")},
  {room: "105", who: "M. JOURNET", when: new Date("2025-02-15T10:30:00+01:00")},
  {room: "105", who: "M. JOURNET", when: new Date("2025-02-15T11:45:00+01:00")},
].sort((a,b) => a.when - b.when );

let nextConferences = ref([]);

const props = defineProps({
  isActive: Boolean,
});

onMounted(() => {
  nextConferences = [...conferences.filter((e) => e.when >= new Date())];
});

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
          <TableRow v-for="(item, index) in nextConferences" :key="index" class="Spaced">
            <TableCell class="tableTitle">
              {{ item.when.toString().split(" ")[4] }}
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
