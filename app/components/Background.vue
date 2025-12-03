<template>
  <div
      :style="`background-color: ${colors[currentColor]};`"
      id="background-container"
  >
    <transition
        v-for="(deco, index) in decorations[currentDecoration] || []"
        :key="index"
        :name="deco.transition"
    >
      <img
          v-if="deco.show"
          :src="deco.svg"
          :style="deco.posStyle"
          :class="deco.class"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { DecorationItem, DecorationsMap } from "../../types/decoration";
import circle from "../public/assets/circle.svg";
import path1 from "../public/assets/path1.svg";
import path2 from "../public/assets/path2.svg";
import path3 from "../public/assets/path3.svg";
import snow1 from "../public/assets/snow1.svg";
import snow2 from "../public/assets/snow2.svg";
import snow3 from "../public/assets/snow3.svg";
import wave1 from "../public/assets/wave1.svg";
import wave2 from "../public/assets/wave2.svg";
import wave3 from "../public/assets/wave3.svg";
import wave4 from "../public/assets/wave4.svg";

export default {
  data() {
    return {
      colors: ["#91E59B", "#A391E5", "#91C5E5"],
      currentColor: 0,
      currentDecoration: "snow",
      decorations: {
        circles: [
          {
            svg: circle,
            posStyle: "left: 500px; width: 100px",
            transition: "slide-left",
            show: false,
            class: "full-height",
          },
          {
            svg: circle,
            posStyle: "top: 10px; left: 100px; width: 300px",
            transition: "slide-top",
            show: false,
            class: "full-width",
          },
          {
            svg: circle,
            posStyle: "right: 100px; width: 200px",
            transition: "slide-right",
            show: false,
            class: "full-height",
          },
          {
            svg: circle,
            posStyle: "bottom: 10px; right: 100px; width: 300px",
            transition: "slide-bottom",
            show: false,
            class: "full-width",
          },
          {
            svg: circle,
            posStyle: "bottom: 100px; left: 50px; width: 60px",
            transition: "slide-bottom",
            show: false,
            class: "full-width",
          },
        ] as DecorationItem[],
        lines: [
          {
            svg: path1,
            posStyle: "left: -300px;",
            transition: "slide-left",
            show: false,
            class: "full-height",
          },
          {
            svg: path2,
            posStyle: "right: -300px; bottom: -50vh;",
            transition: "slide-right",
            show: false,
            class: "full-height",
          },
          {
            svg: path3,
            posStyle: "right: -300px;",
            transition: "slide-right",
            show: false,
            class: "full-height",
          },
        ] as DecorationItem[],
        waves: [
          {
            svg: wave2,
            posStyle: "bottom: 0",
            transition: "slide-bottom",
            show: false,
            class: "full-width opaque",
          },
          {
            svg: wave1,
            posStyle: "bottom: 0;",
            transition: "slide-bottom",
            show: false,
            class: "full-width opaque",
          },
          {
            svg: wave3,
            posStyle: "top: 0;",
            transition: "slide-top",
            show: false,
            class: "full-width opaque",
          },
          {
            svg: wave4,
            posStyle: "top: 0;",
            transition: "slide-top",
            show: false,
            class: "full-width opaque",
          },
        ] as DecorationItem[],
        snow: [
          {
            svg: snow1,
            posStyle: "height: 40vh; position: absolute; left: 0; top: 0;",
            transition: "slide-left",
            show: false,
            class: "snow",
          },
          {
            svg: snow2,
            posStyle: "right: 0; bottom: 0;",
            transition: "slide-right",
            show: false,
            class: "snow",
          },
          {
            svg: snow3,
            posStyle: "right: 0; top: 0;",
            transition: "slide-top",
            show: false,
            class: "snow",
          },
        ] as DecorationItem[],
      } as DecorationsMap,
    };
  },
  methods: {
    delay: (t: number) => new Promise((resolve) => setTimeout(resolve, t)),

    /**
     * Change the current background color
     *
     * @param color color to go to
     * @default null go to next color
     */
    changeBackgroundColor(color: number|null = null) {
      if (color != null) {
        // If we use a custom color given by the parameter
        this.currentColor = color;
        return;
      } else if (Number.isNaN(this.currentColor)) {
        // If we switch back to a non custom color
        this.currentColor = 0;
        return;
      }
      // Color loop over the array
      if (++this.currentColor >= this.colors.length) this.currentColor = 0;
    },

    /**
     * Change the current background decoration style
     *
     * @param style style to go to
     * ("line" / "waves" / undefined = no decoration)
     *
     * @default null go to next decoration style
     */
    async changeDecoration(style = null) {
      // disable all decorations
      for (const deco of Object.values(this.decorations) as DecorationItem[]) {
        for (const item in deco) {
          await this.delay(Math.random() * 200);
          deco[item].show = false;
        }
      }

      if (style !== null) {
        // using strict equality so we can use undefined in the case we just want to disable decorations
        this.currentDecoration = style;
      } else {
        // changing to next style
        const styles = Object.keys(this.decorations);
        this.currentDecoration =
            styles[styles.indexOf(this.currentDecoration) + 1] || styles[0];
      }

      // enable only the desired decoration
      for (const [decoName, deco] of Object.entries(this.decorations) as [string, DecorationItem[]][]) {
        for (const item of deco) {
          await this.delay(Math.random() * 200);
          item.show = this.currentDecoration === decoName;
        }
      }
    },

    /**
     * Change to next background
     * (Switch color and decoration style)
     */
    next() {
      this.changeBackgroundColor();
      this.changeDecoration();
    },
  },
};
</script>

<style scoped>
/*
Vue transition styles, see https://vuejs.org/v2/guide/transitions.html
*/
.slide-left-leave-active {
  animation: slide-left 0.5s cubic-bezier(0.29, 1.68, 0.26, 0.84) reverse;
}
.slide-left-enter-active {
  animation: slide-left 0.5s cubic-bezier(0.29, 1.68, 0.26, 0.84);
}
.slide-right-leave-active {
  animation: slide-right 0.5s cubic-bezier(0.29, 1.68, 0.26, 0.84) reverse;
}
.slide-right-enter-active {
  animation: slide-right 0.5s cubic-bezier(0.29, 1.68, 0.26, 0.84);
}
.slide-top-leave-active {
  animation: slide-top 0.5s ease-in reverse;
}
.slide-top-enter-active {
  animation: slide-top 0.5s ease-in-out;
}
.slide-bottom-leave-active {
  animation: slide-bottom 0.5s ease-in reverse;
}
.slide-bottom-enter-active {
  animation: slide-bottom 0.5s ease-in-out;
}

@keyframes slide-left {
  0% {
    transform: translateX(-50vw);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slide-right {
  0% {
    transform: translateX(50vw);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slide-top {
  0% {
    transform: translateY(-50vw);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slide-bottom {
  0% {
    transform: translateY(50vw);
  }
  100% {
    transform: translateX(0);
  }
}

#background-container {
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: -10;

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  transition: background-color 1s;
  transition-delay: 1s;
}

.full-height {
  position: absolute;
  height: 120vh;
}

.full-width {
  position: absolute;
  width: 100vw;
}

.opaque {
  opacity: 0.3;
}

.snow {
  height: 40vh;
  position: absolute;
  opacity: 0.6;
}
</style>
