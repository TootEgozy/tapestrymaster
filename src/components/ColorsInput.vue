<template>

  <div class="colors-inputs-container">

    <div
        class="single-color-inputs-container"
        v-for="(color, i) in colors" :key="color.id"
        @click.stop.prevent="selectColor"
        :id="color.id"
    >

      <input
          v-if="displayColorNames"
          type="text"
          :class="'color-name'"
          v-model="colors[i].name"
      >

      <p v-if="!this.displayColorNames">
        {{color.genericName}}
      </p>

      <input
          type="color"
          :class="[color.genericName, 'color-input']"
          v-model="colors[i].RGB"
      >

      <button name="delete-color-btn" @click="removeColor(color)">-</button>

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
      {{ displayColorNames ? 'Display colors as generic' : 'Display color names'}}
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
      focusedColorId: null,
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
      return {
        order,
        id: uuid(),
        genericName: `color${letter}`,
        name: color.name,
        RGB: color.RGB,
      };
    },
    async initialiseColors() {
      const newColors = [this.generateColor(0), this.generateColor(1)];
      newColors.forEach((color) => this.colors.push(color));
      this.focusedColorId = newColors[1].id;
    },
    // resetColorName(e) {
    //   const colorIndex = this.colors.findIndex((color) => color.genericName === e.target.className);
    //   if(colorIndex > -1) {
    //     const color = this.colors[colorIndex];
    //     color.name = undefined;
    //     this.colors.splice(colorIndex, 1, color);
    //   }
    // },
    resetColorsGenericNames() {
      this.lastLetterCode = 65;
      this.colors = this.colors.map((color) => {
        color.genericName = `color${String.fromCharCode(this.lastLetterCode)}`;
        this.lastLetterCode++
        return color;
      });
    },
    removeColor(colorToRemove) {
      const toRemoveIndex = this.colors.findIndex((color) => color.id === colorToRemove.id);
      this.colors.splice(toRemoveIndex, 1);
      this.resetColorsGenericNames();
      if(colorToRemove.id === this.focusedColorId) this.focusOnColor(this.colors[0]);
    },
    addNewColor() {
      const newColor = this.generateColor(this.colors.length > 0 ? this.colors.length : 1);
      this.colors.push(newColor);
    },
    toggleColorNames() {
      this.displayColorNames = !this.displayColorNames;
    },
    removeFocusClass() {
      const allColorInputContainers = document.getElementsByClassName("single-color-inputs-container");
      Object.values(allColorInputContainers).forEach((element) => element.classList.remove('focus'));
    },
    focusOnColor(color, colorInputElement) {
      let element = colorInputElement;
      if(!colorInputElement) {
        element = document.getElementById(this.colors[0].id);
      }
      element.classList.add("focus");
      this.focusedColorId = color.id;
      this.$emit('colorSelected', color);
    },
    selectColor(e) {
      if(e.target.name === "delete-color-btn") return;
      if(Object.values(e.target.classList).includes("focus")) return;
      const inputContainer = e.target.className === "single-color-inputs-container" ? e.target : e.target.parentElement;
      const color = this.colors.find((c) => c.id === inputContainer.id);
      this.removeFocusClass();
      this.focusOnColor(color, inputContainer);
    },
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

.focus {
  border: 2px solid black;
}

</style>