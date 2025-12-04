import { getUserProfile, getUserStates } from './auth.js';
import { reloadData } from './reload.js';

export async function deleteRow(rowId, name, email, rowState, rowCity) {
  const profile = getUserProfile();
  const role = profile?.role || "state_admin";
  const allowedStates = getUserStates().map(s => String(s).toLowerCase().trim());
  const userStates = getUserStates().join(",");
  const safeRowState = (rowState || "").toLowerCase().trim();

  // Only warn if safeRowState is non-empty and mismatched
  if (role !== "global_admin" && safeRowState && !allowedStates.includes(safeRowState)) {
    console.warn(`Frontend: state mismatch for ${rowState}`, { role, allowedStates, safeRowState });
  }

  // ✅ Confirmation dialog with summary preview
  const summary = `
You are about to delete this row:

- Name: ${name}
- Email: ${email}
- State: ${rowState || "Unknown"}
- City: ${rowCity || "Unknown"}

Do you want to proceed?`;

  if (!confirm(summary)) return;

  const payload = {
    rowId,
    userEmail: profile.email,
    userRole: role,
    userStates: userStates,
    actionType: "delete"
  };

  const url = "https://script.google.com/macros/s/AKfycbxpbALS5Y8ljm-0dz-Lj6rtUZCX2WwpRyrKPDhlquDjaA1QR4Aq5cSdr_BG3W-Fm7_P/exec"
    + "?" + new URLSearchParams(payload).toString();

  try {
    const response = await fetch(url);
    const result = await response.text();
    alert(result);

    // ✅ Reload fresh data from sheet
    reloadData(() => {
      refreshFilterOptions();
      drawFilteredView();
    });
  } catch (err) {
    alert("Delete failed: " + err.message);
    console.error("Delete error:", err);
  }
};
