<template>
    <div class="setupContent" v-show="isActive">
        <h1>Setup terminé</h1>
        <p>La base de données à été créée avec succès. Le logiciel est maintenant en service.</p>
        <button v-on:click="gotoAdmin()">Aller au panneau de configuration</button>
    </div>
</template>
<script>
export default {
  props: {
    isActive: Boolean
  },
  methods: {
    gotoAdmin() {
      window.location = new URL(window.location.origin);
      window.location.pathname = "/admin";
    }
  }
};
</script>
<style>
.setupContent {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.setupContent p {
  margin-top: 25px;
  font-size: 30px;
  text-align: center;
}

.setupContent button {
  font-size: 30px;
  margin-top: 35px;
  padding: 15px;
  border-radius: 21px;
  border: none;
  background-color: #04c3ff;
  color: #FFF;
  font-size: 25px;
  transition: 0.5s;
}

.setupContent button:hover {
  background-color: #01a1CC;
  transition: 0.5s;
}
</style>
