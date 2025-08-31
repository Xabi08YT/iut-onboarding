<template>
  <div id="header">
    <p>{{ currentDate }}</p>
    <p>{{ currentTime }}</p>
    <img style="width: 150px; margin-left: 150px;" :src="logoLink" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTime: "",
      currentDate: "",
      currentTimeInterval: undefined,
      currentDateInterval: undefined,
      currentUpdateLogoInterval: undefined,
      logoLink: ref("")
    };
  },
  methods: {
    updateCurrentTime() {
      this.currentTime = new Date().toLocaleTimeString("fr-FR").split(" ")[0];
    },
    updateCurrentDate() {
      this.currentDate = new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        month: "long",
        day: "2-digit",
      });
    },
    updateLogo() {
      fetch("api/v1/getLogo").then(async (response) => {
        this.logoLink = await response.text();
      })
    }
  },
  mounted() {
    this.updateLogo();
    this.updateCurrentTime();
    this.updateCurrentDate();
    this.currentTimeInterval = setInterval(this.updateCurrentTime, 1000); // Refresh every seconds
    this.currentDateInterval = setInterval(this.updateCurrentDate, 3600000); // Refresh evry hours
    this.currentUpdateLogoInterval = setInterval(this.updateLogo, 3600000);
  },
  unmounted() {
    clearInterval(this.currentTimeInterval);
    clearInterval(this.currentDateInterval);
    clearInterval(this.currentUpdateLogoInterval);
  },
};
</script>

<style scoped>
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95vw;
  font-size: 1.25em;
  position: absolute;
  top: 0.5em;
  color: rgb(38, 48, 48);
}

#header > img {
  filter: invert(0.7);
  width: 150px;
}

#header > p {
  width: 320px;
  text-align: center;
  font-size: 32px;
}

#header > p:last-of-type {
  font-size: 44px;
}
</style>
