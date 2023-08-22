<template>
  <div class="instructions-table-container">
    <h3>Instructions:</h3>
    <table>

    </table>
  </div>
</template>

<script>

import {condenseArray} from "../utils/condenseArray";

export default {
  name: 'InstructionsTable',

  props: ['tableData'],

  data() {
    return {
      condensedTableData: undefined,
    }
  },

  watch: {
    // rows: 'regenerateTable',
  },

  methods: {
    condenseTableData() {
      this.condensedTableData = this.tableData.map((rowData) => {
        if (!rowData.cells) return rowData;
        const condensedCellData = condenseArray(rowData.cells);
        rowData.instructions = condensedCellData;
        return rowData;
      });
      console.log(this.condensedTableData);
    }
  },

  mounted() {
    this.condenseTableData();
  },

  components: {
  }

}
</script>

<style lang="scss">

/* TODO: make the td a fixed square (in relation to width or length or whatever) and the table width and height dynamic */
.table-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1vh 1vw 1vh 1vw;
  background-color: aqua;
  table {
    min-width: 50vw;
    min-height: 50vh;
    border-collapse: collapse;
    td {
      border: solid 2px black;
    }
    .blue {
      background-color: blue;
    }
    .orange {
      background-color: orange;
    }
  }
}

</style>