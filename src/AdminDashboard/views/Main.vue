<template>
    <div class="view-content" v-show="isActive">
      <TopBar />
      <div id="dashboardcontent">
        <Home
          v-if="Object.keys(views).includes('home')"
          :showing="currentView == 'home'"
        />
      </div>
    </div>
</template>

<script>
import TopBar from "./TopBar.vue";
import Home from "./Home.vue";

export default {
  data() {
    return {
      currentView: "home",
      views: {
        home: {
          allowed: () => true
        }
      }
    };
  },
  methods: {
    show(view) {
      this.currentView = view;
    }
  },
  props: {
    isActive: Boolean,
  },
  components: {
    TopBar,
    Home,
  }
};
</script>

<style>
#dashboardcontent {
  margin-top: 68px;
}
</style>
