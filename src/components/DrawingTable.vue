<template>
  <div class="drawing-table-container">

    <table
        id="drawing-table"
        @mousedown="toggleMouse"
        @mouseup="dropMouse"
        @mouseleave="dropMouse"
        @dragstart="dropMouse"
    >
      <tr
          v-for="(row, i) in createArray(rows)"
          :key="row"
          :order="rows - i"
          :side="(rows - i) % 2 === 0 ? 'WS' : 'RS'"
      >
        <TableCell
            v-for="(column) in createArray(columns)"
            :key="column"
            :colors="colors"
            :mousedown="mousedown"
        />
      </tr>
    </table>

  </div>
</template>

<script>

import TableCell from "@/components/TableCell.vue";

export default {
  name: 'DrawingTable',

  props: ['rows', 'columns', 'colors'],

  data() {
    return {
      mousedown: false,
    }
  },

  watch: {
    rows: 'regenerateTable',
    columns: 'regenerateTable'
  },

  methods: {
    createArray (length) {
      return Array.from(Array(length).keys());
    },
    regenerateTable() {
      // force vue to regenerate the table
    },
    toggleMouse() {
      this.mousedown = !this.mousedown;
    },
    dropMouse() {
      this.mousedown = false;
    }
  },

  components: {
    TableCell,
  }

}
</script>

<style lang="scss">

/* TODO: make the td a fixed square (in relation to width or length or whatever) and the table width and height dynamic */
.drawing-table-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1vh 1vw 1vh 1vw;
  background-color: aqua;
  #drawing-table {
    min-width: 50vw;
    min-height: 50vh;
    border-collapse: collapse;
    td {
      border: solid 2px black;
    }
    .blue {
      background-color: blue;
    }
    .orange {
      background-color: orange;
    }
  }
}

</style>