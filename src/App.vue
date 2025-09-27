<template>
  <div id="app">
    <main>
      <StudioPage
          v-if="currentPage === 'Studio'"
          :imageTable="imageTable"
          :colorPalette="colorPalette"
          @uploadImage="currentPage='ImageConverter'"
      />
      <ImageConverter
          v-if="currentPage === 'ImageConverter'"
          @backToStudio="currentPage='Studio'"
          @uploadToTable="uploadToTable"
      />
    </main>
  </div>
</template>

<script>
import StudioPage from "@/components/StudioPage.vue";
import ImageConverter from "@/components/ImageConverter.vue";

export default {
  name: "App",
  components: {
    StudioPage,
    ImageConverter,
  },
  data() {
    return {
      currentPage: 'Studio',
      imageTable: {},
      colorPalette: [],
    };
  },
  methods: {
    uploadToTable(data) {
      this.imageTable = data.table;
      this.colorPalette = data.palette;
      this.currentPage = 'Studio';
    }
  }
};
</script>

<style>
header {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f0f0f0;
}
</style>
