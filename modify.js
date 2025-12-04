import { getUserProfile, getUserStates } from './auth.js';
import { reloadData } from './reload.js';

export function openModifyDialog(
  rowId, state,
  participants, calls, tilawat, naat,
  bayan, halqa, sunnahs, dua, booklet
) {
  const profile = getUserProfile();
  const role = profile?.role || "state_admin";
  const allowedStates = getUserStates().map(s => s.toLowerCase().trim());
  const safeRowState = (state || "").toLowerCase().trim();

  if (role !== "global_admin" && safeRowState && !allowedStates.includes(safeRowState)) {
    console.warn(`Frontend: state mismatch for ${state}`, { role, allowedStates, safeRowState });
  }

  currentRowId = rowId;

  // Numeric fields
  document.getElementById("modParticipants").value = participants || "";
  document.getElementById("modCalls").value        = calls || "";
  document.getElementById("modBayan").value        = bayan || "";

  // Dropdowns (Yes/No)
  const setDropdown = (id, value) => {
    const el = document.getElementById(id);
    const normalized = String(value || "").toLowerCase().trim();
    if (normalized === "yes" || normalized === "no") {
      el.value = normalized.charAt(0).toUpperCase() + normalized.slice(1); // "Yes" or "No"
    } else {
      el.value = "";
    }
  };

  setDropdown("modTilawat", tilawat);
  setDropdown("modNaat", naat);
  setDropdown("modHalqa", halqa);
  setDropdown("modSunnahs", sunnahs);
  setDropdown("modDua", dua);
  setDropdown("modBooklet", booklet);

  document.getElementById("modifyModal").style.display = "block";
};
