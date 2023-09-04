<template>
  <td :class="hh"
      @click.prevent="toggleColor"
      @mouseover.prevent="handleMouseOver"
  >
    <button @click="console.log(colors[colorIndex])">log current color</button>
  </td>
</template>

<script>
export default {
  name: 'TableCell',

  props: ['colors', 'mousedown'],

  data() {
    return {
      colorIndex: 0,
    }
  },

  methods: {
    toggleColor() {
      // this.currentColor = this.currentColor === this.colorA ? this.colorB : this.colorA;
    },
    resetColor() {
      this.currentColor = this.colors[0];
    },
    handleMouseOver() {
      if(this.mousedown) this.toggleColor();
    }
  },

  watch: {
    colors: function(colorsArr) {
      console.log(colorsArr[0]);
      this.currentColor = colorsArr[0];
    }
  }

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