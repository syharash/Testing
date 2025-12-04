import { buildFilterCache } from './utils.js';

export function refreshFilterOptions() {
  buildFilterCache();
  // populate dropdowns
}

export function resetFilters(selections) {
  selections.month = '';
  selections.date = '';
  selections.states = [];
  selections.city = '';
  refreshFilterOptions();
}
