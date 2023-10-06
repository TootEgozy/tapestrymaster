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
import { getRawTableData } from "@/utils/getRawTableData";
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

  // TODO: workflow
  // 1. write a util function to read the raw table data (this will be useful for dynamic color names) - done
  // 2. use the raw table data while reading the table - in progress: there is a bug, the cells array is empty in the reversed table
  // 3. create a drawing object in local storage and save the table data to it
  // 4. reset the drawing on reset
  // 5. update the drawing on color or dimensional change
  // 6. look for the drawing on mount and if it exist, create the table from it

  methods: {
    reverseTable(table) {
      const reversed = {}
      table.rows.reverse().forEach((tr) => {
        const cells =  tr.order % 2 === 0 ? tr.cells : tr.cells.reverse();
        console.log(cells);
        reversed[tr.order] = {
          cells: cells, // TODO: why is this empty?
          side: tr.side,
        }
      });
      console.log(reversed);
      return reversed;
    },
    readDrawingTable() {
      const reversedTable = this.reverseTable(getRawTableData());
      reversedTable[0] = ["ch", Number(reversedTable[1].cells.length) + 1];
      this.tableData = reversedTable;
      //console.log(this.tableData);
    },
    condenseTableData() {
      this.condensedTableData = Object.keys(this.tableData).map((rowNumber) => {
        const rowData = this.tableData[rowNumber];
        //console.log(rowData);
        if (!rowData.cells) return this.tableRows.push(`${rowNumber}: ${rowData[0]} ${rowData[1]}`);
        const condensedCellData = condenseArray(rowData.cells.map((cell) => cell.genericName));
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
  font-family: "Arial";
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
  }
}

</style>