<template>
  <div>
    <h2>Pixelated Image Preview</h2>
    <button @click="backToStudio">Back to Studio</button>
    <br><br>
    <input ref="fileInput" type="file" />
    <div style="margin-top:10px;">
      <label>Rows: <input type="number" v-model.number="rows" min="1" /></label>
      <label>Cols: <input type="number" v-model.number="cols" min="1" /></label>
      <label>Colors: <input type="number" :max="maxColors" v-model.number="colorsCount" min="2" /></label>
<!--      <label>Remove Background <input type="checkbox" v-model="removeBackground" /></label>-->
      <button @click="processImageToTable">Generate</button>
    </div>
    <div ref="canvasContainer" style="border:1px solid #ccc; display:inline-block; margin-top:10px;"></div>
    <div ref="tableContainer" style="border:1px solid #ccc; display:inline-block; margin-top:10px;"></div>
    <button @click="uploadToTable">Done</button>
  </div>
</template>

<script>
import ColorThief from 'colorthief';
// import { removeBackground } from "@imgly/background-removal";

export default {
  name: "ImageConverter",
  data() {
    return {
      rows: 20,
      cols: 30,
      maxColors: 6,
      colorsCount: 3,
      // removeBackground: true,
      maxPreviewSize: 300,
      palette: [],
      table: {}
    };
  },
  methods: {

    async processImageToTable() {
      const file = this.$refs.fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const [canvas, palette] = await this.pixelateImage(reader.result);
        this.palette = palette;

        // if (this.removeBackground) {
        //   canvas.toBlob(async blob => {
        //     if (!blob) return;
        //
        //     try {
        //       const resultBlob = await removeBackground(blob, { model: 'isnet', alphaMatting: true });
        //       const reader2 = new FileReader();
        //       reader2.onload = () => {
        //         const img = document.createElement('img');
        //         img.src = reader2.result;
        //         img.style.maxWidth = '200px';
        //         img.style.height = 'auto';
        //         img.style.visibility = 'hidden';
        //         document.body.appendChild(img);
        //       };
        //       reader2.readAsDataURL(resultBlob);
        //     } catch (err) {
        //       console.error('Background removal failed', err);
        //     }
        //   }, 'image/png');
        // }

        const [colorReducedCanvas] = this.reduceCanvasColors(canvas, palette);
        this.$refs.canvasContainer.innerHTML = '';
        // this.$refs.canvasContainer.appendChild(colorReducedCanvas);

        this.$refs.tableContainer.innerHTML = '';
        this.table = this.canvasToTable(colorReducedCanvas)
        this.$refs.tableContainer.appendChild(this.table);
      };
      reader.readAsDataURL(file);
    },

    nearestColor(palette, [r, g, b]) {
      let nearest = palette[0];
      let minDist = Infinity;
      for (const [pr, pg, pb] of palette) {
        const dr = r - pr, dg = g - pg, db = b - pb;
        const dist = dr * dr + dg * dg + db * db;
        if (dist < minDist) {
          minDist = dist;
          nearest = [pr, pg, pb];
        }
      }
      return nearest;
    },

    reduceCanvasColors(canvas, palette) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const { width, height } = canvas;
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const [r, g, b] = this.nearestColor(palette, [pixels[i], pixels[i + 1], pixels[i + 2]]);
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
      }

      ctx.putImageData(imageData, 0, 0);
      return [canvas, palette];
    },

    pixelateImage(imgSrc) {
      return new Promise(resolve => {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          const scaleX = this.maxPreviewSize / this.cols;
          const scaleY = this.maxPreviewSize / this.rows;
          const pixelSize = Math.floor(Math.min(scaleX, scaleY));

          const canvas = document.createElement('canvas');
          canvas.width = this.cols * pixelSize;
          canvas.height = this.rows * pixelSize;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });

          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = this.cols;
          tempCanvas.height = this.rows;
          const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
          tempCtx.drawImage(img, 0, 0, this.cols, this.rows);

          const data = tempCtx.getImageData(0, 0, this.cols, this.rows).data;

          for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
              const idx = (y * this.cols + x) * 4;
              ctx.fillStyle = `rgb(${data[idx]},${data[idx + 1]},${data[idx + 2]})`;
              ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
          }

          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, this.colorsCount, 5);

          resolve([canvas, palette]);
        };
      });
    },

    canvasToTable(canvas) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const { width } = canvas;
      const pixelSize = width / this.cols;
      const imageData = ctx.getImageData(0, 0, width, canvas.height).data;

      const htmlTable = document.createElement("table");
      htmlTable.style.borderCollapse = "collapse";

      for (let row = 0; row < this.rows; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < this.cols; col++) {
          const x = Math.floor(col * pixelSize + pixelSize / 2);
          const y = Math.floor(row * pixelSize + pixelSize / 2);
          const idx = (y * width + x) * 4;
          const r = imageData[idx], g = imageData[idx + 1], b = imageData[idx + 2];

          const td = document.createElement("td");
          td.style.width = `${pixelSize}px`;
          td.style.height = `${pixelSize}px`;
          td.style.border = "1px solid #ccc";
          td.style.backgroundColor = `rgb(${r},${g},${b})`;
          tr.appendChild(td);
        }
        htmlTable.appendChild(tr);
      }

      return htmlTable;
    },

    backToStudio() {
      this.$emit("backToStudio");
    },

    uploadToTable() {
      this.$emit("uploadToTable", {palette: this.palette, table: this.table});
    }
  }
};
</script>

<style scoped>
input[type="number"] {
  width: 60px;
  margin-left: 5px;
  margin-right: 15px;
}
</style>
