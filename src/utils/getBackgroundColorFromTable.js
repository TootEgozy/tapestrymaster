export function getBackgroundColorFromTable(htmlTable) {
    if (!(htmlTable instanceof HTMLTableElement)) return null;

    const rows = Array.from(htmlTable.rows);
    const rowCount = rows.length;
    const colCount = rows[0].cells.length;

    const keyCells = [];

    // Corners
    keyCells.push(rows[0].cells[0]); // top-left
    keyCells.push(rows[0].cells[colCount - 1]); // top-right
    keyCells.push(rows[rowCount - 1].cells[0]); // bottom-left
    keyCells.push(rows[rowCount - 1].cells[colCount - 1]); // bottom-right

    // Middles of first and last rows
    const midCol = Math.floor(colCount / 2);
    keyCells.push(rows[0].cells[midCol]);
    keyCells.push(rows[rowCount - 1].cells[midCol]);

    // Middles of first and last columns
    const midRow = Math.floor(rowCount / 2);
    keyCells.push(rows[midRow].cells[0]);
    keyCells.push(rows[midRow].cells[colCount - 1]);

    // Count colors
    const colorCount = {};
    keyCells.forEach(cell => {
        const color = cell.style.backgroundColor || '';
        colorCount[color] = (colorCount[color] || 0) + 1;
    });

    // Find the most frequent
    let maxCount = 0;
    let prominentColor = '';
    for (const color in colorCount) {
        if (colorCount[color] > maxCount) {
            maxCount = colorCount[color];
            prominentColor = color;
        }
    }

    return prominentColor;
}