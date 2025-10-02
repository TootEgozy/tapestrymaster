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
            :colorIdx="determineCellColorIndex(rowIndex, columnIndex)"
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
import {getBackgroundColorFromTable} from "@/utils/getBackgroundColorFromTable";

export default {
  name: 'DrawingTable',

  props: ['rowCount', 'colCount', 'colors', 'selectedColor', 'htmlTable', 'doneImgRender'],

  data() {
    return {
      mousedown: false,
      cellCount: 1,
      cellSize: 0,
      rows: this.rowCount,
      columns: this.colCount,
    }
  },

  computed: {
    fromImage() {
      return this.htmlTable instanceof HTMLTableElement
    },
  },

  mounted() {
    this.calculateCellSize();
    window.addEventListener("resize", this.calculateCellSize);

    if(this.fromImage) {
      this.rows = this.rowCountFromTable();
      this.columns = this.colCountFromTable();
      this.$emit('doneImgRender');
    }
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateCellSize);
  },

  watch: {
    rowCount(newVal) {
      this.rows = newVal
      this.calculateCellSize()
    },
    colCount(newVal) {
      this.columns = newVal
      this.calculateCellSize()
    }
  },

  methods: {
    determineCellColorIndex(ri, ci) {
      if(this.fromImage && !this.doneImgRender) {
        return this.colorIndexFromTd(ri, ci);
      }
      else if(this.fromImage) {
        return this.findBackGroundIndex();
      }  else return 0;
    },

    createArray(length) {
      return Array.from(Array(length).keys());
    },

    rowCountFromTable() {
      return this.htmlTable.rows.length;
    },

    colCountFromTable() {
      return this.htmlTable.rows[0].cells.length;
    },

    calculateCellSize() {
      const maxTableSize = window.innerWidth * 0.3; // vw for minimum cell dimensions
      let maxCells = Math.max(this.rows, this.columns);
      // if(this.fromImage) {
      //   maxCells = Math.max(this.rowCountFromTable(), this.colCountFromTable());
      // }
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
      },

    hexToRgb(hex) {
      hex = hex.replace(/^#/, '')
      if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('')
      }
      const num = parseInt(hex, 16)
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
    },

    parseRgb(str) {
      return str
          .replace(/[^\d,]/g, '')
          .split(',')
          .map(Number)
    },

    findColorIndex(target) {
      return this.colors.findIndex(color => {
        const c = this.hexToRgb(color.RGB)
        return c[0] === target[0] && c[1] === target[1] && c[2] === target[2]
      })
    },

    findBackGroundIndex() {
      const prominentColor = getBackgroundColorFromTable(this.htmlTable);
      const target = this.parseRgb(prominentColor);
      return this.findColorIndex(target);
    },

    colorIndexFromTd(rowIndex, colIndex) {
      const td = Array.from(Array.from(this.htmlTable.rows)[rowIndex].cells)[colIndex];
      const rgb = td.style.backgroundColor;
      const target = this.parseRgb(rgb)
      return this.findColorIndex(target);
    },
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