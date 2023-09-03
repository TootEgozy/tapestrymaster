<template v-if="this.colors.length">

  <div class="colors-inputs-container">

    <div class="single-color-inputs-container" v-for="(color, i) in colors" :key="i">

      <input
          type="text"
          :class="color-name"
          v-model="colors[i].name"
      >

      <input
          type="color"
          :class="[color.alphabeticalName, 'color-input']"
          v-model="colors[i].RGB"
          @input="resetColorName"
      >
      <button @click="removeColor(color)">-</button>

    </div>

    <button
        v-if="colors.length < 6"
        class="add-color-button"
        @click="addNewColor"
    >
      +
    </button>

  </div>

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
        this.colors.splice(colorIndex, 1, color);
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

  created() {
    this.initialiseColors();
    this.$emit('colorsGenerated', this.colors);
  },

}
</script>

<style lang="scss">
.colors-inputs-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;

  .single-color-inputs-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    gap: 2px;
    margin-top: 5px;
    font-family: Arial, Helvetica, sans-serif;
    background-color: lightblue;
    padding: 5px;

    .color-input {
      width: 25px;
      height: 25px;
    }

  }
  .add-color-button {
    padding: 4px 15px;
    background-color: lightgray;
    border: 1px solid gray;
    border-radius: 5px;
    font-size: 20px;
    margin-top: 5px;

  }
}

</style>