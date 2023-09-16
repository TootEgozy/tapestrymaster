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

    <input type="text" v-model="projectTitle" />

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
      <button @click="this.printWindowOpen = true"> download or print </button>
    </div>

    <InstructionsTable v-if="displayInstructions" />

    <PrintOrDownloadWindow
        v-if="printWindowOpen"
        :title="projectTitle"
    />

  </div>
</template>

<script>
import DrawingTable from "@/components/DrawingTable.vue";
import InstructionsTable from "@/components/InstructionsTable.vue";
import ColorsInput from "@/components/ColorsInput.vue";
import PrintOrDownloadWindow from "@/components/PrintOrDownloadWindow.vue";

export default {
  name: "App",

  data() {
    return {
      rowsNumber: 1,
      columnsNumber: 1,
      generated: false,
      colors: [],
      projectTitle: 'Project Name',
      displayInstructions: false,
      printWindowOpen: false,
      printableDrawing: undefined,
    };
  },

  methods: {
    readTable() {
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
      // open a new window, with the title "tapastry crochet pattern: ${user title}",
      // the smaller version of the drawing, and the instructions

      // allow the user to save or print from that window
      // close the window


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
          printableCell.style.width = '50px';
          printableCell.style.height = '50px';
          printableCell.style.backgroundColor = window.getComputedStyle(cell).backgroundColor;
          printableRow.appendChild(printableCell);
        });
        printableTable.appendChild(printableRow);
      });

      printableTable.style.borderCollapse = "collapse";

      this.printableDrawing = printableTable;

      printWindow.document.write(printableTable.outerHTML);
      // printWindow.document.body.appendChild(testElement);
      printWindow.document.write('</body></html>');
      console.log(this.printableDrawing);

      // setTimeout(() => {
      //   printWindow.print({ backgroundGraphics: true });
      //   printWindow.document.close();
      //   printWindow.close();
      // }, 1000);
     // print({ backgroundGraphics: true });
    },

  },

  components: {
    DrawingTable,
    InstructionsTable,
    ColorsInput,
    PrintOrDownloadWindow,
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
