/* =========================================================
   Moderator – AI Template Management + Test Console
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- TEST CONSOLE (giữ nguyên) ---------- */
  const out     = document.getElementById('testOutput');
  const status  = document.getElementById('testStatus');
  const history = document.getElementById('testHistory');

  async function runTest() {
    const input = document.getElementById('testInput');
    const val = input.value.trim();
    if (!val) { toast('Vui lòng nhập input test', 'er'); input.focus(); return; }

    status.textContent = 'Đang chạy…';
    status.style.background = '#fdf3dd';
    status.style.color = '#d9930b';
    out.innerHTML = `<div class="ai-loading"><div class="spinner"></div> AI đang xử lý input: "${esc(val)}"</div>`;

    const t0 = Date.now();
    const r = await AI.categorize(val);
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    const pct = Math.round(r.data.confidence * 100);

    status.textContent = `Hoàn tất ${dt}s`;
    status.style.background = '#e4f6eb';
    status.style.color = '#2e9e5b';

    out.innerHTML = `
      <div class="test-result-head">
        <div>
          <div class="lbl">Kết quả phân loại</div>
          <div class="val">${catBadge(r.data.cat)}</div>
        </div>
        <div class="confidence-pill">Confidence ${pct}%</div>
      </div>
      <div class="confidence-bar"><div class="fill" style="width:${pct}%"></div></div>
      <div class="test-reason"><b>💡 Lý do:</b> ${r.data.reason}</div>
      <div class="test-metrics">
        <span>🕐 ${dt} giây</span>
        <span>✓ Thành công</span>
        <span>🎯 Không có nội dung nhạy cảm</span>
      </div>
      <div class="ai-actions" style="margin-top:14px">
        <button class="btn dark" onclick="toast('Đã chấp nhận kết quả và lưu vào mẫu','ok')">Chấp nhận</button>
        <button class="btn" onclick="toast('Đã mở chỉnh sửa phản hồi','wr')">Sửa phản hồi</button>
        <button class="btn" onclick="toast('Đã báo cáo kết quả bất thường','wr')">Báo cáo</button>
      </div>`;

    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `<span>${esc(val)}</span><span class="badge ${CATS[r.data.cat]?.cls || 'muted'}">${r.data.cat} · ${pct}%</span>`;
    history.insertBefore(item, history.firstChild);
    while (history.children.length > 5) history.removeChild(history.lastChild);

    toast(r.data.uncertain ? 'AI chưa chắc chắn về kết quả này'
                     : ('Test thành công: ' + r.data.cat),
          r.data.uncertain ? 'wr' : 'ok');
  }

  document.getElementById('runTest')?.addEventListener('click', runTest);
  document.getElementById('testInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') runTest();
  });

  /* ---------- TEMPLATE TABLE (DB-backed) ---------- */
  const tbody = document.querySelector('.table-wrap table tbody');
  if (!tbody) return;

  let currentId = 'tpl-1';

    function renderTemplates() {
    const items = DB.all('aiTemplates');

    // ---- Empty state ----
    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="border:none">' +
        UI.emptyState(
          'Chưa có mẫu AI nào',
          'Các mẫu AI sẽ xuất hiện ở đây sau khi được tạo. Bấm "Tạo mẫu" ở góc phải để bắt đầu.',
          '<button class="btn primary" onclick="document.querySelector(\'button.btn.primary\').click()">+ Tạo mẫu đầu tiên</button>'
        ) + '</td></tr>';
      return;
    }

    // ---- Có data ----
    tbody.innerHTML = items.map(t => `
      <tr data-id="${t.id}">
        <td><b>${UI.esc(t.name)}</b></td>
        <td>${UI.esc(t.version)}</td>
        <td><span class="badge ${t.status === 'on' ? 'ok' : 'er'}">${t.status === 'on' ? 'Đang bật' : 'Tạm tắt'}</span></td>
        <td>${fmtDate(t.updated).slice(0, 5)}</td>
        <td><div class="row-actions">
          <a data-act="edit" data-id="${t.id}">Sửa</a> ·
          <a data-act="test" data-id="${t.id}">Test</a>
        </div></td>
      </tr>`).join('');
  }

  tbody.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const t = DB.get('aiTemplates', a.dataset.id);
    if (!t) return;
    currentId = t.id;

    if (a.dataset.act === 'edit') {
      const form = document.getElementById('tplForm');
      const texts = form.querySelectorAll('input[type="text"]');
      const sels  = form.querySelectorAll('select');
      texts[0].value = t.name;
      texts[1].value = t.prompt;
      texts[2].value = t.fallback || '';
      if (sels[0]) sels[0].value = t.confidence || '0.75';
      if (sels[1]) sels[1].value = t.lang || 'Tiếng Việt';
      toast('Đang chỉnh sửa: ' + t.name, 'wr');
    } else if (a.dataset.act === 'test') {
      const map = {
        'Expense Categorizer':      'Phúc Long 96.000 đ',
        'Spending Pattern Insight': 'Phân tích chi tiêu 30 ngày',
        'Goal Coach':               'Tiết kiệm 10 triệu trong 6 tháng'
      };
      document.getElementById('testInput').value = map[t.name] || t.name;
      toast('Đã nạp input mẫu', 'ok');
    }
  });

  /* ---------- FORM submit ---------- */
  const form = document.getElementById('tplForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(form)) return;
    const texts = form.querySelectorAll('input[type="text"]');
    const sels  = form.querySelectorAll('select');
    const current = DB.get('aiTemplates', currentId);
const oldVersion = current?.version || 'v1.0';
// Tăng minor version: v2.4 → v2.5
const parts = oldVersion.replace('v', '').split('.');
const newVersion = 'v' + parts[0] + '.' + ((parseInt(parts[1], 10) || 0) + 1);

DB.update('aiTemplates', currentId, {
  name:       texts[0].value.trim(),
  prompt:     texts[1].value.trim(),
  fallback:   texts[2].value.trim(),
  confidence: sels[0]?.value || '0.75',
  lang:       sels[1]?.value || 'Tiếng Việt',
  version:    newVersion,
  updated:    UI.todayISO()
});
    renderTemplates();
    toast('Đã lưu phiên bản mẫu', 'ok');
  });

  /* ---------- Nút "Tạm tắt" / "Khôi phục" ---------- */
  form?.querySelectorAll('button[type="button"]').forEach(b => {
    const text = b.textContent.trim();
    if (text === 'Tạm tắt') {
      b.onclick = () => {
        const t = DB.get('aiTemplates', currentId);
        if (!t) return;
        const next = t.status === 'on' ? 'off' : 'on';
        DB.update('aiTemplates', currentId, { status: next, updated: UI.todayISO() });
        renderTemplates();
        toast(next === 'off' ? 'Đã tạm tắt mẫu' : 'Đã bật mẫu',
              next === 'off' ? 'er' : 'ok');
      };
    }
    if (text === 'Khôi phục v2.3') {
      b.onclick = () => toast('Đã khôi phục về v2.3', 'wr');
    }
  });

  renderTemplates();
});