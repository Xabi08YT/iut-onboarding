<template>
    <div class="setupContent" v-show="isActive">
        <h1>Ajoutez le premier utilisateur à la base de données</h1>
        <form id="firstUserSetup">
          <label for="firstIDNUM"></label>
          <input id="firstIDNUM" type="text" placeholder="Nom d'utilisateur IDNUM">
          <input id="firstEmail" type="email" placeholder="Email du CAS">
          <button type="submit">Ajouter</button>
        </form>
    </div>
</template>
<script>
export default {
  props: {
    isActive: Boolean
  }
};
</script>
<style>
#firstUserSetup {
  display: flex;
  flex-direction: column;
  margin-top: 25px;
}

#firstUserSetup label {
  margin-top: 25px;
  margin-left: 15px;
}

#firstUserSetup input {
  margin-top: 10px;
  border-radius: 21px;
  border: 1px black solid;
  font-size: 20px;
  padding: 15px;
  margin-top: 25px;
}

#firstUserSetup button {
  margin-top: 35px;
  padding: 15px;
  border-radius: 21px;
  border: none;
  background-color: #04c3ff;
  color: #FFF;
  font-size: 25px;
  transition: 0.5s;
}

#firstUserSetup button:hover {
  background-color: #01a1CC;
  transition: 0.5s;
}
</style>
