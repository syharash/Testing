import { buildFilterCache } from './utils.js';

// --- Refresh dropdowns ---
export function refreshFilterOptions() {
  buildFilterCache();

  const yearSel = document.getElementById('yearFilter');
  yearSel.innerHTML = '<option value="">All Years</option>';
  cachedFilters.years.forEach(y => {
    yearSel.innerHTML += `<option value="${y}"${selections.year === y ? ' selected' : ''}>${y}</option>`;
  });

  const monthSel = document.getElementById('monthFilter');
  monthSel.innerHTML = '<option value="">All Months</option>';
  cachedFilters.months.forEach(m => {
    monthSel.innerHTML += `<option value="${m}"${selections.month === m ? ' selected' : ''}>${m}</option>`;
  });

  const dateSel = document.getElementById('dateFilter');
  dateSel.innerHTML = '<option value="">All Dates</option>';
  cachedFilters.dates.forEach(d => {
    dateSel.innerHTML += `<option value="${d}"${selections.date === d ? ' selected' : ''}>${d}</option>`;
  });

  const citySel = document.getElementById('cityFilter');
  citySel.innerHTML = '<option value="">All Cities</option>';

  const allowedCities = getAllowedCitiesFromStates(selections.states);
  if (allowedCities.size > 0) {
    cachedFilters.cities.forEach(c => {
      if (allowedCities.has(c.toLowerCase().trim())) {
        citySel.innerHTML += `<option value="${escapeHtml(c)}"${selections.city === c ? ' selected' : ''}>${escapeHtml(c)}</option>`;
      }
    });
  } else {
    cachedFilters.cities.forEach(c => {
      citySel.innerHTML += `<option value="${escapeHtml(c)}"${selections.city === c ? ' selected' : ''}>${escapeHtml(c)}</option>`;
    });
  }
}

export function resetFilters(selections) {
  selections.month = '';
  selections.date = '';
  selections.states = [];
  selections.city = '';
  refreshFilterOptions();
}
