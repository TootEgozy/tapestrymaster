<template>
  <div class="app-body">
    <div class="inputs-container">
      <p>
        Insert the desired work measurements (rows, columns) and press generate
      </p>
      <div id="columns-rows-input">
        <label for="rows">rows:</label>
        <input type="number" min="0" id="rows" v-model="rowsNumber" />
        <label for="columns">columns:</label>
        <input type="number" min="0" id="columns" v-model="columnsNumber"/>
      </div>
    </div>
    <DrawingTable :rows="rowsNumber" :columns="columnsNumber" :colors="colors" />
    <button @click="readTable"> read table </button>
    <InstructionsTable
        v-if="displayInstructions"
        :tableData="tableData"
    />
  </div>
</template>

<script>
import DrawingTable from "@/components/DrawingTable.vue";
import InstructionsTable from "@/components/InstructionsTable.vue";

export default {
  name: "App",

  data() {
    return {
      rowsNumber: 1,
      columnsNumber: 1,
      generated: false,
      colors: ["blue", "orange"],
      displayInstructions: false,
      tableData: undefined,
    };
  },

  methods: {
    readTable() {
      const tableData = { 0: ["ch", Number(this.columnsNumber) + 1]};
      const table = document.getElementById("drawing-table");
      Array.from(table.rows).reverse().forEach((tr) => {
        const rowOrder = tr.getAttribute("order");
        const rowSide = tr.getAttribute("side");
        const cells = Array.from(tr.cells).map((cell) =>  cell.classList[0]);
        tableData[rowOrder] = {
          cells: rowOrder % 2 === 0 ? cells : cells.reverse(),
          side: rowSide,
        }
      });
      this.tableData = tableData;
      this.toggleShowInstructions();
    },
    toggleShowInstructions () {
      this.displayInstructions = !this.displayInstructions;
    },
  },

  components: {
    DrawingTable,
    InstructionsTable,
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
