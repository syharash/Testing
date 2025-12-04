export function getStateFromCity(city) {
  const normalizedCity = String(city || "").toLowerCase().trim();
  if (!normalizedCity) return "";

  for (const [state, cities] of Object.entries(stateCityMap)) {
    for (const c of cities) {
      const normalizedC = String(c || "").toLowerCase().trim();
      const baseCity = normalizedC.split(",")[0].trim(); // strip ", ST"
      if (normalizedCity === normalizedC || normalizedCity === baseCity) {
        return state;
      }
    }
  }
  return "";
}

export function buildFilterCache() {
      if (!masterData) {
        console.warn("masterData not initialized yet");
        return;
      }  

      const years = new Set();
      const months = new Set();
      const dates = new Set();
      const cities = new Set();


  for (let r = 0; r < masterData.getNumberOfRows(); r++) {
    const m = getVal(masterData, r, 2); // "Month & Year"
    const d = getVal(masterData, r, 3); // Date (Friday)
    const c = getVal(masterData, r, 4); // City

    if (m) {
      const yearMatch = m.match(/\b\d{4}\b/);
      if (yearMatch) years.add(yearMatch[0]);

      if (!selections.year || m.includes(selections.year)) {
        months.add(m);
      }

      const year = yearMatch ? yearMatch[0] : '';
      const matchesYear = !selections.year || (year && year === selections.year);
      const matchesMonth = !selections.month || m.toLowerCase().trim() === selections.month.toLowerCase().trim();

      if (d && matchesYear && matchesMonth) {
        dates.add(d);
      }
      if (c && matchesYear && matchesMonth) {
        cities.add(c);
      }
    }
  }

  cachedFilters = {
    years: [...years].sort(),
    months: [...months].sort(),
    dates: [...dates].sort(),
    cities: [...cities].sort()
  };
}
