
document.addEventListener('DOMContentLoaded', () => {
  const out     = document.getElementById('testOutput');
  const status  = document.getElementById('testStatus');

  async function runTest() {
    const input = document.getElementById('testInput');
    const val = input.value.trim();
    if (!val) { toast('Vui lòng nhập input test', 'er'); input.focus(); return; }

    status.textContent = 'Đang chạy…';
    status.style.background = '#fdf3dd';
    status.style.color = '#d9930b';
    out.innerHTML = `<div class="ai-loading"><div class="spinner"></div> AI đang xử lý input: "${esc(val)}"</div>`;

    const t0 = Date.now();
    const template = DB.get('aiTemplates', currentId);
    const templateName = template ? template.name : 'Expense Categorizer';
    let htmlResult = '';

    if (templateName === 'Goal Coach') {
      const r = await AI.goalCoach(val, 10000000, '2027-01-01');
      const pct = Math.round(r.data.confidence * 100);
      htmlResult = `
        <div class="test-result-head">
          <div><div class="lbl">Lộ trình đề xuất</div></div>
          <div class="confidence-pill">Confidence ${pct}%</div>
        </div>
        <div class="confidence-bar"><div class="fill" style="width:${pct}%"></div></div>
        <div style="background:#fff; border:1px solid var(--bd); padding:12px; border-radius:8px; margin-bottom:12px;">
          <ul style="padding-left:20px; line-height:1.8; font-size:13.5px; margin:0;">
            ${r.data.steps.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="test-reason"><b>💡 Lý do:</b> ${r.data.reason}</div>`;
    } 
    else if (templateName === 'Spending Pattern Insight') {
      const mockTx = [{amt: -50000, cat: 'Ăn uống', date: '2026-10-01', desc: 'Cà phê'}, {amt: -600000, cat: 'Mua sắm', date: '2026-10-02', desc: 'Áo'}, {amt: -100000, cat: 'Di chuyển', date: '2026-10-03', desc: 'Grab'}];
      const r = await AI.patternInsight(mockTx);
      const pct = Math.round(r.data.confidence * 100);
      htmlResult = `
        <div class="test-result-head">
          <div><div class="lbl">Phân tích xu hướng</div></div>
          <div class="confidence-pill">Confidence ${pct}%</div>
        </div>
        <div class="confidence-bar"><div class="fill" style="width:${pct}%"></div></div>
        <div style="background:#fff; border:1px solid var(--bd); padding:12px; border-radius:8px; margin-bottom:12px; font-size:13.5px; font-weight:500;">
          ${r.data.summary}
        </div>
        <div class="test-reason"><b>💡 Lý do:</b> ${r.data.reason}</div>`;
    } 
    else {
      const r = await AI.categorize(val);
      const pct = Math.round(r.data.confidence * 100);
      htmlResult = `
        <div class="test-result-head">
          <div><div class="lbl">Kết quả phân loại</div><div class="val">${catBadge(r.data.cat)}</div></div>
          <div class="confidence-pill">Confidence ${pct}%</div>
        </div>
        <div class="confidence-bar"><div class="fill" style="width:${pct}%"></div></div>
        <div class="test-reason"><b>💡 Lý do:</b> ${r.data.reason}</div>`;
    }

    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    status.textContent = `Hoàn tất ${dt}s`;
    status.style.background = '#e4f6eb';
    status.style.color = '#2e9e5b';

    out.innerHTML = htmlResult + `
      <div class="test-metrics" style="margin-top:14px">
        <span>🕐 ${dt} giây</span>
        <span>✓ Thành công</span>
      </div>
      <div class="ai-actions" style="margin-top:14px">
        <button class="btn dark" onclick="toast('Đã chấp nhận kết quả test','ok')">Chấp nhận</button>
        <button class="btn" onclick="toast('Đã báo cáo kết quả','wr')">Báo cáo</button>
      </div>`;

    toast('Test thành công: ' + templateName, 'ok');
  }
  document.getElementById('runTest')?.addEventListener('click', runTest);
  document.getElementById('testInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') runTest();
  });

  const tbody = document.querySelector('.table-wrap table tbody');
  if (!tbody) return;

  let currentId = 'tpl-1';

  function renderTemplates() {
    const items = DB.all('aiTemplates');

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="border:none">' +
        UI.emptyState(
          'Chưa có mẫu AI nào',
          'Các mẫu AI sẽ xuất hiện ở đây sau khi được tạo. Bấm "Tạo mẫu" ở góc phải để bắt đầu.'
        ) + '</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(t => `
      <tr data-id="${t.id}">
        <td><b>${UI.esc(t.name)}</b></td>
        <td>${UI.esc(t.version)}</td>
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