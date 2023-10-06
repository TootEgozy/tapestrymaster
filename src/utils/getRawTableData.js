export const getRawTableData = () => {
    const rawTableData = { rows: [] };
    const instructionsTable = document.getElementsByClassName("drawing-table-container")[0];
    Object.values(Object.values(instructionsTable.children[0].children)).forEach((row) => {
        const rowData = {
            order: row.getAttribute('order'),
            side: row.getAttribute('side'),
            cells: [],
        };
        Object.values(row.children).forEach((td) => {
            const cell = {
                id: td.id,
                colorGenericName: td.classList[0],
                colorName: td.getAttribute('data-name'), // getting NAN
                colorRGB: td.style.backgroundColor,
            }
            rowData.cells.push(cell);
        });
        rawTableData.rows.push(rowData);
    });
    return rawTableData;
}