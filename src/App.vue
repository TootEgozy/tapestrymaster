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

      <ColorsInput
          :ref="'colorsInputRef'"
          @colorsGenerated="setGeneratedColors"
          @colorSelected="handleColorSelected"
      />

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
      <button @click="showInstructions"> show instructions </button>
      <button @click="resetColor"> reset </button>
      <button @click="downloadInstructions"> download </button>
      <button @click="printInstructions"> print </button>

    </div>

    <InstructionsTable v-if="displayInstructions" />

    <WindowPortal
        v-if="PDWindowOpen"
        :open="PDWindowOpen"
        @printWindowClosed="PDWindowOpen = false"
        ref="windowPortalRef"
    >
      <PrintOrDownloadWindow
          :title="projectTitle"
          @pdwindowmounted="onPDWindowMounted"
          ref="pdWindowRef"
      />
    </WindowPortal>

  </div>
</template>

<script>
// TODO: add an emitted event for the colorInput and cell components and for the rows and columns input
// TODO: that will toggle the instructions component and re-render it if there is any change.
// TODO: think about if you want to run the whole instructions function every time or just make them disappear
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
      PDWindowOpen: false,
    };
  },

  methods: {
    showInstructions() {
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
    openPrintWindow() {
      this.PDWindowOpen = true;
    },
    closePDWindow() {
      this.$refs['windowPortalRef'].closeWindow();
      this.PDWindowOpen = false;
    },
    onPDWindowMounted() {
      this.resolverPDWindowPromise();
    },
    waitForPDWindowMount() {
      return new Promise((resolve) => {
        this.resolverPDWindowPromise = resolve;
      });
    },
    async printInstructions() {
      this.openPrintWindow();
      await this.waitForPDWindowMount();
      const windowRef = this.$refs['windowPortalRef'].getWindowRef();
      windowRef.print();
      this.closePDWindow();
    },
    async downloadInstructions() {
      this.openPrintWindow();
      await this.waitForPDWindowMount();
      await this.$refs['pdWindowRef'].downloadInstructions();
      this.closePDWindow();
    },

    handleColorSelected(color) {
      this.$refs['drawingTableRef'].setMouseColorForCell(color);
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
