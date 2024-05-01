<template>
    <div class="view-content" id="dashboardTop">
        <img src="../assets/logo_iut_black.svg" class="bigicon">
        <h1>Onboarding Admin</h1>
        <nav>
          <ul>
            <li v-on:click="this.$parent.show('home')">Home</li>
            <li v-on:click="this.$parent.show('none')">none</li>
          </ul>
        </nav>
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
  display: flex;
  justify-content: left;
  width: 100%;
  height: 10%;
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
  margin-top: 23px;
  margin-left: 30px;
  font-style: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
