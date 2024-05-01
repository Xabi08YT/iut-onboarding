<template>
    <div class="view-content" id="dashboardTop">
        <img src="../assets/logo_iut_black.svg" class="bigicon">
        <h1>Onboarding Admin</h1>
        <nav>
          <ul>
            <li v-on:click="this.$parent.show('home')"><img src="../assets/home-house-svgrepo-com.svg" class="icon"><p class="texticon">Accueil</p></li>
            <li v-on:click="this.$parent.show('publish')"><img src="../assets/ad-announcement-megaphone-svgrepo-com.svg" class="icon"><p class="texticon">Publier</p></li>
            <li v-on:click="this.$parent.show('alert')"><img src="../assets/alert-error-svgrepo-com.svg" class="icon"><p class="texticon">Alertes</p></li>
            <li v-on:click="this.$parent.show('slides')"><img src="../assets/photo-image-picture-svgrepo-com.svg" class="icon"><p class="texticon">Slides</p></li>
            <li v-on:click="this.$parent.show('access')"><img src="../assets/security-shield-alt-svgrepo-com.svg" class="icon"><p class="texticon">Accès</p></li>
          </ul>
        </nav>
        <div id="rightTopComponents">
          <p>Coucou</p>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    currentView: String
  }
};
</script>
<style>
#dashboardTop {
  position: absolute;
  display: flex;
  justify-content: left;
  width: 100%;
  box-shadow: 0 4px 2px 0px lightgray;
}

.bigicon {
  height: 64px;
  width: 64px;
}

#dashboardTop h1 {
  font-size: 45px;
  font-family: "Teko", sans-serif;
  font-weight: 700;
  margin-top: 13px;
}

#dashboardTop nav {
  margin-top: 18px;
  font-style: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-direction: row;
}

#dashboardTop nav ul {
  display: flex;
  flex-direction: row;
}

#dashboardTop nav ul li {
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  transition: 0.3s;
}

#dashboardTop nav ul li:hover {
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  transition: 0.3s;
  cursor: pointer;
  filter: invert(26%) sepia(74%) saturate(3994%) hue-rotate(146deg) brightness(91%) contrast(102%);
}

#dashboardTop nav ul li p.texticon {
  margin-top: 8px;
  margin-left: 3px;
}

#rightTopComponents {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
