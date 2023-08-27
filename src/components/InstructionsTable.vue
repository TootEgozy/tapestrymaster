<template>
  <div class="instructions-table-container">
    <h3>Instructions:</h3>
    <table>
      <tr v-for="(row, i) in tableRows" :key="i">
        <td>{{ row }}</td>
      </tr>
    </table>
  </div>
</template>

<script>

import { condenseArray } from "@/utils/condenseArray";

export default {
  name: 'InstructionsTable',

  props: ['tableData'],

  data() {
    return {
      condensedTableData: undefined,
      tableRows: [],
    }
  },

  watch: {
    // rows: 'regenerateTable',
  },

  methods: {
    condenseTableData() {
      this.condensedTableData = Object.keys(this.tableData).map((rowNumber) => {
        const rowData = this.tableData[rowNumber];
        if (!rowData.cells) return rowData;
        const condensedCellData = condenseArray(rowData.cells);
        const rowDataString = `${rowNumber}: ${rowData.side}: ${condensedCellData.toString()}`
        this.tableRows.push(rowDataString);
        rowData.cells = condensedCellData;
        return rowData;
      });
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

.instructions-table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1vh 1vw 1vh 1vw;
  table {
    border-collapse: collapse;
    border: 1px solid orange;
    td {
      border: none;
      text-align: left;
      padding: 5px;
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