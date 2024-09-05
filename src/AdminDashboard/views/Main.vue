<template>
    <div class="view-content" v-show="isActive">
      <TopBar />
      <div id="dashboardcontent">
        <Home
          v-if="Object.keys(views).includes('home')"
          :showing="currentView == 'home'"
        />
        <Publish
          v-if="Object.keys(views).includes('publish')"
          :showing="currentView == 'publish'"
        />
        <Alerts
          v-if="Object.keys(views).includes('alerts')"
          :showing="currentView == 'alerts'"
        />
        <Slides
          v-if="Object.keys(views).includes('slides')"
          :showing="currentView == 'slides'"
        />
        <Access
          v-if="Object.keys(views).includes('access')"
          :showing="currentView == 'access'"
        />
      </div>
    </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import Home from "./Home.vue";
import Publish from "./Publish.vue";
import Alerts from "./Alerts.vue";
import Slides from "./Slides.vue";
import Access from "./Access.vue";

export default {
  data() {
    return {
      currentView: "home",
      views: {
        home: {
          allowed: () => true
        },
        publish: {
          allowed: () => true
        },
        alerts: {
          allowed: () => true
        },
        slides: {
          allowed: () => true
        },
        access: {
          allowed: () => true
        },
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
    Publish,
    Alerts,
    Slides,
    Access,
  }
};
</script>

<style>
#dashboardcontent {
  margin-top: 68px;
}

.dashboardPageTitle {
  font-size: 35px;
  margin-bottom: 40px;
}

.dashboardPage {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
}
</style>
