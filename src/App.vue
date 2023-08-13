<template>
  <div class="app-body">
    <div class="inputs-container">
      <p>
        Insert the desired work measurements (rows, columns) and press generate
      </p>
      <div id="columns-rows-input">
        <label for="columns">columns:</label>
        <input type="number" min="0" id="columns" />
        <label for="rows">rows:</label>
        <input type="number" min="0" id="rows" />
        <button @click="this.generateTable()">Generate</button>
      </div>
    </div>
    <div id="table-container">
      <DrawingTable :rows="this.rowsNumber" :columns="this.columnsNumber" />
    </div>
  </div>
</template>

<script>
import DrawingTable from "@/components/DrawingTable.vue";

export default {
  name: "App",
  data() {
    return {
      rowsNumber: 6,
      columnsNumber: 7,
      generated: false,
      colors: [],
      colorA: "blue",
      colorB: "orange",
    };
  },

  methods: {
    toggleColor(event) {
      const cell = event.target;
      const cellColor = cell["data-color"];
      const [newColorType, newColor] =
        cellColor === "colorA"
          ? ["colorB", this.colorB]
          : ["colorA", this.colorA];
      cell.style.backgroundColor = newColor;
      cell["data-color"] = newColorType;
    },

    generateTable() {
      const columnsElement = document.getElementById("columns");
      const rowsElement = document.getElementById("rows");
      const container = document.getElementById("table-container");
      container.innerHTML = "";
      const [cols, rows] = [columnsElement.value, rowsElement.value];
      const table = document.createElement("table");
      for (let i = 0; i < rows; i++) {
        const row = table.insertRow();
        row["order"] = rows - i;
        row["side"] = (rows - i) % 2 === 0 ? "WS" : "RS";
        for (let j = 0; j < cols; j++) {
          const cell = row.insertCell();
          cell.className = "table-cell";
          cell["data-color"] = "colorA";
          cell.style.backgroundColor = this.colorA;
          cell.onclick = this.toggleColor;
        }
      }
      container.appendChild(table);
    },
  },
  components: {
    DrawingTable,
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
    table {
      border-collapse: collapse;
    }
    td {
      border: solid 2px black;
    }
    .table-cell {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
