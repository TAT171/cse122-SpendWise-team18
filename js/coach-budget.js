/* =========================================================
   Coach – Budget Review
   - Client switch thật (load budget của client tương ứng)
   - Budget CRUD (click thẻ .stat để mở modal sửa — không thêm nút)
   - Coach note CRUD (thêm nút Xóa cạnh Lưu — inject)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Seed budgets ---------- */
  if (!DB.all('budgets').length) {
    [
      { id:'b-1', client:'Nguyễn Minh Anh', month:'2026-10', total:20000000, spent:12680000,
        lines:[
          {cat:'Ăn uống',   plan:4000000, actual:3120000},
          {cat:'Di chuyển', plan:2000000, actual:2450000},
          {cat:'Mua sắm',   plan:2500000, actual:3100000}
        ]},
      { id:'b-2', client:'Trần Quốc Bảo', month:'2026-10', total:15500000, spent:9800000,
        lines:[
          {cat:'Ăn uống',   plan:3000000, actual:2800000},
          {cat:'Di chuyển', plan:1500000, actual:1800000}
        ]}
    ].forEach(b => DB.insert('budgets', b));
  }
  if (!DB.all('coachNotes').length) {
    DB.insert('coachNotes', {
      client:'Nguyễn Minh Anh',
      title:'Điều chỉnh ngân sách mua sắm',
      content:'Đề nghị giảm mua sắm 500.000 đ và chuyển sang quỹ khẩn cấp.',
      created:'2026-10-01'
    });
  }

  const clientSelect  = document.querySelector('select.btn');
  const noteForm      = document.getElementById('noteForm');
  const noteTextarea  = document.getElementById('note');
  const noteTitleIn   = noteForm?.querySelector('input[type="text"]');
  let currentClient = clientSelect?.value || 'Nguyễn Minh Anh';

  /* =========================================================
     CLIENT DROPDOWN + LOAD BUDGET
     ========================================================= */
  function renderClientOptions() {
    if (!clientSelect) return;
    const clients = Array.from(new Set(DB.all('budgets').map(b => b.client)));
    clientSelect.innerHTML = clients.map(c =>
      `<option${c === currentClient ? ' selected' : ''}>${UI.esc(c)}</option>`).join('');
  }

  function loadBudget() {
    const b = DB.all('budgets').find(x => x.client === currentClient);
    if (!b) return;

    const stats = document.querySelectorAll('.stat');
    if (stats[0]?.querySelector('.value')) stats[0].querySelector('.value').textContent = money(b.total);
    if (stats[1]) {
      stats[1].querySelector('.value').textContent = money(b.spent);
      const pct = Math.round((b.spent / b.total) * 100);
      const delta = stats[1].querySelector('.delta');
      if (delta) delta.textContent = pct + '% kế hoạch';
    }
    if (stats[2]) {
      const diff = b.total - b.spent;
      stats[2].querySelector('.value').textContent = (diff >= 0 ? '+' : '') + money(diff);
      const delta = stats[2].querySelector('.delta');
      if (delta) delta.textContent = diff >= 0 ? 'Tốt hơn dự kiến' : 'Vượt kế hoạch';
    }

    const tbl = document.querySelectorAll('table')[0];
    const tbody = tbl?.querySelector('tbody');
    if (tbody && b.lines) {
      tbody.innerHTML = b.lines.map(l => {
        const diff = l.plan - l.actual;
        const color = diff >= 0 ? '#2e9e5b' : '#e05252';
        const sign = diff >= 0 ? '-' : '+';
        return `<tr>
          <td>${UI.esc(l.cat)}</td>
          <td>${money(l.plan)}</td>
          <td>${money(l.actual)}</td>
          <td style="color:${color}">${sign}${money(Math.abs(diff))}</td>
        </tr>`;
      }).join('');
    }

    const lastNote = DB.all('coachNotes').filter(n => n.client === currentClient).slice(-1)[0];
    if (lastNote && noteTitleIn && noteTextarea) {
      noteTitleIn.value = lastNote.title;
      noteTextarea.value = lastNote.content;
    }
  }

  clientSelect?.addEventListener('change', () => {
    currentClient = clientSelect.value;
    loadBudget();
  });

  /* =========================================================
     INJECT: Budget edit modal
     ========================================================= */
  if (!document.getElementById('budgetModal')) {
    const m = document.createElement('div');
    m.className = 'modal-backdrop';
    m.id = 'budgetModal';
    m.innerHTML = `
      <div class="modal">
        <div class="modal-head">
          <h3>Chỉnh sửa ngân sách</h3>
          <button class="icon-btn" onclick="closeModal('budgetModal')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <form id="budgetForm" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field" style="grid-column:1/-1"><label>Khách hàng</label><input type="text" id="bClient" readonly style="background:#f4fbff"></div>
          <div class="field"><label>Ngân sách tháng</label><input type="text" id="bTotal" data-required><span class="err"></span></div>
          <div class="field"><label>Đã chi</label><input type="text" id="bSpent" data-required><span class="err"></span></div>
          <div style="grid-column:1/-1;display:flex;gap:10px">
            <button class="btn primary" type="submit">Lưu thay đổi</button>
            <button class="btn" type="button" onclick="closeModal('budgetModal')">Hủy</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(m);

    document.getElementById('budgetForm').addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(e.target)) return;
      const total = parseInt(document.getElementById('bTotal').value.replace(/[^\d]/g, ''), 10) || 0;
      const spent = parseInt(document.getElementById('bSpent').value.replace(/[^\d]/g, ''), 10) || 0;
      const existing = DB.all('budgets').find(b => b.client === currentClient);
      if (existing) DB.update('budgets', existing.id, { total, spent });
      else DB.insert('budgets', { client: currentClient, month: '2026-10', total, spent, lines: [] });
      closeModal('budgetModal');
      loadBudget();
      toast('Đã cập nhật ngân sách', 'ok');
    });
  }

  // Click vào thẻ .stat để mở modal
  document.querySelectorAll('.stat').forEach(stat => {
    stat.style.cursor = 'pointer';
    stat.title = 'Nhấn để chỉnh sửa ngân sách';
    stat.addEventListener('click', () => {
      const b = DB.all('budgets').find(x => x.client === currentClient);
      if (!b) { toast('Chưa có ngân sách cho khách hàng này', 'er'); return; }
      document.getElementById('bClient').value = b.client;
      document.getElementById('bTotal').value = String(b.total);
      document.getElementById('bSpent').value = String(b.spent);
      openModal('budgetModal');
    });
  });

  /* =========================================================
     INJECT: Note delete button (cạnh "Lưu ghi chú")
     ========================================================= */
  if (noteForm && !document.getElementById('noteDeleteBtn')) {
    const actionsRow = noteForm.querySelector('div[style*="display:flex"]');
    if (actionsRow) {
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn danger';
      delBtn.id = 'noteDeleteBtn';
      delBtn.textContent = 'Xóa ghi chú';
      delBtn.addEventListener('click', () => {
        const notes = DB.all('coachNotes').filter(n => n.client === currentClient);
        if (!notes.length) { toast('Không có ghi chú để xóa', 'er'); return; }
        if (!confirm('Xóa ghi chú gần nhất của ' + currentClient + '?')) return;
        DB.remove('coachNotes', notes[notes.length - 1].id);
        const last = DB.all('coachNotes').filter(n => n.client === currentClient).slice(-1)[0];
        if (last) { noteTitleIn.value = last.title; noteTextarea.value = last.content; }
        toast('Đã xóa ghi chú', 'ok');
      });
      actionsRow.appendChild(delBtn);
    }
  }

  /* =========================================================
     Note form: save with current client
     ========================================================= */
  noteForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (noteTextarea && noteTextarea.value.trim().length < 20) {
      noteTextarea.classList.add('error');
      noteTextarea.parentElement.querySelector('.err').textContent = 'Ghi chú cần tối thiểu 20 ký tự.';
      return;
    }
    if (!validate(e.target)) return;
    DB.insert('coachNotes', {
      client: currentClient,
      title:  noteTitleIn?.value.trim() || 'Ghi chú',
      content: noteTextarea.value.trim(),
      created: UI.todayISO()
    });
    toast('Đã gửi ghi chú tới ' + currentClient, 'ok');
  });

  /* ---------- Init ---------- */
  renderClientOptions();
  loadBudget();
});