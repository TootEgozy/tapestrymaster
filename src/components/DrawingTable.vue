<template>
  <div class="table-container">

    <table>
      <tr v-for="(row) in createArray(rows)" :key="row">
        <TableCell v-for="(column) in createArray(columns)" :key="column" :colors="colors" />
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
    }
  },
  components: {
    TableCell,
  }
}
</script>

<style lang="scss">

/* TODO: make the td a fixed square (in relation to width or length or whatever) and the table width and height dynamic */
.table-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1vh 1vw 1vh 1vw;
  background-color: aqua;
  table {
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