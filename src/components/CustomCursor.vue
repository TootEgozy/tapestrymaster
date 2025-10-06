<template>
  <div
      v-if="active"
      class="custom-cursor"
      :style="brushCursor"
  ></div>
</template>

<script>
export default {
  name: 'CustomCursor',
  props: {
    brushSize: {type: Number, default: 1},
    cellSize: { type: Number, default: 20 },
    color: { type: String, default: '#000' },
    mode: { type: String },
  },
  data() {
    return {
      x: 0,
      y: 0,
      active: false,
    };
  },
  computed: {
    brushCursor() {
      const baseSize = this.cellSize * this.brushSize;
      return {
        left: this.x + 'px',
        top: this.y + 'px',
        width: baseSize + 'px',
        height: baseSize + 'px',
        background: this.hexToRgba(this.color, 0.7),
        border: '1px solid black',
        borderRadius: '30px',
        transform: 'translate(-50%, -50%)',
      };
    },
  },
  watch: {
    // mode(newVal) {
    //   document.body.style.cursor = newVal === 'brush' ? 'none' : 'auto';
    // },
  },
  mounted() {
    window.addEventListener('mousemove', this.updateCursor);
    // document.body.style.cursor = this.mode === 'brush' ? 'none' : 'auto';
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.updateCursor);
    document.body.style.cursor = 'auto';
  },
  methods: {
    updateCursor(e) {
      this.x = e.clientX;
      this.y = e.clientY;
    },

    setActive(value) {
      this.active = value;
      document.body.style.cursor = value ? "none" : "auto";
    },

    hexToRgba(hex, alpha = 1) {
      hex = hex.replace(/^#/, '');
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
  },
};
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  border-radius: 2px;
}
</style>
