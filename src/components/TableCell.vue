<template>
  <td
    :style="{
      backgroundColor: currentColor.RGB,
      width: size,
      height: size,
    }"
    :class="[currentColor.genericName, currentColor.name]"
    @click.prevent="changeColor"
    @mouseover.prevent="handleMouseOver"
  >
  </td>
</template>
<script>
export default {
  name: "TableCell",
  props: ["colors", "selectedColor", "mousedown", "size"],
  data() {
    return {
      colorIndex: 0,
      currentColor: { RGB: "000000" },
    };
  },
  mounted() {
    this.currentColor = this.colors[this.colorIndex];
  },
  methods: {
    changeColor() {
      this.currentColor = this.selectedColor;
    },
    resetColor() {
      this.currentColor = this.colors[0];
    },
    handleMouseOver() {
      if (this.mousedown) this.changeColor();
    },
  },
  watch: {
    'colors.length': function() {
      const currentColorDeleted = !this.colors.find((color) => color.id === this.currentColor.id);
      if(currentColorDeleted) this.currentColor = this.colors[0];
      this.colorIndex = this.colors.findIndex((color) => color.id === this.currentColor.id);
    },
  },
};
</script>


<style lang="scss" scoped>
td {
  position: relative;
  padding: 0;
  border: 1px solid black;
  width: 100%;

  &::before {
    content: "";
    display: block;
    padding-top: 100%;
  }

  > * {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>