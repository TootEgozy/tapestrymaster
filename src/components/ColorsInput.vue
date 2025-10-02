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
          @input="$emit('colorNameChanged')"
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

  props: ['rawColors'],

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

    generateColor(order, colorFromPalette=undefined) {
      const letter = String.fromCharCode(this.lastLetterCode);
      const colorIndex = this.randomiseIndex(this.availableColors.length - 1);
      const color = colorFromPalette || this.availableColors.splice(colorIndex, 1)[0];
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
      const refs = this.$refs['colors-elements'];
      const elements = Array.isArray(refs) ? refs : [refs];

      elements[oldColorIndex]?.classList.remove('focus');
      elements[newColorIndex]?.classList.add('focus');
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
      this.$emit('toggleDisplayColorNames');
    },

    rgbToColorName([r, g, b]) {

      const rgbString = `${r}${g}${b}`;
      // Normalize to 0–1
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // gray
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
      }

      let colorName = '';

      // Now decide based on HSL
      if (s < 0.15 && l < 0.2) colorName = "black";
      else if (s < 0.15 && l > 0.8) colorName = "white";
      else if (s < 0.15) colorName = "gray";

      else if (h < 15 || h >= 345) colorName = "red";
      else if (h < 45) colorName = l < 0.5 ? "brown" : "orange";
      else if (h < 65) colorName = "yellow";
      else if (h < 170) colorName = "green";
      else if (h < 200) colorName = "cyan";
      else if (h < 260) colorName = "blue";
      else if (h < 290) colorName = "purple";
      else if (h < 330) colorName = "pink";
      else colorName = "magenta";

      return `${colorName}-${rgbString}`;
    },

    rgbArrayToHex([r, g, b]) {
      return (
          "#" +
          [r, g, b]
              .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
              })
              .join("")
      );
    },

    async initializeColorsFromRaw() {
      this.colors = [];
      this.$props.rawColors.map(rc => {
        return {
          name: this.rgbToColorName(rc),
          RGB: this.rgbArrayToHex(rc),
        }
      }).forEach((c, i) => {
        const newColor = this.generateColor(i, c);
        this.colors.push(newColor);
      });
      this.selectedColor = this.colors[0];
      this.selectedColorIndex = 0;
      this.displayColorNames = false;
      this.passFocusClass(0, 1);
      this.$emit('changeColor', this.selectedColor);
    }
  },

  watch: {
    'colors.length': function () {
      this.$emit('colorsGenerated', this.colors);
    },
  },

  async mounted() {
    const colorsFromTable = this.$props.rawColors.length > 0;
    if(colorsFromTable) {
      await this.initializeColorsFromRaw();
      this.passFocusClass(0);
    } else {
      await this.initialiseColors();
      this.passFocusClass(1, 0);
    }
    this.$emit('colorsGenerated', this.colors);
    this.$emit('colorSelected', colorsFromTable ? this.colors[0] : this.colors[1]);
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