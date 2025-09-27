<template>
  <div class="app-body">

    <div class="inputs-container">
      <p>
        Insert the desired measurements for your project or
        <button @click="uploadImage()">Upload an image</button>
      </p>

      <div id="columns-rows-input">
        <label for="rows">rows:</label>
        <input type="number" min="0" id="rows" v-model="rowsNumber" />
        <label for="columns">columns:</label>
        <input type="number" min="0" id="columns" v-model="columnsNumber"/>
      </div>

      <ColorsInput
          :ref="'colorsInputRef'"
          :rawColors="rawColors"
          @colorsGenerated="setGeneratedColors"
          @changeColor="setSelectedColor"
          @toggleDisplayColorNames="toggleDisplayColorNames"
      />

    </div>

    <DrawingTable
        v-if="colors.length > 0"
        :rows="rowsNumber"
        :columns="columnsNumber"
        :colors="colors"
        :selectedColor="selectedColor"
        :ref="'drawingTableRef'"
        @click="displayInstructions = false"
    />

    <div class="table-buttons">
      <button @click="createInstructions"> create instructions </button>
      <button @click="resetColor"> reset </button>
      <button @click="openInstructionsInNewWindow">open instructions window</button>
    </div>

    <InstructionsTable
        v-if="displayInstructions"
        :tableData="tableData"
        :key="instructionsKey"
        @hideInstructions="toggleShowInstructions"
    />

  </div>
</template>

<script>
import DrawingTable from "@/components/DrawingTable.vue";
import InstructionsTable from "@/components/InstructionsTable.vue";
import ColorsInput from "@/components/ColorsInput.vue";
import ImageConverter from "@/components/ImageConverter.vue";

export default {
  name: "StudioPage",

  props: ['imageTable', 'colorPalette'],

  data() {
    return {
      rowsNumber: 1,
      columnsNumber: 1,
      generated: false,
      colors: [],
      selectedColor: {},
      displayInstructions: false,
      instructionsKey: 0,
      tableData: undefined,
      displayColorNames: true,
      rawColors: this.$props.colorPalette,
      htmlTable: this.$props.imageTable,
    };
  },

  methods: {
    createInstructions() {
      const tableData = { 0: ["ch", Number(this.columnsNumber) + 1]};
      const table = document.getElementById("drawing-table");
      Array.from(table.rows).reverse().forEach((tr) => {
        const rowOrder = tr.getAttribute("order");
        const rowSide = tr.getAttribute("side");
        const cells = Array.from(tr.cells).map((cell) => {
          if (this.displayColorNames) return cell.classList[1];
          return cell.classList[0];
        });
        tableData[rowOrder] = {
          cells: rowOrder % 2 === 0 ? cells : cells.reverse(),
          side: rowSide,
        }
      });
      this.tableData = tableData;
      if (this.displayInstructions === false) this.toggleShowInstructions();
      this.instructionsKey++;
    },
    resetColor() {
      this.$refs[`drawingTableRef`].resetCellsColor();
    },
    toggleShowInstructions () {
      this.displayInstructions = !this.displayInstructions;
    },

    toggleDisplayColorNames() {
      this.displayColorNames = !this.displayColorNames;
      if (this.displayInstructions) this.createInstructions();
    },

    setGeneratedColors(colorsFromInput) {
      this.colors = colorsFromInput;
    },

    setSelectedColor(selectedColor) {
      this.selectedColor = selectedColor;
    },

    uploadImage() {
      this.$emit("uploadImage");
    },

    openInstructionsInNewWindow() {
      if (!this.tableData) this.createInstructions();

      const instructionsHtml = `
      <html>
        <head>
          <title>Instructions</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; border: 1px solid orange; }
            td { border: none; padding: 5px; text-align: left; }
          </style>
        </head>
        <body>
          <h3>Instructions</h3>
          <table>
            ${Object.entries(this.tableData).map(([rowNumber, row]) => {
        if (row.cells) {
          const cellsStr = row.cells.join(', ');
          return `<tr><td>${rowNumber}: ${row.side}: ${cellsStr}</td></tr>`;
        } else {
          return `<tr><td>${rowNumber}: chain ${row[1]}</td></tr>`;
        }
      }).join('')}
          </table>
        </body>
      </html>
    `;

      const newWindow = window.open('', '_blank', 'width=600,height=400');
      newWindow.document.write(instructionsHtml);
      newWindow.document.close();
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

.app-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vh 0;
  gap: 2vh;
}

.inputs-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  margin-bottom: 1vh;
}

.table-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1vh;
}

#drawing-table {
  margin: 0 auto;
}

</style>
