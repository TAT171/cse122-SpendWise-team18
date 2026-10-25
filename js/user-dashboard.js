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
      <button class="btn dark" onclick="saveInsightNote()">Chấp nhận & Lưu</button>      <button class="btn" onclick="toast('Đã mở chỉnh sửa gợi ý','wr')">Sửa</button>
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

function renderDashboard() {
  const txs = DB.all('transactions');
  
  let totalIncome = 0;
  let totalSpent = 0;
  
  txs.forEach(t => {
    if (t.amt > 0) totalIncome += t.amt;
    else totalSpent += Math.abs(t.amt);
  });
  
  const balance = totalIncome - totalSpent;
  const saved = totalIncome - totalSpent;
  const budget = 20000000; 
  const spentPct = Math.round((totalSpent / budget) * 100) || 0;

  const elBalance = document.getElementById('kpiBalance');
  if (elBalance) elBalance.textContent = money(balance);
  
  const elSpent = document.getElementById('kpiTotalSpent');
  if (elSpent) elSpent.textContent = money(totalSpent);
  
  const elSaved = document.getElementById('kpiSaved');
  if (elSaved) elSaved.textContent = money(saved);

  const spentDelta = elSpent?.nextElementSibling;
  if (spentDelta) spentDelta.textContent = `Đã dùng ${spentPct}% ngân sách`;

  const chartWrap = document.getElementById('chart7Days');
  if (chartWrap) {
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const maxSpent = Math.max(...txs.filter(t => t.amt < 0).map(t => Math.abs(t.amt)), 1000000);
    const recentTxs = txs.filter(t => t.amt < 0).slice(0, 7).reverse();
    
    chartWrap.innerHTML = days.map((day, i) => {
      const tx = recentTxs[i];
      const amt = tx ? Math.abs(tx.amt) : 0;
      const height = Math.max((amt / maxSpent) * 120, 10); 
      
      return `<div style="flex:1;text-align:center">
        <article style="height:${height}px;background:#bfeaf4;border-radius:6px 6px 0 0;margin-bottom:6px" title="${money(amt)}"></article>
        <span style="font-size:12px">${day}</span>
      </div>`;
    }).join('');
  }
}

let activeNoteIndex = 0;

function renderCoachNotes() {
  const tabsEl = document.getElementById('coachNoteTabs');
  const bodyEl = document.getElementById('coachNoteBody');
  const countEl = document.getElementById('coachNoteCount');
  if (!tabsEl || !bodyEl) return;

  const notes = DB.all('coachNotes')
    .filter(n => !n.source && n.client === 'Nguyễn Minh Anh')
    .sort((a, b) => new Date(b.created) - new Date(a.created));

  if (countEl) countEl.textContent = notes.length + ' ghi chú';

  if (!notes.length) {
    tabsEl.innerHTML = '';
    bodyEl.innerHTML = `
      <div class="empty" style="padding:24px 0">
        <div style="color:var(--tx3);font-size:13px">Chưa có ghi chú nào từ Huấn luyện viên.</div>
      </div>`;
    return;
  }

  if (activeNoteIndex >= notes.length) activeNoteIndex = 0;

  tabsEl.innerHTML = notes.map((n, i) => `
    <button
      class="tab ${i === activeNoteIndex ? 'active' : ''}"
      onclick="switchCoachNote(${i})"
      role="tab"
      aria-selected="${i === activeNoteIndex}"
      aria-controls="coachNoteBody"
    >
      📝 ${UI.esc(n.title)}
    </button>
  `).join('');

  const note = notes[activeNoteIndex];
  bodyEl.innerHTML = `
    <article style="padding:16px;background:var(--pri-s);border-left:3px solid var(--pri-d);border-radius:8px">
      <header style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div style="font-weight:600;font-size:14px">${UI.esc(note.title)}</div>
        <span class="badge muted" style="font-size:11.5px">${fmtDate(note.created)}</span>
      </header>
      <p style="color:var(--tx2);font-size:13.5px;line-height:1.7">${UI.esc(note.content)}</p>
      <footer style="margin-top:12px;font-size:11.5px;color:var(--tx3);display:flex;justify-content:space-between;align-items:center">
        <span>— HLV Thu Trang</span>
        <span>Ghi chú ${activeNoteIndex + 1} / ${notes.length}</span>
      </footer>
    </article>
  `;
}

window.switchCoachNote = function(index) {
  activeNoteIndex = index;
  renderCoachNotes();
};
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  renderCoachNotes();
});
window.runInsight = runInsight;
window.saveInsightNote = saveInsightNote;
document.getElementById('runInsight')?.addEventListener('click', runInsight);
