<template>
  <div
      v-if="!!printableDrawing"
      class="print-download-window-container"
      ref="printDownloadWindowRef"
  >
      <h3>{{title}}</h3>
      <div v-html="printableDrawing"></div>
      <InstructionsTable />
    <div class="p-d-buttons-container">
      <button
          class="download-button"
          @click="downloadInstructions"
      >
        download
      </button>
      <button
          class="print-button"
          @click="printInstructions"
      >
        print
      </button>
    </div>
  </div>
</template>

<script>
import InstructionsTable from "@/components/InstructionsTable.vue";
import html2canvas from "html2canvas";

export default {
  name: "PrintOrDownloadWindow",

  props: {
    open: Boolean,
    title: String,
  },

  data() {
    return {
      printableDrawing: undefined,
      window: undefined,
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
          printableCell.style.border = "1px solid black";
          printableRow.appendChild(printableCell);
        });
        printableTable.appendChild(printableRow);
      });

      printableTable.style.borderCollapse = "collapse";

      this.printableDrawing = printableTable.outerHTML;
      // print({ backgroundGraphics: true });
    },
    createTempDownloadLink(url) {
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = `${this.title} tapestry project.jpg`;
      tempLink.click();
      tempLink.remove();
    },
    async downloadInstructions() {
      const elementToCapture = this.$refs.printDownloadWindowRef;
      const canvas = await html2canvas(elementToCapture);
      const dataURL = canvas.toDataURL('image/jpeg');
      this.createTempDownloadLink(dataURL);
    },
    printInstructions() {
      //
    }
  },

  mounted() {
    this.createPrintableDrawing();
  },

  components: {
    InstructionsTable,
  }

};
</script>

<style lang="scss">

//* TODO: fix style not applying *//
.print-download-window-container {
  font-family: "Arial",serif;
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