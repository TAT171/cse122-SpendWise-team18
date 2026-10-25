/* =========================================================
   Admin – System Dashboard (giữ nguyên + thêm notify modal)
   ========================================================= */
(function () {
  'use strict';

  // Escape 1 ô CSV: nếu chứa ", ; hoặc xuống dòng → bọc trong "" và nhân đôi " bên trong
// Ví dụ: 'Lương "tháng 9"' → '"Lương ""tháng 9"""'
function csvCell(v) {
  const s = String(v == null ? '' : v);
  return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
  function exportCSV() {
    const rows = [];
    rows.push(['SpendWise - Bao cao he thong', 'Ngay ' + (window.UI ? UI.todayISO() : '')].map(csvCell).join(';'));
    rows.push('');
    rows.push(['Chi so', 'Gia tri', 'Ghi chu'].map(csvCell).join(';'));
    document.querySelectorAll('.stat').forEach(s => {
      rows.push([
        (s.querySelector('.label')?.textContent || '').trim(),
        (s.querySelector('.value')?.textContent || '').trim(),
        (s.querySelector('.delta')?.textContent || '').trim()
      ].map(csvCell).join(';'));
    });
    // \uFEFF = BOM (Byte Order Mark): báo hiệu file UTF-8 cho Excel
    // Nếu thiếu, Excel mở file sẽ hiển thị tiếng Việt thành ký tự lạ (Ã, Ä...)
    const csv = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'spendwise-bao-cao-he-thong.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (window.toast) toast('Đã xuất báo cáo CSV', 'ok');
  }

  function init() {
    // 1. Wire export CSV
    const exportBtn = Array.from(document.querySelectorAll('button'))
      .find(b => /Xuất báo cáo/i.test(b.textContent));
    if (exportBtn) {
      exportBtn.removeAttribute('onclick');
      exportBtn.addEventListener('click', exportCSV);
    }

    // 2. Inject notify modal
    if (!document.getElementById('notifyModal')) {
      const m = document.createElement('div');
      m.className = 'modal-backdrop';
      m.id = 'notifyModal';
      m.innerHTML = `
        <div class="modal">
          <div class="modal-head">
            <h3>Tạo thông báo</h3>
            <button class="icon-btn" onclick="closeModal('notifyModal')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <form id="notifyForm" style="display:flex;flex-direction:column;gap:12px">
            <div class="field"><label>Tiêu đề</label><input type="text" id="ntTitle" data-required><span class="err"></span></div>
            <div class="field"><label>Nội dung</label><textarea id="ntContent" data-required></textarea><span class="err"></span></div>
            <div class="field"><label>Đối tượng</label>
              <select id="ntAudience"><option>Tất cả người dùng</option><option>Người dùng mới</option><option>Huấn luyện viên</option></select>
            </div>
            <div style="display:flex;gap:10px">
              <button class="btn primary" type="submit">Tạo thông báo</button>
              <button class="btn" type="button" onclick="closeModal('notifyModal')">Hủy</button>
            </div>
          </form>
        </div>`;
      document.body.appendChild(m);

      document.getElementById('notifyForm').addEventListener('submit', e => {
        e.preventDefault();
        if (!validate(e.target)) return;
        DB.insert('notifications', {
          title:   document.getElementById('ntTitle').value.trim(),
          content: document.getElementById('ntContent').value.trim(),
          audience: document.getElementById('ntAudience').value,
          time: 'Vừa xong', read: false
        });
        closeModal('notifyModal');
        e.target.reset();
        toast('Đã tạo thông báo', 'ok');
      });
    }

        // 2b. Populate dynamic stats + pending table
    populateDashboard();

    function populateDashboard() {
      const users          = DB.all('users');
      const activeUsers    = users.filter(u => u.status === 'Hoạt động');
      const pending        = DB.find('resources', { status: 'pending' });
      const fmt            = n => new Intl.NumberFormat('vi-VN').format(n);

      // --- Stats ---
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('adminStatUsers',   fmt(users.length));
      set('adminStatActive',  fmt(activeUsers.length));
      set('adminStatPending', fmt(pending.length));
      set('adminStatActivePct',
        users.length ? Math.round(activeUsers.length / users.length * 100) + '% tổng người dùng' : '0%');
      set('adminStatPendingNote',
        pending.length ? pending.length + ' cần xử lý' : 'Không có');

      // --- Pending badge ---
      set('adminPendingBadge', pending.length + ' mục');

      // --- Pending table ---
      const tbody = document.getElementById('adminPendingBody');
      if (tbody) {
        if (!pending.length) {
          tbody.innerHTML = '<tr><td colspan="4">' +
            UI.emptyState('Không có tài nguyên chờ duyệt',
                          'Tất cả tài nguyên đã được xử lý.') +
            '</td></tr>';
        } else {
          const STATUS_LABEL = { draft: 'Bản nháp', rejected: 'Từ chối' };
          tbody.innerHTML = pending.map(r => `
            <tr>
              <td>${UI.esc(r.title)}</td>
              <td>${UI.esc((r.author || '').replace(/^HLV\s+/, ''))}</td>
              <td style="color:#567a88">${fmtDate(r.updated)}</td>
              <td><span class="badge wr">Chờ duyệt</span></td>
            </tr>`).join('');
        }
      }
    }
    // 3. Wire nút "Tạo thông báo" → mở modal
    const notifyBtn = Array.from(document.querySelectorAll('button'))
      .find(b => /Tạo thông báo/i.test(b.textContent));
    if (notifyBtn) {
      notifyBtn.removeAttribute('onclick');
      notifyBtn.addEventListener('click', () => openModal('notifyModal'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();