<template>
    <div class="container">
        <div class="logoDiscordContainer">
            <img :src="logoDiscord" alt="Discord Banner 2"/>
        </div>
        <div class="qrCodeContainer">
            <img :src="`https://api.qrserver.com/v1/create-qr-code/?data=${link()}&amp;size=400x400`" class="qrCode"/>
        </div>
    </div>
</template>

<script>
import logoDiscord from "@/public/assets/logo_discord.png";

export default {
  data() {
    return {
      link: () => {
        let link = fetch("api/v1/discord").then(res => res);
        return encodeURIComponent(link)},
      logoDiscord: logoDiscord
    };
  }
};
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 800px;
}
.logoDiscordContainer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.qrCode {
   max-width: 400px;
   height: auto;
   width: 400px;
}
.qrCodeContainer {
    display: flex;
    background-color: white;
    justify-content: center;
    align-items: center;
    width: 500px;
    height: 500px;
    border-radius: 30px;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.25);
}
</style>
