// I want to write a functional component that receives rows and columns number and generates a table with rows and columns accordingly.
// then I want this table to only be visible when the generate button is pressed, regenerated every click.

// for each in row count - create a row element,

<!--<script lang="ts">-->
<!--import { h } from "vue";-->

<!--  export default {-->
<!--    name: 'DrawingTable',-->
<!--    props: {-->
<!--      rows: Number,-->
<!--      columns: Number,-->
<!--    },-->
<!--    render(): any {-->
<!--      console.log(this);-->
<!--      return h('div', { class: 'bar', innerHTML:`rows: ${this.rows}, columns: ${this.columns}` });-->
<!--    }-->
<!--  }-->
<!--</script>-->

<!--<template>-->
<!--&lt;!&ndash;  <div v-for="(row, i) in rowsArr" :key="i">&ndash;&gt;-->
<!--&lt;!&ndash;    <p>{{ row }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--  <span>{{ this.rows }}</span>-->
<!--&lt;!&ndash;  <table>&ndash;&gt;-->
<!--&lt;!&ndash;    <tr v-for="(row, i) in rows" :key="i">&ndash;&gt;-->
<!--&lt;!&ndash;      <td>{{ sale.Sale }}</td>&ndash;&gt;-->
<!--&lt;!&ndash;      <td>{{ sales[1][i].Sale }}</td>&ndash;&gt;-->
<!--&lt;!&ndash;    </tr>&ndash;&gt;-->
<!--&lt;!&ndash;  </table>&ndash;&gt;-->
<!--</template>-->

<template>
  <p>{{ rowsArr.toString() }}, {{ columnsArr.toString() }}</p>
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
  }
}
</script>

<!--<script>-->
<!--import { ref } from "vue";-->

<!--export default {-->
<!--  name: 'DrawingTable',-->
<!--  props: {-->
<!--    rows: Number,-->
<!--    columns: Number,-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      // rowsArr: ref([Array.from(Array(props.rows).keys())])-->
<!--      // columnsArr: Array.from(Array(10).keys())-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    const tableArr = [];-->
<!--  }-->
<!--}-->
<!--</script>-->
