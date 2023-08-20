<template>
  <table>
    <tr v-for="(row, i) in rowsArr" :key="i">
      <td v-for="(column, i) in columnsArr" :key="i">
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
      rowsArr: Array.from(Array(this.rows).keys()),
      columnsArr: Array.from(Array(this.columns).keys())
    }
  },
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