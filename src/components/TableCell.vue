<template>
  <td
      :id="generateId()"
      :style="{ backgroundColor: currentColor.RGB}"
      :class="currentColor.genericName"
      v-bind:data-name = "currentColor.name"
      @click.prevent="changeColor"
      @mouseover.prevent="handleMouseOver"
  >
  </td>
</template>

<script>

import {v4 as uuid} from 'uuid';

export default {
  name: 'TableCell',

  props: ['colors', 'mousedown', 'initialMouseColor'],

  data() {
    return {
      colorIndex: 0,
      currentColor: { RGB: '000000'},
      mouseColor: this.initialMouseColor,
    }
  },

  methods: {
    generateId() {
      return uuid();
    },
    changeColor() {
      this.currentColor = this.mouseColor;
    },
    resetColor() {
      this.currentColor = this.colors[0];
    },
    handleMouseOver() {
      if(this.mousedown) this.changeColor();
    },
    setMouseColor(color) {
      this.mouseColor = color;
    }
  },

  watch: {
    'colors.length': function() {
      const currentColorDeleted = !this.colors.find((color) => color.id === this.currentColor.id);
      const mouseColorDeleted = !this.colors.find((color) => color.id === this.mouseColor.id);
      if(currentColorDeleted) this.currentColor = this.colors[0];
      if(mouseColorDeleted) this.mouseColor = this.colors[0];
      this.colorIndex = this.colors.findIndex((color) => color.id === this.currentColor.id);
    },
  },

  mounted() {
    this.currentColor = this.colors[this.colorIndex];
    this.mouseColor = this.initialMouseColor || this.colors[this.colorIndex];
  },

}
</script>

<style lang="scss">
 td {
    border: solid 2px black;
 }
  .blue {
    background-color: blue;
  }
  .orange {
    background-color: orange;
  }
</style>