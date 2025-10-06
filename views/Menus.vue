<template>
  <div class="view-container" v-show="isActive">
    <h1 class="view-title" id="MenuViewTitle">Menus de ce midi</h1>
    <div class="view-content">
      <MenuCard restName="SpaceCampus" :mealList="spaceMenu" v-if="spaceEnabled" />
      <MenuCard restName="Sirtaki" :mealList="sirtakiMenu" v-if="sirtakiEnabled" />
    </div>
  </div>
</template>

<script>
import MenuCard from "~/components/MenuCard.vue";

export default {
  props: {
    isActive: Boolean,
  },
  data() {
    return {
      sirtakiMenu: undefined,
      spaceMenu: undefined,
      sirtakiEnabled: false,
      spaceEnabled: false,
      interval: null
    };
  },
  components: {
    MenuCard,
  },
  methods: {
    refresh() {
      fetch("api/v1/getCrousMenus").then(async (res) => {
        let rq =  await res.json();
        let data = JSON.parse(rq.body);
        return data;
      }).then((data) => {
        this.sirtakiMenu = data.sirtaki;
        this.spaceMenu = data.space;

        //Activation des cartes à désactiver
        this.sirtakiEnabled = data.sirtakiEnabled;
        this.spaceEnabled = data.spaceEnabled;

        //Si aucun menu n'est récupérer, afficher une erreur.
        if (!data.spaceEnabled && !data.sirtakiEnabled) {
          document.getElementById("MenuViewTitle").innerHTML = "Erreur lors de la récupération des menus.";
        }
      });
    }
  },
  mounted() {
    this.refresh();
    this.interval = setInterval(this.refresh,3600000);
  },
  unmounted() {
    clearInterval(this.interval);
  }
};
</script>
