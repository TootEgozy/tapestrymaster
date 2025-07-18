<template>

  <div class="colors-inputs-container">

    <div class="single-color-inputs-container"
         v-for="(color, i) in colors"
         :key="i"
         :ref="`colors-elements`"
         @click="colorSelected(i)"
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

      <button @click.stop="removeColor(color)">-</button>

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
      selectedColorIndex: 0,
      selectedColor: {},
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
      return {
        order,
        id: uuid(),
        genericName: `color${letter}`,
        name: color.name,
        RGB: color.RGB,
      };
    },

    // called once on page load to generate 2 random colors for canvas
    async initialiseColors() {
      const colorA = this.generateColor(0);
      const colorB = this.generateColor(1);
      const newColors = [colorA, colorB];
      newColors.forEach((color) => this.colors.push(color));
      this.selectedColor = newColors[1];
      this.selectedColorIndex = 1;
      this.$emit('changeColor', this.selectedColor);
    },

    colorSelected(newColorIndex) {
      this.selectedColor = this.colors[newColorIndex];
      this.passFocusClass(newColorIndex, this.selectedColorIndex);
      this.selectedColorIndex = newColorIndex;
      this.$emit('changeColor', this.selectedColor);
    },

    passFocusClass(newColorIndex, oldColorIndex) {
      this.$refs[`colors-elements`][oldColorIndex]?.classList.remove('focus');
      this.$refs[`colors-elements`][newColorIndex]?.classList.add('focus');
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
      const selectedRemoved = toRemoveIndex === this.selectedColorIndex;
      this.colors.splice(toRemoveIndex, 1);
      this.resetColorsGenericNames();
      this.$nextTick(() => {
        if(selectedRemoved || this.colors.length === 1) {
          this.colorSelected(0);
        } else if (this.colors.length === 0) {
          this.selectedColor = {};
          this.selectedColorIndex = -1;
        }
      });
    },

    addNewColor() {
      const newColor = this.generateColor(this.colors.length > 0 ? this.colors.length : 1);
      this.colors.push(newColor);
      if(this.colors.length === 1) {
        this.$nextTick(() => this.colorSelected(0));
      }
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

  async mounted() {
    await this.initialiseColors();
    this.passFocusClass(1, 0);
    this.$emit('colorsGenerated', this.colors);
    this.$emit('colorSelected', this.colors[1]);
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
  box-sizing: border-box;

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

  .focus {
    border: 3px solid black;
  }
}

</style>