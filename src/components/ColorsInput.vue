<templa>
// have two basic colors which the user starts with. it can be fun to pick 2 random colors
// start with 2 color inputs which are the minimum, bind them to the colors array
// have a plus button (or "add color") which adds another color to the colors list with random color
      <div id="colors-input">
        <label for="rows">rows:</label>
        <input type="color" min="0" id="rows" v-model="rowsNumber" />
        <label for="columns">columns:</label>
        <input type="number" min="0" id="columns" v-model="columnsNumber"/>
      </div>
</templa>

<script>
// color = {
//   order: Number,
//   name: String,
//   alphabeticalName: String,
//   color: any
// }

export default {
  data() {
    return {
      colors: [],
    }
  }
}
</script>

<style lang="scss">
#colors-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: Arial, Helvetica, sans-serif;
}
</style>