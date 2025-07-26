<template>
  <div class="drawing-table-container">

    <table
        id="drawing-table"
        @mousedown="toggleMouse"
        @mouseup="dropMouse"
        @mouseleave="dropMouse"
        @dragstart="dropMouse"
    >
      <tr
          v-for="(row, rowIndex) in createArray(rows)"
          :key="row"
          :order="rows - rowIndex"
          :side="(rows - rowIndex) % 2 === 0 ? 'WS' : 'RS'"
      >
        <TableCell
            v-for="(column, columnIndex) in createArray(columns)"
            :key="column"
            :colors="colors"
            :selectedColor="selectedColor"
            :ref="`cellRef${rowIndex}-${columnIndex}`"
            :mousedown="mousedown"
            :size="cellSize + 'px'"
        />
      </tr>
    </table>

  </div>
</template>

<script>

import TableCell from "@/components/TableCell.vue";

export default {
  name: 'DrawingTable',

  props: ['rows', 'columns', 'colors', 'selectedColor'],

  data() {
    return {
      mousedown: false,
      cellSize: 0,
    }
  },

  mounted() {
    this.calculateCellSize();
    window.addEventListener("resize", this.calculateCellSize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateCellSize);
  },

  watch: {
    rows: 'regenerateTable',
    columns: 'regenerateTable',
  },

  methods: {
    createArray(length) {
      return Array.from(Array(length).keys());
    },
    calculateCellSize() {
      const maxTableSize = window.innerWidth * 0.30; // vw for minimum cell dimensions
      const maxCells = Math.max(this.rows, this.columns);
      this.cellSize = Math.floor(maxTableSize / maxCells);
    },
    regenerateTable() {
      this.calculateCellSize();
    },
    resetCellsColor() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.$refs[`cellRef${i}-${j}`][0].resetColor();
        }
      }
    },
      toggleMouse(){
        this.mousedown = !this.mousedown;
      },
      dropMouse(){
        this.mousedown = false;
      }
    },

  components: {
    TableCell,
  }

}
</script>

<style lang="scss">

.drawing-table-container {
  width: 30vw;
  height: 30vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 1rem;

  #drawing-table {
    table-layout: fixed;
    border-collapse: collapse;
    margin: 0;
    padding: 0;
  }
}

</style>