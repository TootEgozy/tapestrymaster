<template>
  <div>
    <h2>Pixelated Image Preview</h2>
    <input type="file" @change="onFileChange" />
    <div style="margin-top:10px;">
      <label>Rows: <input type="number" v-model.number="rows" min="1" /></label>
      <label>Cols: <input type="number" v-model.number="cols" min="1" /></label>
    </div>
    <div ref="canvasContainer" style="border:1px solid #ccc; display:inline-block; margin-top:10px;"></div>
    <div ref="tableContainer" style="border:1px solid #ccc; display:inline-block; margin-top:10px;"></div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as quantize from 'quantize';

const rows = ref(20);
const cols = ref(30);
const canvasContainer = ref(null);
const tableContainer = ref(null);
const maxPreviewSize = 300;

function reduceCanvasColors(canvas, colorCount = 6) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;

  // Get raw pixel data
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Collect all pixels (ignoring alpha)
  const pixelArray = [];
  for (let i = 0; i < pixels.length; i += 4) {
    // Ignore fully transparent pixels
    if (pixels[i + 3] < 125) continue;
      pixelArray.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
  }

  // Use quantize to extract dominant colors
  const colorMap = quantize(pixelArray, colorCount);
  if (!colorMap) return canvas;
  const palette = colorMap.palette();

  // Helper to find nearest color
  function nearestColor([r, g, b]) {
    let nearest = palette[0];
    let minDist = Infinity;
    for (const [pr, pg, pb] of palette) {
      const dr = r - pr;
      const dg = g - pg;
      const db = b - pb;
      const dist = dr * dr + dg * dg + db * db;
      if (dist < minDist) {
        minDist = dist;
        nearest = [pr, pg, pb];
      }
    }
    return nearest;
  }

  // Repaint pixels with nearest palette color
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 125) continue; // keep transparency
    const [r, g, b] = nearestColor([pixels[i], pixels[i + 1], pixels[i + 2]]);
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
  }

  // Put modified pixels back
  ctx.putImageData(imageData, 0, 0);

  return [canvas, palette];
}


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

function canvasToTable(canvas, rows, cols, colors) {
  const ctx = canvas.getContext("2d");
  const { width } = canvas;

  const pixelSize = width / cols;

  const table = [];
  const htmlTable = document.createElement("table");
  htmlTable.style.borderCollapse = "collapse";

  for (let row = 0; row < rows; row++) {
    const rowArr = [];
    const tr = document.createElement("tr");

    for (let col = 0; col < cols; col++) {
      const x = Math.floor(col * pixelSize + pixelSize / 2);
      const y = Math.floor(row * pixelSize + pixelSize / 2);
      const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
      const rgb = [r, g, b];
      rowArr.push(rgb);

      // Create table cell with background color
      const td = document.createElement("td");
      td.style.width = `${pixelSize}px`;
      td.style.height = `${pixelSize}px`;
      td.style.border = "1px solid #ccc";
      td.style.backgroundColor = `rgb(${r},${g},${b})`;
      tr.appendChild(td);
    }

    htmlTable.appendChild(tr);
    table.push(rowArr);
  }

  return {
    table,          // raw RGB array
    rowCount: rows,
    colCount: cols,
    colors,
    htmlTable       // <table> element you can append to DOM
  };
}




// Handle file upload
async function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const canvas = await pixelateImage(reader.result, cols.value, rows.value, maxPreviewSize);
    const [colorReducedCanvas, palette] = reduceCanvasColors(canvas, 6);
    canvasContainer.value.innerHTML = '';
    canvasContainer.value.appendChild(colorReducedCanvas);

    const tableObj = canvasToTable(colorReducedCanvas, rows.value, cols.value, palette);
    console.log(tableObj);
    tableContainer.value.innerHTML = '';
    tableContainer.value.appendChild(tableObj.htmlTable);
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
