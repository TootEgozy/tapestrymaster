// I want to write a functional component that receives rows and columns number and generates a table with rows and columns accordingly.
// then I want this table to only be visible when the generate button is pressed, regenerated every click.

// for each in row count - create a row element,

<script lang="ts">
import { h } from "vue";

  export default {
    name: 'DrawingTable',
    render() {
      return h('div', { class: 'bar', innerHTML: 'hello' });
    }
  }
</script>
