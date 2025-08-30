<template>
  <div>
    <h2>Pixelated Image Preview</h2>
    <input ref="fileInput" type="file" />
    <div style="margin-top:10px;">
      <label>Rows: <input type="number" v-model.number="rows" min="1" /></label>
      <label>Cols: <input type="number" v-model.number="cols" min="1" /></label>
      <label>Colors: <input type="number" max="{{maxColors}}" v-model.number="colorsCount" min="2" /></label>
      <label>Remove Background <input type="checkbox" v-model="removeBackground" /></label>
      <button @click="imageUploaded">Generate</button>
    </div>
    <div ref="canvasContainer" style="border:1px solid #ccc; display:inline-block; margin-top:10px;"></div>
    <div ref="tableContainer" style="border:1px solid #ccc; display:inline-block; margin-top:10px;"></div>

  </div>
</template>

<script>

import { ref } from 'vue';
import * as quantize from 'quantize';
import ColorThief from 'colorthief';
import {removeBackground} from "@imgly/background-removal"

export default {
  name: "ImageConverter",
  data() {
    return {
      rows: ref(20),
      cols: ref(30),
      maxColors: 6,
      colorsCount: ref(3),
      removeBackground: ref(true),
      fileInput: ref(""),
      canvasContainer: ref(null),
      tableContainer: ref(null),
      maxPreviewSize: 300,
    }
  },
  methods: {

    // return the palette color which is most similar to current color
    nearestColor(palette, [r, g, b]) {
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
    },

    // get a canvas and reduce it to n dominant colors,
    // return the modified canvas and the dominant color palette
    reduceCanvasColors(canvas, palette) {
      const ctx = canvas.getContext("2d");
      const {width, height} = canvas;

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const pixelArray = [];
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] < 125) continue;
        pixelArray.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
      }

      // // extract dominant colors
      // const colorMap = quantize(pixelArray, this.colorsCount);
      // if (!colorMap) return canvas;
      // const palette = colorMap.palette();

      // repaint pixels with nearest palette color
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] < 125) continue; // keep transparency
        const [r, g, b] = this.nearestColor(palette, [pixels[i], pixels[i + 1], pixels[i + 2]]);
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
      }
      ctx.putImageData(imageData, 0, 0);

      return [canvas, palette];
    },

    // rescale and pixelate image, returns a canvas
    pixelateImage(imgSrc) {
      return new Promise((resolve) => {
        let img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          const scaleX = this.maxPreviewSize / this.cols;
          const scaleY = this.maxPreviewSize / this.rows;
          const pixelSize = Math.floor(Math.min(scaleX, scaleY));

          // Canvas for final preview
          const canvas = document.createElement('canvas');


          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, this.colorsCount, 5);

          const ctx = canvas.getContext('2d');
          canvas.width = this.cols * pixelSize;
          canvas.height = this.rows * pixelSize;

          // Canvas to resize image to table resolution
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = this.cols;
          tempCanvas.height = this.rows;
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.drawImage(img, 0, 0, this.cols, this.rows);

          const imageData = tempCtx.getImageData(0, 0, this.cols, this.rows);
          const data = imageData.data;

          // Draw each “pixel” scaled up
          for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
              const idx = (y * this.cols + x) * 4;
              ctx.fillStyle = `rgb(${data[idx]},${data[idx+1]},${data[idx+2]})`;
              ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
          }

          resolve([canvas, palette]);
        };
      });
    },
    // create a table from canvas
    canvasToTable(canvas) {
      const ctx = canvas.getContext("2d");
      const { width } = canvas;

      const pixelSize = width / this.cols;

      const table = [];
      const htmlTable = document.createElement("table");
      htmlTable.style.borderCollapse = "collapse";

      for (let row = 0; row < this.rows; row++) {
        const rowArr = [];
        const tr = document.createElement("tr");

        for (let col = 0; col < this.cols; col++) {
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
        table,  // raw RGB array
        htmlTable // table element
      };
    },


    async imageUploaded() {
      const file = this.$refs.fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();

      reader.onload = async () => {
        const [canvas, palette] = await this.pixelateImage(reader.result);

        //////////////////////////////////////////////
        // Convert your canvas to a Blob first
        canvas.toBlob(async (blob) => {
          if (!blob) return;

          try {
            const resultBlob = await removeBackground(blob, { model: 'isnet', alphaMatting: true });

            // Convert the result blob to a Data URL
            const reader2 = new FileReader();
            reader2.onload = () => {
              const resultDataUrl = reader2.result; // This is your final image URL
              console.log('Processed image URL:', resultDataUrl);

              // Optional: show it on the page
              const img = document.createElement('img');
              img.src = resultDataUrl;
              img.style.maxWidth = '300px';
              document.body.appendChild(img);
            };
            reader2.readAsDataURL(resultBlob);

          } catch (err) {
            console.error('Background removal failed', err);
          }
        }, 'image/png');
        //////////////////////////////////////////////

        const [colorReducedCanvas] = this.reduceCanvasColors(canvas, palette);
        this.$refs.canvasContainer.innerHTML = '';
        this.$refs.canvasContainer.appendChild(colorReducedCanvas);

        const tableObj = this.canvasToTable(colorReducedCanvas);
        this.$refs.tableContainer.innerHTML = '';
        this.$refs.tableContainer.appendChild(tableObj.htmlTable);
      };

      reader.readAsDataURL(file);
    }
  }
}

</script>

<style scoped>
input[type="number"] {
  width: 60px;
  margin-left: 5px;
  margin-right: 15px;
}
</style>
