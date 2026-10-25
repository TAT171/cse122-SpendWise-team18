

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('clBody');
  if (!tbody) return;

  const nameInput = document.querySelector('input[placeholder*="Tìm tên"]');
  const riskSelect = document.querySelector('select:has(option[value="Thấp"]), select:nth-of-type(1)');

  const rc = { 'Thấp': 'ok', 'Trung bình': 'wr', 'Cao': 'er' };

  
  const clients = [
    {id:'c-1', n:'Nguyễn Minh Anh', b:20000000, g:60, r:'Thấp',        u:'1 giờ trước'},
    {id:'c-2', n:'Trần Quốc Bảo',   b:15500000, g:42, r:'Cao',         u:'Hôm qua'},
    {id:'c-3', n:'Lê Thu Hà',       b:28000000, g:71, r:'Trung bình',  u:'2 ngày trước'},
    {id:'c-4', n:'Phạm Gia Huy',    b:18000000, g:88, r:'Thấp',        u:'3 ngày trước'}
  ]
  const existing = DB.all('coachClients');
  if (!existing.length || !existing[0].n) {
    localStorage.removeItem('spendwise_db_v1'); 
    DB.reset(); // Khởi tạo lại DB gốc
    clients.forEach(c => DB.insert('coachClients', c));
  }

  
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
      // Kiểm tra tên (bảo toàn nếu trường n bị undefined)
      const clientName = (c.n || '').toLowerCase();
      const matchName = clientName.includes(searchTerm);
      
      // Kiểm tra mức độ rủi ro (bỏ qua nếu chọn giá trị trống hoặc nhãn mặc định)
      const matchRisk = !selectedRisk || selectedRisk === 'Mức rủi ro' || c.r === selectedRisk;

      return matchName && matchRisk;
    });

    renderTable(filtered);
  }

  filterClients();

  
  if (nameInput) {
    nameInput.addEventListener('input', filterClients);
  }
  if (riskSelect) {
    riskSelect.addEventListener('change', filterClients);
  }
});