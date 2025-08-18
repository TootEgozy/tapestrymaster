<template>
  <div>
    <h2>Pixelated Image Preview</h2>
    <input type="file" @change="onFileChange" />
    <div style="margin-top:10px;">
      <label>Rows: <input type="number" v-model.number="rows" min="1" /></label>
      <label>Cols: <input type="number" v-model.number="cols" min="1" /></label>
    </div>
    <div ref="canvasContainer" style="border:1px solid #ccc; display:inline-block; margin-top:10px;"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const rows = ref(20);
const cols = ref(30);
const canvasContainer = ref(null);
const maxPreviewSize = 300;

// Pixelate and scale function
function pixelateImage(imgSrc, cols, rows, maxSize = 300) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const scaleX = maxSize / cols;
      const scaleY = maxSize / rows;
      const pixelSize = Math.floor(Math.min(scaleX, scaleY));

      // Canvas for final preview
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = cols * pixelSize;
      canvas.height = rows * pixelSize;

      // Canvas to resize image to table resolution
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = cols;
      tempCanvas.height = rows;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(img, 0, 0, cols, rows);

      const imageData = tempCtx.getImageData(0, 0, cols, rows);
      const data = imageData.data;

      // Draw each “pixel” scaled up
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = (y * cols + x) * 4;
          ctx.fillStyle = `rgb(${data[idx]},${data[idx+1]},${data[idx+2]})`;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }

      resolve(canvas);
    };
  });
}

// Handle file upload
async function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const canvas = await pixelateImage(reader.result, cols.value, rows.value, maxPreviewSize);
    canvasContainer.value.innerHTML = '';
    canvasContainer.value.appendChild(canvas);
  };
  reader.readAsDataURL(file);
}
</script>

<style scoped>
input[type="number"] {
  width: 60px;
  margin-left: 5px;
  margin-right: 15px;
}
</style>
