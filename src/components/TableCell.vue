<template>
  <td
      :style="{ backgroundColor: currentColor.RGB}"
      :class="currentColor.alphabeticalName"
      @click.prevent="changeColor"
      @mouseover.prevent="handleMouseOver"
  >
  </td>
</template>

<script>

export default {
  name: 'TableCell',

  props: ['colors', 'mousedown'],

  data() {
    return {
      colorIndex: 0,
      currentColor: { RGB: '000000'},
    }
  },

  methods: {
    changeColor() {
      this.colorIndex = (this.colorIndex === this.colors.length - 1) ? 0 : this.colorIndex + 1;
      this.currentColor = this.colors[this.colorIndex];
    },
    resetColor() {
      this.currentColor = this.colors[0];
    },
    handleMouseOver() {
      if(this.mousedown) this.changeColor();
    }
  },

  watch: {
    'colors.length': function(length, prevLength) {
      // if a color was deleted, check if the cell's color is in the list. if not, update it to colorA.
      if(length < prevLength) {
        // const colorDeleted = this.colors.find(() => {})
      }
    },
  },

  mounted() {
    this.currentColor = this.colors[this.colorIndex];
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