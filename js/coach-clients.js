document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('clBody');
  if (!tbody) return;
  const rc = { 'Thấp': 'ok', 'Trung bình': 'wr', 'Cao': 'er' };

  const clients = [
    {id:'c-1', n:'Nguyễn Minh Anh', b:20000000, g:60, r:'Thấp',        u:'1 giờ trước'},
    {id:'c-2', n:'Trần Quốc Bảo',   b:15500000, g:42, r:'Cao',         u:'Hôm qua'},
    {id:'c-3', n:'Lê Thu Hà',       b:28000000, g:71, r:'Trung bình',  u:'2 ngày trước'},
    {id:'c-4', n:'Phạm Gia Huy',    b:18000000, g:88, r:'Thấp',        u:'3 ngày trước'}
  ];
  // seed 1 lần
  if (!DB.all('coachClients').length) {
    clients.forEach(c => DB.insert('coachClients', c));
  }

  tbody.innerHTML = DB.all('coachClients').map(c => `
    <tr>
      <td><b>${UI.esc(c.n)}</b></td>
      <td>${money(c.b)}</td>
      <td>${c.g}%</td>
      <td><span class="badge ${rc[c.r] || 'muted'}">${UI.esc(c.r)}</span></td>
      <td style="color:#567a88">${UI.esc(c.u)}</td>
      <td><a style="color:#4db8d4" href="coach-budget-review.html">Xem</a></td>
    </tr>`).join('');
});