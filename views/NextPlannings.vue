<script setup>
import {defineComponent, onMounted, onUnmounted, reactive} from "vue";
import PlanningCard from "~/components/PlanningCard.vue";
import icals from "~~/icals.json";
import PlanningCard from "~/components/PlanningCard.vue";
import {HyperplanningScheduler} from "@xabi08yt/iutgradignanhpscheduler";
import hpSettings from "~~/data.json";

const edt = reactive({info_but1: [], info_but2: [], info_but3: []});
const delay = 1000 * 60 * 5; // Refresh toutes les 5 minutes

let currentHourRangeStr = "";
let refreshInterval = undefined;
let promos;
let proxyUrl = `${useRequestURL()}api/hp/`;
let classes = [];
let version;
let infobut1_DSMODE = ref(false);
let infobut2_DSMODE = ref(false);
let infobut3_DSMODE = ref(false);
let icals;

const props = defineProps({
  isActive: Boolean,
});

const components = defineComponent({
  PlanningCard
});

function setCurrentHourRange() {
  const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
  if (currentTime < 9 * 60 + 45) {
    // < 09h30
    currentHourRangeStr = "8h15 - 10h00";
  } else if (currentTime < 11 * 60 + 30) {
    // < 11h30
    currentHourRangeStr = "10h25 - 12h15";
  } else if (currentTime < 15 * 60 + 30) {
    // < 15h30
    currentHourRangeStr = "14h00 - 15h50";
  } else {
    // > 15h30
    currentHourRangeStr = "16h10 - 18h00";
  }
}

let generateGroupsSchedulers = () => {
  promos = [];
  let But3_done = false;

  Object.keys(icals).forEach((promo) => {

    classes.push({
      promotion: promo, className: promo, classIcal: new HyperplanningScheduler(icals[promo].ical,
          {proxyUrl, version: version}),
      groups: undefined
    });


    if (
        promo === "infobut3alt" ||
        (promo === "infobut3fi" && !But3_done)
    ) {
      promos.push("infobut3");
    }


    icals[promo].classes.forEach((c) => {


      classes.push({
        promotion: promo,
        className: c.className,
        classIcal: new HyperplanningScheduler(c.classIcal, {proxyUrl, version: version}),
        groups: c.groups
            ? {
              prime: new HyperplanningScheduler(c.groups.prime, {
                proxyUrl,
                version: version,
              }),
              seconde: new HyperplanningScheduler(c.groups.seconde, {
                proxyUrl,
                version: version,
              }),
            }
            : [],
      });
    });
  });
};

let nextEventFilter = (event) => {
  // Actual time in minutes relatives to 00:00 of the current day (Ex: 420 for 07:00am)
  let currentTime = new Date().getHours() * 60 + new Date().getMinutes();
  const eventStartTime =
      event.dateStart.getHours() * 60 + event.dateStart.getMinutes();
  const eventEndTime =
      event.dateEnd.getHours() * 60 + event.dateEnd.getMinutes();

  // Cas spécial -> afficher les cours de 14h entre 11h30 et 13h30
  if (currentTime > 11 * 60 + 30 && currentTime < 13 * 60 + 30)
    currentTime += 2 * 60; // On fais croire qu'il est h+2, soit entre 13h30 et 15h30

  // Display this event 30min before it starts and stop displaying it 30 mins before it ends.
  return (
      currentTime > eventStartTime - 30 && currentTime <= eventEndTime - 30
  );
};

let getAllPlannings = async () => {
  console.log("Refreshing plannings");
  // console.log(classes)
  setCurrentHourRange();
  edt.info_but1 = [];
  edt.info_but2 = [];
  edt.info_but3 = [];
  infobut1_DSMODE.value = false;
  infobut2_DSMODE.value = false;
  infobut3_DSMODE.value = false;
  try {

    for (const c of classes) {
      let primeEvent;
      let secondeEvent;
      const classEvent = await c.classIcal
          .getEvents()
          .then((events) => events.find(nextEventFilter));
      // eslint-disable-next-line eqeqeq,no-constant-binary-expression
      if (!c.groups === undefined) {
        primeEvent = await c.groups.prime
            .getEvents()
            .then((events) => events.find(nextEventFilter));
        secondeEvent = await c.groups.seconde
            .getEvents()
            .then((events) => events.find(nextEventFilter));
      }

      if (classEvent !== undefined) primeEvent = classEvent;

      c.promotion = c.promotion.replaceAll('_', '').toLowerCase();
      //Switching between columns depending on the promotion
      switch (c.promotion) {
        case "infobuts1":
        case "infobuts2":
        case "infobut1":
          edt.info_but1.push({
            className: c.className,
            isFullClass: classEvent !== undefined,
            type: [
              primeEvent ? primeEvent.type : undefined,
              secondeEvent ? secondeEvent.type : undefined,
            ],
            subject: [
              primeEvent
                  ? primeEvent.subject.split(" ").slice(1).join(" ")
                  : undefined,
              secondeEvent
                  ? secondeEvent.subject.split(" ").slice(1).join(" ")
                  : undefined,
            ],
            teacher: [
              primeEvent ? primeEvent.teachers.join(" - ") : undefined,
              secondeEvent ? secondeEvent.teachers.join(" - ") : undefined,
            ],
            room: [
              primeEvent
                  ? primeEvent.locations
                      ? primeEvent.locations.toString().replaceAll("Salle de Controle","").replaceAll(",",", ").replaceAll("Room Without Borders","").replaceAll("Classe mobile","").replaceAll("Salle des Conseils","") : ""
                  : undefined,
              secondeEvent
                  ? secondeEvent.locations
                      ? secondeEvent.locations.toString().replaceAll("Salle de Controle","").replaceAll(",",", ").replaceAll("Room Without Borders","").replaceAll("Classe mobile","").replaceAll("Salle des Conseils","") : ""
                  : undefined,
            ],
          });
          break;
        case "infobuts3":
        case "infobuts4":
        case "infobut2":
          edt.info_but2.push({
            className: c.className,
            isFullClass: classEvent !== undefined,
            type: [
              primeEvent ? primeEvent.type : undefined,
              secondeEvent ? secondeEvent.type : undefined,
            ],
            subject: [
              primeEvent
                  ? primeEvent.subject.split(" ").slice(1).join(" ")
                  : undefined,
              secondeEvent
                  ? secondeEvent.subject.split(" ").slice(1).join(" ")
                  : undefined,
            ],
            teacher: [
              primeEvent ? primeEvent.teachers.join(" - ") : undefined,
              secondeEvent ? secondeEvent.teachers.join(" - ") : undefined,
            ],
            room: [
              primeEvent
                  ? primeEvent.locations
                      ? primeEvent.locations.toString().replaceAll("Salle de Controle","").replaceAll(",",", ").replaceAll("Room Without Borders","").replaceAll("Classe mobile","").replaceAll("Salle des Conseils","") : ""
                  : undefined,
              secondeEvent
                  ? secondeEvent.locations
                      ? secondeEvent.locations.toString().replaceAll("Salle de Controle","").replaceAll(",",", ").replaceAll("Room Without Borders","").replaceAll("Classe mobile","").replaceAll("Salle des Conseils","") : ""
                  : undefined,
            ],
          });
          break;
        case "infobuts5":
        case "infobuts6":
        case "infobuts5alt":
        case "infobuts6alt":
        case "infobuts5fi":
        case "infobuts6fi":
        case "infobut3fi":
        case "infobut3alt":
        case "infobut3":

          edt.info_but3.push({
            className: c.className.split(" ")[1] ? `[${c.className.split(" ")[1]}] ${c.className.split(" ")[0]}` : `${c.className.split(" ")[0]}`,
            isFullClass: classEvent !== undefined,
            type: [
              primeEvent ? primeEvent.type : undefined,
              secondeEvent ? secondeEvent.type : undefined,
            ],
            subject: [
              primeEvent
                  ? primeEvent.subject.split(" ").slice(1).join(" ")
                  : undefined,
              secondeEvent
                  ? secondeEvent.subject.split(" ").slice(1).join(" ")
                  : undefined,
            ],
            teacher: [
              primeEvent ? primeEvent.teachers.join(" - ") : undefined,
              secondeEvent ? secondeEvent.teachers.join(" - ") : undefined,
            ],
            room: [
              primeEvent
                  ? primeEvent.locations
                      ? primeEvent.locations.toString().replaceAll("Salle de Controle","").replaceAll(",",", ").replaceAll("Room Without Borders","").replaceAll("Classe mobile","").replaceAll("Salle des Conseils","") : ""
                  : undefined,
              secondeEvent
                  ? secondeEvent.locations
                      ? secondeEvent.locations.toString().replaceAll("Salle de Controle","").replaceAll(",",", ").replaceAll("Room Without Borders","").replaceAll("Classe mobile","").replaceAll("Salle des Conseils","") : ""
                  : undefined,
            ],
          });
          break;
        default:
          console.log("Unknown promotion.");
      }
    }


    if (edt.info_but1[0].subject !== undefined && edt.info_but1[0].subject[0] !== undefined) {
      edt.info_but1 = edt.info_but1.slice(0, 1)
      infobut1_DSMODE.value = true;
    } else {
      edt.info_but1 = edt.info_but1.slice(1)
    }


    if (edt.info_but2[0].subject !== undefined && edt.info_but2[0].subject[0] !== undefined) {
      edt.info_but2 = edt.info_but2.slice(0, 1)
      infobut2_DSMODE.value = true;
    } else {
      edt.info_but2 = edt.info_but2.slice([1])
    }


    if (edt.info_but3[0].subject !== undefined && edt.info_but3[0].subject[0] !== undefined) {
      edt.info_but3 = edt.info_but3.slice(0, 1)
      infobut3_DSMODE.value = true;
    } else {
      edt.info_but3 = edt.info_but3.slice([1])
    }


  } catch (e) {
    console.error("Failed to fetch plannings", e);
    edt.info_but1 = [];
    edt.info_but2 = [];
    edt.info_but3 = [];
    // eslint-disable-next-line prefer-template
    currentHourRangeStr = "Si si tu as cours, c'est juste un bug :)";
  }
};

let refresh = async () => {
  edt.info_but1 = [];
  edt.info_but2 = [];
  edt.info_but3 = [];
  setCurrentHourRange();
  getAllPlannings();
};

onMounted(async () => {
  let res = await fetch("api/v1/hyperplanningEndpoint");
  if (res.status === 200) {
    let body = await res.json();
    icals = JSON.parse(JSON.parse(body.icals.value));
    version = body.version.value.replaceAll("\"", "");
  }
  setCurrentHourRange();
  generateGroupsSchedulers();
  getAllPlannings();
  refreshInterval = setInterval(await refresh, delay);
});

onUnmounted(() => clearInterval(refreshInterval));
</script>

<template>
  <div v-show="isActive" class="view-container">
    <h1 class="view-title">
      {{ currentHourRangeStr }}
    </h1>
    <div id="columns">
      <!--Column for BUT1-->
      <div id="c1">
        <div class="view-content" v-if="!infobut1_DSMODE">
          <PlanningCard
              v-for="(data, index) in edt.info_but1.slice(0, 2)"
              :key="index"
              :data="data"
          />
        </div>
        <div class="view-content" v-if="!infobut1_DSMODE">
          <PlanningCard
              v-for="(data, index) in edt.info_but1.slice(2, 4)"
              :key="index"
              :data="data"
          />
        </div>
      </div>
      <PlanningCard
          v-if="infobut1_DSMODE"
          :data="edt.info_but1[0]"
          :dsMode="true"
      />
      <!--Column for BUT2-->
      <div id="c2">
        <div class="view-content" v-if="!infobut2_DSMODE">
          <PlanningCard
              v-for="(data, index) in edt.info_but2.slice(0, 2)"
              :key="index"
              :data="data"
              :dsMode="true"
          />
        </div>
        <div class="view-content" v-if="!infobut2_DSMODE">
          <PlanningCard
              v-for="(data, index) in edt.info_but2.slice(2, 4)"
              :key="index"
              :data="data"
              :dsMode="true"
          />
        </div>
      </div>
      <PlanningCard
          v-if="infobut2_DSMODE"
          :data="edt.info_but2[0]"
      />
      <!--Column for BUT3-->
      <div id="c3">
        <div class="view-content" v-if="!infobut3_DSMODE">
          <PlanningCard
              v-for="(data, index) in edt.info_but3.slice(0, 2)"
              :key="index"
              :data="data"
          />
        </div>
        <div class="view-content" v-if="!infobut3_DSMODE">
          <PlanningCard
              v-for="(data, index) in edt.info_but3.slice(2, 4)"
              :key="index"
              :data="data"
          />
        </div>
        <PlanningCard
            v-if="infobut3_DSMODE"
            :data="edt.info_but3[0]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
span {
  width: 100%;
  font-weight: bold;
}

#columns {
  display: flex;
  flex-direction: row;
  margin-left: 5px;
  margin-top: 5px;
}
</style>
