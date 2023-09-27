<template>
  <div v-if="open">
    <slot />
  </div>
</template>

<script>
export default {
  name: "WindowPortal",

  props: ["open"],

  data() {
    return {
      windowRef: null,
    }
  },

  methods: {
    openWindow() {
      this.windowRef = window.open("", "", "width=600,height=400,left=200,top=200");
      this.windowRef.document.write(`<html><head><title>&nbsp;</title></head><body>`);
      this.windowRef.document.write('</body></html>');
      this.windowRef.document.body.appendChild(this.$el);
      this.windowRef.addEventListener('beforeunload', this.closeWindow);
    },

    closeWindow() {
      if(this.windowRef) {
        this.windowRef.close();
        this.windowRef = null;
        this.$emit('printWindowClosed');
      }
    },

    getWindowRef () {
      return this.windowRef;
    },
  },

  mounted() {
    if(open) {
      this.openWindow();
    }
  },
}
</script>

<style lang="scss">

</style>