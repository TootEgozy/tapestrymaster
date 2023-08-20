<template>
  <table>
    <tr v-for="(row, i) in createArray(rows)" :key="i">
      <td v-for="(column, i) in createArray(columns)" :key="i">
        ^_^
      </td>
    </tr>
  </table>
</template>

<script>

export default {
  name: 'DrawingTable',
  props: ['rows', 'columns'],
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
      // The table will be regenerated with updated rows and columns
    }
  }
}
</script>

<style lang="scss">
table {
  border-collapse: collapse;
}
td {
  border: solid 2px black;
}
</style>