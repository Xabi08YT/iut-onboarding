<script setup>
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";

const props = defineProps({
  isActive: Boolean,
});

const ateliers = reactive([{
  name: "Programmation IHM",
  room: "206",
  state: "FERME"
},
{
  name: "Programmation Java",
  room: "209",
  state: "FERME"
},
{
  name: "Programmation Web",
  room: "207",
  state: "FERME"
},
{
  name: "Machine de Turing",
  room: "201",
  state: "FERME"
},
{
  name: "Exposition JPO",
  room: "203",
  state: "FERME"
},
{
  name: "Découverte DU Robotique",
  room: "210",
  state: "FERME"
}].sort((a,b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1),);

let getClass = (item) => {
  return item.state.toString() === "FERME" ? "red" : item.state.toString() === "OUVERT" ? "green" : "orange";
};

onMounted( () => {
  let ts = new Date();
  let hours = ts.getHours();
  let mins = ts.getMinutes();

  ateliers.forEach((value) => {
    if(hours > 8 && hours < 9 && value.toString().includes("Programmation")) {
      value.state = "OUVRE BIENTOT";
    }
    if(hours >= 9 && hours < 12 ) {
      value.state = "OUVERT";
    }
    if(hours === 12 && mins < 30) {
      value.state = "FERME BIENTOT";
    }
    if(hours > 12 || hours === 12 && mins > 30) {
      value.state = "FERME";
    }
  });
});
</script>

<template>
  <div class="view-container" v-show="isActive">
    <h1 class="view-title">Ateliers</h1>
    <div class="announcment">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="tableTitle">
              Nom
            </TableHead>
            <TableHead class="tableTitle">
              Salle
            </TableHead>
            <TableHead class="tableTitle">
              Statut
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(item, index) in ateliers" :key="index" class="Spaced">
            <TableCell class="tableTitle names">
              {{ item.name }}
            </TableCell>
            <TableCell class="tableTitle roomName">
              {{ item.room }}
            </TableCell>
            <TableCell class="tableTitle" :class="getClass(item)">
              {{ item.state.toString() }}
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


.red {
  color: red;
  background-color: rgba(237, 73, 73, 0.46);
}

.green {
  color: green;
  background-color: #20ff07;
}

.orange {
  color: #f47836;
  background-color: rgba(255, 165, 0, 0.47);
}

</style>
