<template>
    <div class="view-container" v-show="isActive" v-if="eventData !== undefined">
        <h1 class="view-title">{{eventData.title}}</h1>
        <div class="announcment">
          <h2>{{eventData.description}}</h2>
          <div id="AssoImg" >
            <img :src=path() />
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
      path:() => this.eventData.image !== null ? `data:image/png;base64,${this.eventData.image}` : "assets/Warning.png",
    };
  }
};
</script>
<style>

#AssoImg {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#AssoImg > img {
    max-height: 425px;
    max-width: 425px;
    margin: 10px;
    width: 425px;
    height: 425px;
}

.announcment {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.25);
  padding: 25px;
  display: flex;
  flex-direction: column !important;
  align-items: center;
}

h2 {
  font-family: Fredoka, sans-serif;
  font-size: 35px;
}
</style>
