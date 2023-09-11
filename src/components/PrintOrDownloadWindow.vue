<template>
  <div
      v-if="!!printableDrawing"
      id="print-download-window-container"
  >
    <div v-html="printableDrawing"></div>
  </div>
</template>

<script>
import DrawingTable from "@/components/DrawingTable.vue";
import InstructionsTable from "@/components/InstructionsTable.vue";
import ColorsInput from "@/components/ColorsInput.vue";

export default {
  name: "PrintOrDownloadWindow",

  props: {
    title: String,
    printableDrawing: undefined,
  },

  data() {
    return {
    };
  },

  methods: {
    createPrintableTable() {



      // print({ backgroundGraphics: true });
    },

  },
};
</script>

<style lang="scss">

</style>