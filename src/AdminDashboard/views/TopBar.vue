<template>
    <div class="view-content" id="dashboardTop">
        <img src="../assets/logo_iut_black.svg" class="bigicon">
        <h1>IUT Onboarding admin - {{PageTitle}}</h1>
    </div>
</template>

<script>
export default {
  data() {
    return {
      msg: ":/"
    };
  }
};
</script>
<style>
#dashboardTop {
  display: flex;
  align-items: left;
  width: 100%;
  height: 10%;
}

.bigicon {
  height: 64px;
  width: 64px;
}

hr {
  align: center;
}
</style>
