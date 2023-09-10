<template>
  <div class="app-body">

    <div class="inputs-container">
      <p>
        Insert the desired measurements for your project
      </p>

      <div id="columns-rows-input">
        <label for="rows">rows:</label>
        <input type="number" min="0" id="rows" v-model="rowsNumber" />
        <label for="columns">columns:</label>
        <input type="number" min="0" id="columns" v-model="columnsNumber"/>
      </div>

      <ColorsInput :ref="'colorsInputRef'"  @colorsGenerated="setGeneratedColors" />

    </div>

    <DrawingTable
        v-if="colors.length > 0"
        :rows="rowsNumber"
        :columns="columnsNumber"
        :colors="colors"
        :ref="'drawingTableRef'"
    />

    <div class="table-buttons">
      <button @click="readTable"> read table </button>
      <button @click="resetColor"> reset </button>
      <button @click="createPrintableTable"> print </button>
    </div>

    <InstructionsTable
        v-if="displayInstructions"
        :tableData="tableData"
    />

  </div>
</template>

<script>
import DrawingTable from "@/components/DrawingTable.vue";
import InstructionsTable from "@/components/InstructionsTable.vue";
import ColorsInput from "@/components/ColorsInput.vue";

export default {
  name: "App",

  data() {
    return {
      rowsNumber: 1,
      columnsNumber: 1,
      generated: false,
      colors: [],
      displayInstructions: false,
      tableData: undefined,
    };
  },

  methods: {
    readTable() {
      const tableData = {};
      const table = document.getElementById("drawing-table");
      Array.from(table.rows).reverse().forEach((tr) => {
        const rowOrder = tr.getAttribute("order");
        const rowSide = tr.getAttribute("side");
        const cells = Array.from(tr.cells).map((cell) => cell.classList[0]);
        tableData[rowOrder] = {
          cells: rowOrder % 2 === 0 ? cells : cells.reverse(),
          side: rowSide,
        }
      });
      // TODO: fix this (not showing)
      tableData['first'] = ["ch", Number(this.columnsNumber) + 1];
      this.tableData = tableData;
      this.toggleShowInstructions();
    },
    resetColor() {
      this.$refs[`drawingTableRef`].resetCellsColor();
    },
    toggleShowInstructions () {
      this.displayInstructions = !this.displayInstructions;
    },
    setGeneratedColors(colorsFromInput) {
      this.colors = colorsFromInput;
    },

    createPrintableTable() {
      const printWindow = window.open('', '', 'width=600,height=600');
      printWindow.document.open();
      printWindow.document.write('<html><head><title>Printable Drawing</title>');
      printWindow.document.write('</head><body>');

      const printableTable = document.createElement('table');
      const currentTable = document.getElementById('drawing-table');

      currentTable.querySelectorAll('tr').forEach((row) => {
        const printableRow = document.createElement('tr');
        row.querySelectorAll('td').forEach((cell) => {
          const printableCell = document.createElement('td');
          printableCell.innerHTML = cell.innerHTML;
          printableCell.style.backgroundColor = window.getComputedStyle(cell).backgroundColor;
          printableRow.appendChild(printableCell);
        });
        printableTable.appendChild(printableRow);
      });

      printWindow.document.write(printableTable.outerHTML);
      printWindow.document.write('</body></html>');
      console.log(printWindow.document);

      setTimeout(() => {
        printWindow.print();
        printWindow.document.close();
        printWindow.close();
      }, 1000);
    },

  },

  components: {
    DrawingTable,
    InstructionsTable,
    ColorsInput,
  }

};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  #columns-rows-input {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: Arial, Helvetica, sans-serif;
  }
}
</style>
