/* =========================================================
   User Dashboard – AI Spending Pattern Insight
   ========================================================= */

async function runInsight() {
  const wrap = document.getElementById('aiDashBody');
  if (!wrap) return;
  wrap.innerHTML = `<div class="ai-loading"><div class="spinner"></div> AI đang phân tích dữ liệu…</div>`;
  const txRows = DB.all('transactions').map(t => ({
    desc: t.desc,
    cat:  t.cat,
    date: t.date,
    amt:  t.amt
  }));

  const r = await AI.patternInsight(txRows);

  if (!r.success) {
    wrap.innerHTML = AI.renderFailure({
      message: r.message || r.error || 'Không đủ dữ liệu để đưa ra đề xuất.',
      onEdit:  "toast('Thêm giao dịch để AI phân tích chính xác hơn','wr')",
      onRetry: 'runInsight()',
      onReport: "AI.reportFailure('AI-2 Spending Pattern Insight','Không đủ dữ liệu')"
    });
    return;
  }

  window.__lastInsight = r;

wrap.innerHTML = `
  <div class="ai-result">
    <div style="font-weight:600;margin-bottom:6px">${r.data.summary}</div>
    <div class="ai-reason"><b>Vì sao?</b> ${r.data.reason}</div>
  </div>
  ${r.data.anomalies.length ? `
      <div style="margin-top:12px">
        <div style="font-weight:600;margin-bottom:8px;font-size:13.5px">Cảnh báo chi bất thường</div>
        ${r.data.anomalies.map(a => `<div class="badge er" style="display:block;text-align:left;padding:8px 12px;margin-bottom:6px">${a.label} · ${money(a.amount)}</div>`).join('')}
      </div>` : ''}
    <div class="ai-actions">
      <button class="btn dark" onclick="toast('Đã chấp nhận gợi ý AI','ok')">Chấp nhận</button>
      <button class="btn" onclick="toast('Đã mở chỉnh sửa gợi ý','wr')">Sửa</button>
      <button class="btn" onclick="toast('Đã từ chối gợi ý','wr')">Từ chối</button>
      <button class="btn" onclick="saveInsightNote()">Lưu ghi chú</button>
      <button class="btn" onclick="toast('Đã chuyển cho Huấn luyện viên','ok')">Chuyển cho Coach</button>
      <button class="btn ghost" onclick="runInsight()">Tạo lại</button>
    </div>`;
}

function saveInsightNote() {
  const r = window.__lastInsight;
  if (!r) { toast('Chưa có kết quả AI để lưu', 'er'); return; }
  DB.insert('coachNotes', {
    client:  'Nguyễn Minh Anh',
    title:   'AI Insight · ' + UI.todayISO(),
    content: r.data.summary + ' — ' + r.data.reason,
    created: UI.todayISO(),
    source:  'AI-2 Spending Pattern Insight'
  });
  toast('Đã lưu insight vào ghi chú', 'ok');
}

window.runInsight = runInsight;
window.saveInsightNote = saveInsightNote;
document.getElementById('runInsight')?.addEventListener('click', runInsight);

window.runInsight = runInsight;
document.getElementById('runInsight')?.addEventListener('click', runInsight);