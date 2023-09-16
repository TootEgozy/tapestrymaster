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

  data() {
    return {
      tableData: undefined,
      condensedTableData: undefined,
      tableRows: [],
    }
  },

  methods: {
    readDrawingTable() {
      const tableData = {};
      const table = document.getElementById("drawing-table");
      let columnsNumber = undefined;
      Array.from(table.rows).reverse().forEach((tr) => {
        const rowOrder = tr.getAttribute("order");
        const rowSide = tr.getAttribute("side");
        const cells = Array.from(tr.cells).map((cell) => cell.classList[0]);
        tableData[rowOrder] = {
          cells: rowOrder % 2 === 0 ? cells : cells.reverse(),
          side: rowSide,
        }
        if(!columnsNumber) columnsNumber = cells.length;
      });
      tableData[0] = ["ch", Number(columnsNumber) + 1];
      this.tableData = tableData;
    },
    condenseTableData() {
      this.condensedTableData = Object.keys(this.tableData).map((rowNumber) => {
        const rowData = this.tableData[rowNumber];
        if (!rowData.cells) return this.tableRows.push(`${rowNumber}: ${rowData[0]} ${rowData[1]}`);
        const condensedCellData = condenseArray(rowData.cells);
        const rowDataString = `${rowNumber}: ${rowData.side}: ${condensedCellData.toString()}`
        this.tableRows.push(rowDataString);
        rowData.cells = condensedCellData;
      });
    }
  },

  mounted() {
    this.readDrawingTable();
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