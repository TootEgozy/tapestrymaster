<template>
  <td
      :class="currentColor"
      @click="toggleColor"
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
      colorA: this.colors[0],
      colorB: this.colors[1],
      currentColor: this.colorA,
    }
  },

  methods: {
    toggleColor() {
      this.currentColor = this.currentColor === this.colorA ? this.colorB : this.colorA;
    },

    handleMouseOver() {
      if(this.mousedown) this.toggleColor();
    }

  },

  mounted() {
    this.currentColor = this.colorA;
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