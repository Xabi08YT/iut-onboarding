<template>
  <div class="view-container" v-show="isActive" v-if="eventData !== undefined">
    <h1 class="view-title">Prochaines rencontres du club culture</h1>
    <div class="announcment" id="cultureAnn">
      <div id="cultureIMG" >
        <img :src=path() />
        <div class="ceventdata">
          <h2>{{eventData.title}}</h2>
          <p>{{eventData.description}}</p>
          <h3>{{eventData.eventTS ? `Rencontre le ${formatDate(eventData.eventTS)}` : "Date de la rencontre non renseignée"}}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  props: {
    isActive: Boolean,
    eventData: Object,
  },
  data() {
    return {
      path:() => this.eventData.image !== null && this.eventData.image !== "" ? this.eventData.image : "assets/Warning.png",
      formatDate: (date) => {
        if(date === undefined || date === null){
          return "";
        }
        let dt = date.split("T");
        dt[1] = dt[1].replace("Z", "");
        let dp = dt[0].split("-");
        let newD = `${dp[2]}/${dp[1]}/${dp[0]} `;
        let newT = dt[1].split(".")[0];
        return `${newD} à ${newT}`;
      }
    };
  }
};
</script>

<style scoped>
#cultureIMG > img {
  height: 475px;
  width: 356px;
  margin: 10px;
  padding: 0px;
}

#cultureIMG {
  display: inline-flex;
  justify-content: space-between;
  height: 500px;
  width: 1000px;
}

.ceventdata {
  width: 75%;
  text-align: center;
  display: flex;
  flex-direction: column;
  font-family: Fredoka, sans-serif;
  font-size: 35px;
  margin-left: 10px;
}

.ceventdata h2 {
  font-size: 50px;
  padding-bottom: 25px;
}

.ceventdata h3 {
  color: red;
  font-weight: bold;
  margin-top: 25px;
}
</style>