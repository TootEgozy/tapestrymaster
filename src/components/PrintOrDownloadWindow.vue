<template>
  <div
      v-if="!!printableDrawing"
      id="print-download-window-container"
  >
    <div id="window-portal">
      <h3>{{title}}</h3>
      <div v-html="printableDrawing"></div>
      <InstructionsTable />
    </div>
  </div>
</template>

<script>
import InstructionsTable from "@/components/InstructionsTable.vue";

export default {
  name: "PrintOrDownloadWindow",

  props: {
    open: Boolean,
    title: String,
  },

  data() {
    return {
      printableDrawing: undefined,
    };
  },

  methods: {
    createPrintableDrawing() {
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

      this.printableDrawing = printableTable.outerHTML;
      // print({ backgroundGraphics: true });
    },
  },

  created() {
    this.readTable();
    this.createPrintableDrawing();
  },

  components: {
    InstructionsTable,
  }

};
</script>

<style lang="scss">

</style>