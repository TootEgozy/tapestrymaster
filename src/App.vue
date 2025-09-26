<template>
  <div id="app">
    <main>
      <StudioPage v-if="currentPage === 'Studio'"
        @uploadImage="currentPage='ImageConverter'"
      />
      <ImageConverter v-if="currentPage === 'ImageConverter'" />
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
      currentPage: 'Studio'
    };
  },
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
