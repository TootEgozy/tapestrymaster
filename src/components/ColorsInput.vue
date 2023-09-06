<template>

  <div class="colors-inputs-container" v-if="this.colors.length">

    <div class="single-color-inputs-container" v-for="(color, i) in colors" :key="i">

      <input
          v-if="displayColorNames"
          type="text"
          :class="'color-name'"
          v-model="colors[i].name"
      >

      <p
          v-if="!this.displayColorNames"
      >
        {{color.alphabeticalName}}
      </p>

      <input
          type="color"
          :class="[color.alphabeticalName, 'color-input']"
          v-model="colors[i].RGB"
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

    <button
        @click="toggleColorNames"
    >
      {{ displayColorNames ? 'Display colors as general' : 'Display specific colors'}}
    </button>

  </div>

</template>

<script>
import { v4 as uuid } from 'uuid';
import { namedColors } from "@/utils/namedColors.js";

export default {

  name: 'ColorsInput',

  data() {
    return {
      colors: [],
      lastLetterCode: 65,
      availableColors: namedColors,
      displayColorNames: true,
    }
  },

  methods: {
    randomiseIndex(max) {
        return Math.round(Math.random() * max);
    },
    generateColor(order) {
      const letter = String.fromCharCode(this.lastLetterCode);
      const colorIndex = this.randomiseIndex(this.availableColors.length - 1);
      const color = this.availableColors.splice(colorIndex, 1)[0];
      this.lastLetterCode++;
      const colorObj = {
        order,
        id: uuid(),
        alphabeticalName: `color${letter}`,
        name: color.name,
        RGB: color.RGB,
      };
      return colorObj;
    },
    async initialiseColors() {
      const newColors = [this.generateColor(0), this.generateColor(1)];
      newColors.forEach((color) => this.colors.push(color));
    },
    // resetColorName(e) {
    //   const colorIndex = this.colors.findIndex((color) => color.alphabeticalName === e.target.className);
    //   if(colorIndex > -1) {
    //     const color = this.colors[colorIndex];
    //     color.name = undefined;
    //     this.colors.splice(colorIndex, 1, color);
    //   }
    // },
    removeColor(colorToRemove) {
      // with removing a color we also need to update the order and alphabetical name for all the colors
      // we also need to add letters to availableLetters
      const toRemoveIndex = this.colors.findIndex((color) => color.id === colorToRemove.id);
      this.colors.splice(toRemoveIndex, 1);
      const removedLetterCharCode = colorToRemove.alphabeticalName[5].charCodeAt(0);
      this.colors = this.colors.map((color) => {
        const colorLetterCharCode = color.alphabeticalName[5].charCodeAt(0);
        if(colorLetterCharCode > removedLetterCharCode) {
          color.alphabeticalName = `color${String.fromCharCode(colorLetterCharCode - 1)}`;
        }
        return color;
      });
    },
    addNewColor() {
      const newColor = this.generateColor(this.colors.length > 0 ? this.colors.length : 1);
      this.colors.push(newColor);
    },
    getColors () {
      return this.colors;
    },
    toggleColorNames() {
      this.displayColorNames = !this.displayColorNames;
    }
  },

  watch: {
    'colors.length': function () {
      this.$emit('colorsGenerated', this.colors);
    }
  },

  mounted() {
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