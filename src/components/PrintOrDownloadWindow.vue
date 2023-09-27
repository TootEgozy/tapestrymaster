<template>
  <div
      v-if="!!printableDrawing"
      class="print-download-window-container"
      ref="printDownloadWindowRef"
  >
      <h3>{{title}}</h3>
      <div v-html="printableDrawing"></div>
      <InstructionsTable />
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
      const canvas = await html2canvas(elementToCapture, { logging: false });
      const dataURL = canvas.toDataURL('image/jpeg');
      this.createTempDownloadLink(dataURL);
    },
    //applying styles to elements because the <style> tag doesn't work. TODO: fix the style tag
    applyStyles() {
      const windowContainer = document.getElementsByClassName("print-download-window-container")[0];
      if(windowContainer) {
        windowContainer.style.fontFamily = "Avenir, Helvetica, Arial, sans-serif";
        windowContainer.style.display = "flex";
        windowContainer.style.alignItems = "center";
        windowContainer.style.justifyContent = "center";
        windowContainer.style.flexDirection = "column";
      }
    }
  },

  created() {
    this.createPrintableDrawing();
  },

  mounted() {
    this.applyStyles();
    this.$emit('pdwindowmounted');
  },

  components: {
    InstructionsTable,
  }

};
</script>

<style lang="scss">
</style>