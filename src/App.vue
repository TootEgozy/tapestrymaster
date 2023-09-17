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

      <ColorsInput :ref="'colorsInputRef'" @colorsGenerated="setGeneratedColors" />

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
      <button @click="closePrintWindow"> download or print </button>
    </div>

    <InstructionsTable v-if="displayInstructions" />

    <WindowPortal
        v-if="printWindowOpen"
        :open="printWindowOpen"
        @close="printWindowOpen = false"
    >
      <PrintOrDownloadWindow :title="projectTitle" />
    </WindowPortal>

  </div>
</template>

<script>
import DrawingTable from "@/components/DrawingTable.vue";
import InstructionsTable from "@/components/InstructionsTable.vue";
import ColorsInput from "@/components/ColorsInput.vue";
import WindowPortal from "@/components/WindowPortal.vue";
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
    closePrintWindow() {
      console.log('got closing event from print window');
      this.printWindowOpen = true
    }

  },

  components: {
    DrawingTable,
    InstructionsTable,
    ColorsInput,
    WindowPortal,
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
