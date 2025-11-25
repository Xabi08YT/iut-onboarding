<template>
  <div class="container">
    <div class="logoDiscordContainer">
      <NuxtImg src="@@/public/assets/logo_discord.png" alt="Discord Banner 2" loading="lazy"/>
    </div>
    <ClientOnly>
      <div class="qrCodeContainer">
        <img :src="`https://api.qrserver.com/v1/create-qr-code/?data=${link}&amp;size=400x400`" class="qrCode"/>
      </div>
    </ClientOnly>
  </div>
</template>

<script>

export default {
  data: () => {
    return {
      interval: null,
      link: null,
    }
  },
  methods: {
    getLink() {
      console.log("refreshing discord");
      fetch("api/v1/discord").then(async (res) => this.link = await res.text())
    }
  },
  mounted() {
    this.interval = setInterval(this.getLink, 500000);
    this.getLink();
  },
  unmounted() {
    clearInterval(this.interval);
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
