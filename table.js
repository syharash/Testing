import { deleteRow } from './delete.js';
import { openModifyDialog } from './modify.js';
import { getStateFromCity } from './utils.js';

// --- Draw filtered view with auto column widths ---
function drawFilteredView() {
  if (!masterData) {
    console.warn("masterData not initialized yet");
    return;
  }

  const view = new google.visualization.DataView(masterData);
  const rows = [];

  const allowedCities = getAllowedCitiesFromStates(selections.states);

  for (let r = 0; r < masterData.getNumberOfRows(); r++) {
    const m = getVal(masterData, r, 2); // Month & Year
    const d = getVal(masterData, r, 3); // Date (Friday)
    const c = getVal(masterData, r, 4); // City

    const match =
      (!selections.year || String(m || "").includes(selections.year)) &&
      (!selections.month || String(m || "").toLowerCase().trim() === selections.month.toLowerCase().trim()) &&
      (!selections.date || String(d || "").toLowerCase().trim() === selections.date.toLowerCase().trim()) &&
      (allowedCities.size === 0 || allowedCities.has(String(c || "").toLowerCase().trim())) &&
      (!selections.city || String(c || "").toLowerCase().trim() === selections.city.toLowerCase().trim());

    if (match) rows.push(r);
  }

  view.setRows(rows);

  const numCols = masterData.getNumberOfColumns();
  const cols = [];
  for (let i = 0; i < numCols - 1; i++) cols.push(i); // show all but RowID

cols.push({
  type: 'string',
  label: 'Actions',
  calc: function (dt, row) {
    const rowId       = dt.getValue(row, numCols - 1); // RowID
    const email       = dt.getValue(row, 0);           // Email
    const name        = dt.getValue(row, 1);           // Name
    const city        = String(dt.getValue(row, 4) || "").trim(); // City
    const state       = getStateFromCity(city);
    const participants= dt.getValue(row, 5);
    const calls       = dt.getValue(row, 6);
    const tilawat     = dt.getValue(row, 7);
    const naat        = dt.getValue(row, 8);
    const bayan       = dt.getValue(row, 9);
    const halqa       = dt.getValue(row, 10);
    const sunnahs     = dt.getValue(row, 11);
    const dua         = dt.getValue(row, 12);
    const booklet     = dt.getValue(row, 13);

    // Helper to highlight the row
    const highlightRow = `
      const tableRows = document.querySelectorAll('#table_div table tbody tr');
      tableRows.forEach(r => r.classList.remove('highlight-row'));
      if (tableRows[${row}]) tableRows[${row}].classList.add('highlight-row');
    `;

    return `
      <button class="delete-btn" 
        onclick="${highlightRow} deleteRow('${rowId}', '${name}', '${email}', '${state}', '${city}')">
        Delete
      </button>
      <button class="modify-btn"
        onclick="${highlightRow} openModifyDialog('${rowId}', '${state}',
          '${participants}', '${calls}', '${tilawat}', '${naat}',
          '${bayan}', '${halqa}', '${sunnahs}', '${dua}', '${booklet}')">
        Modify
      </button>
    `;
  }
});

  view.setColumns(cols);

  const colWidths = getColumnWidths(view);
  colWidths[0] = 220;  // Email column
  colWidths[1] = 260;  // Name column      
  colWidths[2] = 160;  // Month & Year column
  colWidths[4] = 180;  // City column

  table.draw(view, {
    showRowNumber: true,
    width: '100%',
    height: '100%',
    allowHtml: true,
    columns: colWidths.map(w => ({ width: w })),
    cssClassNames: { tableCell: 'nowrap' }
  });
}

