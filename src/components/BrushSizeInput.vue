<template>
  <div id="brush-size-input-container">
    <span class="brush-size-label">Brush Size:</span>
    <button
        :class="{ focus: brushSize === 1 }"
        @click="changedBrushSize(1)"
    >s</button>

    <button
        v-if="maxBrushSize >= 2"
        :class="{ focus: brushSize === 2 }"
        @click="changedBrushSize(2)"
    >m</button>

    <button
        v-if="maxBrushSize >= 3"
        :class="{ focus: brushSize === 3 }"
        @click="changedBrushSize(3)"
    >l</button>

    <button
        v-if="maxBrushSize >= 4"
        :class="{ focus: brushSize === 4 }"
        @click="changedBrushSize(4)"
    >xl</button>
  </div>
</template>

<script>
export default {
  name: "BrushSizeInput",
  props: ['rows', 'columns'],
  data() {
    return {
      brushSize: 1
    }
  },
  computed: {
    maxBrushSize() {
      const minSide = Math.min(this.rows, this.columns);
      if (minSide <= 2) return 1;
      if (minSide <= 4) return 2;
      if (minSide <= 5) return 3;
      return 4;
    }
  },

  watch: {
    maxBrushSize(newVal, oldVal) {
      if(newVal < oldVal) {
        this.changedBrushSize(newVal);
      }
    }
  },

  methods: {
    changedBrushSize(newSize) {
      this.brushSize = newSize;
      this.$emit("brushSizeSelected", newSize);
    }
  }
};
</script>

<style scoped>
.focus {
  border: 2px solid black;
}

.brush-size-label {
  padding-right: 1rem;
}
</style>