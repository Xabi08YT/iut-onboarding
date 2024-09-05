<script setup>

import enabledViews from "../../enabledViews.json";
import fs from "fs";

</script>

<template>
    <div class="viewParams">
        <div class="viewParams-top">
            <h1>{{ strUcFirst(slideName) }}</h1>
            <div class="viewParams-top-right">
                <label class="switch">
                    <input type="checkbox" :checked="enabledViews[slideName]" v-on:click="toggleShowing()">
                    <span class="slider round"></span>
                </label>
                <label class="deploy" v-show="hasParams">
                    <img src="../assets/add-plus-svgrepo-com.svg" class="icon" v-if="!showBody">
                    <img src="../assets/substract-minus-remove-svgrepo-com.svg" class="icon" v-if="showBody">
                    <input type="checkbox" v-on:change="toggleShowParams()">
                </label>
            </div>
        </div>
        <div class="viewParams-body" v-if="hasParams" v-show='showBody'>
            <p>Coucou</p>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      showBody:false,
    };
  },
  methods: {
    toggleShowParams() {
      this.showBody = !this.showBody;
    },
    toggleShowing() {
      enabledViews[this.slideName] = !enabledViews[this.slideName];
      fs.writeFile("../../generalBackend/enabledViews.json", JSON.stringify(this.enabledViews, null, 4));
    },
    strUcFirst(a) {
      return `${(`${a}`).charAt(0).toUpperCase()}${(`${a}`).substr(1)}`;
    }
  },
  props: {
    hasParams: Boolean,
    slideName: String
  }
};
</script>

<style>
.viewParams {
    min-width: 800px;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  top: 5px;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #FF0000;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #00FF00;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.viewParams {
  margin-top: 10px;
  min-width: 800px;

  background-color: white;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.25);

  color: rgb(73, 72, 72);

  line-height: 43px;

  font-size: 25px;
  font-weight: 800;
  padding: 20px 20px;
  border-radius: 30px;
}

.viewParams-top h1 {
    margin-top: 2px;
    width: 199px;
    text-align: left;
}

.viewParams-top {
  display: flex;
  flex-direction: row;
}

.viewParams-top-right {
    position: relative;
    left: 57%;
}

.viewParams-top-right img.icon {
    position: relative;
    left: 33%;
    top: 17%
}

.viewParams-top-right input {
    visibility: hidden;
}
</style>
