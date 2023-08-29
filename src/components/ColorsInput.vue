<template>

  <div class="colors-input-container" :v-if="colors.length">

    <div id="colors-input" :v-for="(color, i) in colors">
      <label for="color">color{{color}}</label>
      <input
          type="color"
          class="`color${color.letter}`"
          v-model="newColor"
      >
    </div>

  </div>

</template>

<script>

import { namedColors } from "@/utils/namedColors.js";

export default {

  name: 'ColorsInput',

  data() {
    return {
      colors: [],
      newColor: undefined,
      availableLetters: Array.from(Array(26)).map((e, i) => i + 65).map((n) => String.fromCharCode(n)),
      availableColors: namedColors,
    }
  },

  methods: {

    randomiseIndex(max) {
        return Math.round(Math.random() * max);
    },

    getColorOrder() {
      if(!this.colors.length) return 0;
      return this.colors[this.colors.length - 1].order + 1;
    },

    generateColor(order) {
      const letter = this.availableLetters.splice(0, 1);
      const colorIndex = this.randomiseIndex(this.availableColors.length - 1);
      const color = this.availableColors.splice(colorIndex, 1)[0];
      return {
        order,
        alphabeticalName: letter,
        name: color.name,
        RGB: color.RGB,
      }
    },

    initialiseColors() {
      this.availableColors = this.availableColors.length ? this.availableColors : namedColors;
      const newColors = [this.generateColor(0), this.generateColor(1)];
      newColors.forEach((color) => this.colors.push(color));
    },
  },

  mounted() {
    this.initialiseColors();
  },

  beforeUpdate() {
    if(this.colors.length < 2) {
      // this.initialiseColors();
    }
  }
}
</script>

<style lang="scss">
#colors-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: Arial, Helvetica, sans-serif;
}
</style>