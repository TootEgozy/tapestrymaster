<template>
  <div class="app-body">
    <div class="inputs-container">
      <p>
        Insert the desired work measurements (rows, columns) and press generate
      </p>
      <div id="columns-rows-input">
        <label for="columns">columns:</label>
        <input type="number" min="0" id="columns" />
        <label for="rows">rows:</label>
        <input type="number" min="0" id="rows" />
        <button>Generate</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      rowsNumber: undefined,
      columnsNumber: undefined,
      generated: false,
      colors: [],
    };
  },

  methods: {},
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
