<template>
  <td :class="currentColor">
<!--      @click.prevent="toggleColor"-->
<!--      @mouseover.prevent="handleMouseOver"-->
    <butto @click="console.log(this)">this</butto>
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
      currentColor: undefined,
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

  watch: {
    colors: function(newVal) {
      console.log('got colors: ', newVal);
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