<script setup>
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table";

const props = defineProps({
  isActive: Boolean,
});

let refreshInterval;

let ateliers = ref([]);

let getAterliersJpo = () => {
  fetch("api/v1/atelier", { method: "GET" })
      .then(async (res) => {
        const data = await res.json();
        ateliers.value = data.content || [];
        refresh();
      })
      .catch(error => console.error('Error fetching ateliers:', error));
};

getAterliersJpo();

let getClass = (item) => {
  return item.state.toString() === "FERME" ? "red" : item.state.toString() === "OUVERT" ? "green" : "orange";
};

let refresh = () => {
  let ts = new Date();
  let hours = ts.getHours();
  let mins = ts.getMinutes();
  let currentTimeInMins = hours * 60 + mins;

  ateliers.value.forEach((value) => {
    let startTime = new Date(value.start);
    let endTime = new Date(value.end);

    let startTimeInMins = startTime.getHours() * 60 + startTime.getMinutes();
    let endTimeInMins = endTime.getHours() * 60 + endTime.getMinutes();
    if (currentTimeInMins < startTimeInMins && currentTimeInMins >= startTimeInMins - 60) {
      value.state = "OUVRE BIENTOT";
    } else if (currentTimeInMins >= endTimeInMins - 30 && currentTimeInMins < endTimeInMins) {
      value.state = "FERME BIENTOT";
    }else if (currentTimeInMins >= startTimeInMins && currentTimeInMins < endTimeInMins) {
      value.state = "OUVERT";
    }   else {
      value.state = "FERME";
    }
  });
}

onMounted( () => {
  refreshInterval = setInterval(refresh, 10000);
});

onUnmounted(() => clearInterval(refreshInterval));
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