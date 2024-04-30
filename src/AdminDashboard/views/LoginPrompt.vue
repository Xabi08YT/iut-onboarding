<template>
    <div class="view-login" v-show="isActive">
      <form id="adminLogin">
        <h1>Connexion</h1>
        <input id="username" type="text" placeholder="  Identifiant" required>
        <span id=passwordspan>
          <input id="password" type='password' placeholder="  Mot de passe" required>
          <input id="showPsw" class="hidden" type="checkbox" onchange="
          document.getElementById('showpswicon').classList = ['icon'];
          document.getElementById('hidepswicon').classList = ['icon'];
          if(document.getElementById('showPsw').checked) {
            document.getElementById('showpswicon').classList.add('displayed');
            document.getElementById('hidepswicon').classList.add('hidden');
            document.getElementById('password').setAttribute('type','text');
          } else {
            document.getElementById('showpswicon').classList.add('hidden');
            document.getElementById('hidepswicon').classList.add('displayed');
            document.getElementById('password').setAttribute('type','password');
          }">
          <label for='showPsw'>
            <img class="icon hidden" id='showpswicon' src='../assets/eye-password-show-svgrepo-com.svg'>
            <img class="icon" id='hidepswicon' src='../assets/eye-password-hide-svgrepo-com.svg'>
          </label>
        </span>
        <button id="IDNUMconnectBtn" type="submit">Se Connecter</button>
      </form>
    </div>
</template>

<script>
//import Background from "../components/Background.vue";

export default {
  props: {
    isActive: Boolean,
  },
  /*components: {
    Background
  }*/
};
</script>

<style>
.view-login {
  width: 100vw;
  height: 100vh;
  vertical-align: center;
}

#adminLogin {
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 54px;
  border-style: solid;
  border-width: 0.5px;
  padding: 50px;
  height: 360px;
  width: 360px;
  margin-top: 20vh;
  left: 38%
}

#adminLogin h1 {
  margin-bottom: 40px;
  font-size: 45px;
}

.displayed {
  display: inherit;
  transition: 1s;
}

.hidden {
  display: none;
  transition: 1s;
}

.icon {
  height: 32px;
  width: 32px;
}

#username, #passwordspan input {
  border-radius: 42px;
  border-style: solid;
  margin-bottom:30px;
  height: 50px;
  font-size: 25px;
  padding-left: 5px;
}

#passwordspan label {
  position: absolute;
  right: 13%;
  z-index: 100px;
  vertical-align: center;
  margin-top: 13px;
}

#passwordspan input {
  position: relative;
  z-index: -100px;
  width: 350px;
}

#IDNUMconnectBtn {
  border-radius: 42px;
  border: none;
  background-color: #04c3ff;
  color: white;
  height: 60px;
  font-size: 25px;
  transition: 0.5s;
}

#IDNUMconnectBtn:hover {
  transition: 0.5s;
  background-color: #01a1CC;
}

</style>
