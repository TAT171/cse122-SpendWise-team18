document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('clBody');
  if (!tbody) return;

  const nameInput  = document.getElementById('clSearchInput');
  const riskSelect = document.getElementById('clRiskFilter');

  const rc = { 'Thấp': 'ok', 'Trung bình': 'wr', 'Cao': 'er' };

  function renderTable(data) {
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#567a88; padding:30px;">Không tìm thấy khách hàng phù hợp</td></tr>`;
      return;
    }
    tbody.innerHTML = data.map(c => `
      <tr>
        <td><b>${UI.esc(c.n)}</b></td>
        <td>${money(c.b)}</td>
        <td>${c.g}%</td>
        <td><span class="badge ${rc[c.r] || 'muted'}">${UI.esc(c.r)}</span></td>
        <td style="color:#567a88">${UI.esc(c.u)}</td>
        <td><a style="color:#4db8d4" href="coach-budget-review.html?id=${c.id}">Xem</a></td>
      </tr>`).join('');
  }

  function filterClients() {
    const allClients = DB.all('coachClients');
    const searchTerm = nameInput ? nameInput.value.trim().toLowerCase() : '';
    const selectedRisk = riskSelect ? riskSelect.value : '';

    const filtered = allClients.filter(c => {
      const matchName = (c.n || '').toLowerCase().includes(searchTerm);
      const matchRisk = !selectedRisk || selectedRisk === 'Mức rủi ro' || c.r === selectedRisk;
      return matchName && matchRisk;
    });
    renderTable(filtered);
  }

  filterClients();

  if (nameInput) nameInput.addEventListener('input', filterClients);
  if (riskSelect) riskSelect.addEventListener('change', filterClients);
});