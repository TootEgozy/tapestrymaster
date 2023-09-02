<template>
  <td :class="currentColor">
<!--      @click.prevent="toggleColor"-->
<!--      @mouseover.prevent="handleMouseOver"-->
  </td>
</template>

<script>
export default {
  name: 'TableCell',

  props: ['colors', 'mousedown'],

  data() {
    return {
      colorA: undefined,
      colorB: undefined,
      currentColor: 'blue',
    }
  },

  methods: {
    // toggleColor() {
    //   this.currentColor = this.currentColor === this.colorA ? this.colorB : this.colorA;
    // },
    // resetColor() {
    //   this.currentColor = this.colorA;
    // },
    // handleMouseOver() {
    //   if(this.mousedown) this.toggleColor();
    // }
  },

  mounted() {
    console.log('cell mounted');
    // console.log('colors in cell');
    // console.log(this.colors)
    //this.currentColor = this.colors[0];
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