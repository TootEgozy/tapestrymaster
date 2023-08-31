<template v-if="this.colors.length">

  <div class="colors-input-container" v-for="(color, i) in colors" :key="i">
      <input
          type="text"
          :class="color-name"
          v-model="colors[i].name"
      >

      <input
          type="color"
          :class="[color.alphabeticalName]"
          v-model="colors[i].RGB"
          @input="resetColorName"
      >
    <button @click="removeColor(color)">-</button>
  </div>
  <button @click="addNewColor">+</button>

</template>

<script>

import { namedColors } from "@/utils/namedColors.js";

export default {

  name: 'ColorsInput',

  data() {
    return {
      colors: [],
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
      const letter = this.availableLetters.splice(0, 1)[0];
      const colorIndex = this.randomiseIndex(this.availableColors.length - 1);
      const color = this.availableColors.splice(colorIndex, 1)[0];
      return {
        order,
        alphabeticalName: `color${letter}`,
        name:  color.name,
        RGB: color.RGB,
      }
    },
    initialiseColors() {
      this.availableColors = this.availableColors.length ? this.availableColors : namedColors;
      const newColors = [this.generateColor(0), this.generateColor(1)];
      newColors.forEach((color) => this.colors.push(color));
    },
    resetColorName(e) {
      const colorIndex = this.colors.findIndex((color) => color.alphabeticalName === e.target.className);
      if(colorIndex > -1) {
        const color = this.colors[colorIndex];
        color.name = undefined;
        this.colors.splice(colorIndex, 1, [color]);
      }
    },
    removeColor(colorToRemove) {
      const toRemoveIndex = this.colors.findIndex((color) => {
        return color.RGB === colorToRemove.RGB && color.alphabeticalName === colorToRemove.alphabeticalName
      });
      this.colors.splice(toRemoveIndex, 1);
    },
    addNewColor() {
      const newColor = this.generateColor(this.colors.length > 0 ? this.colors.length : 1);
      this.colors.push(newColor);
    },
    getColors () {
      return this.colors;
    }
  },

  mounted() {
    this.initialiseColors();
  },

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