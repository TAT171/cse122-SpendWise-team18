/* =========================================================
   User Saving Goals – CRUD + AI Goal Coach (DB)
   ========================================================= */
function renderGoals() {
  const status = document.querySelector('#goalTabs .tab.active')?.dataset.grp || 'active';
  const list = DB.all('goals').filter(g => g.grp === status);
  const el = document.getElementById('goalList');
  if (!el) return;

  el.innerHTML = list.length ? list.map(g => `
    <article class="card" data-id="${g.id}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-weight:600">${UI.esc(g.name)}</div>
        <span class="badge ${g.tc}">${UI.esc(g.tag)}</span>
      </div>
      <div style="font-size:13px;color:#567a88;margin-bottom:10px">${money(g.cur)} / ${money(g.target)}</div>
      <div class="progress" style="margin-bottom:10px">
        <div class="bar ${g.prog >= 90 ? 'er' : g.prog >= 60 ? '' : 'wr'}" style="width:${g.prog}%"></div>
      </div>
      <div style="font-size:12px;color:#567a88;margin-bottom:10px">${g.prog}% hoàn thành</div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#567a88">
        <span>Hạn: ${fmtDate(g.deadline)}</span>
        <span>
          <a style="color:#4db8d4" data-act="edit" data-id="${g.id}">Sửa</a> ·
          <a style="color:#4db8d4" data-act="archive" data-id="${g.id}">Lưu trữ</a>
        </span>
      </div>
    </article>`).join('')
    : `<div class="card" style="grid-column:1/-1"><div class="empty"><div class="ico">🎯</div>Chưa có mục tiêu nào trong nhóm này.</div></div>`;
}

document.getElementById('goalList')?.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (!a) return;
  const id = a.dataset.id;
  const g = DB.get('goals', id);
  if (!g) return;
  
  if (a.dataset.act === 'edit') {
    document.getElementById('gName').value = g.name;
    document.getElementById('gAmt').value  = String(g.target);
    document.getElementById('gDeadline').value = g.deadline;
    document.getElementById('goalForm').dataset.editId = id;
    document.getElementById('newGoal').scrollIntoView({ behavior: 'smooth' });
    toast('Đang chỉnh sửa: ' + g.name, 'wr');
  } else if (a.dataset.act === 'archive') {
    if (confirm('Lưu trữ mục tiêu "' + g.name + '"?')) {
      DB.update('goals', id, { grp: 'arc', tag: 'Đã lưu trữ', tc: 'muted' });
      renderGoals();
      toast('Đã lưu trữ: ' + g.name, 'ok');
    }
  }
});

async function runGoal() {
  const nameInput = document.getElementById('gName');
  const name = nameInput.value.trim();
  const amount   = parseInt(document.getElementById('gAmt').value.replace(/[^\d]/g, ''), 10) || 0;
  const deadline = document.getElementById('gDeadline').value || '';

  // Chặn AI chạy nếu thiếu tên
  if (!name) {
    toast('Vui lòng nhập tên mục tiêu trước khi dùng AI', 'er');
    nameInput.classList.add('error');
    nameInput.focus();
    return;
  }
  nameInput.classList.remove('error');

  const wrap = document.getElementById('aiGoalBody');
  wrap.innerHTML = `<div class="ai-loading"><div class="spinner"></div> AI đang xây dựng lộ trình…</div>`;
  
  const r = await AI.goalCoach(name, amount, deadline);

  if (!r.success) {
    wrap.innerHTML = AI.renderFailure({
      message: r.message || r.error || 'Không đủ dữ liệu để lập lộ trình.',
      onEdit:  "document.getElementById('gAmt').focus()",
      onRetry: 'runGoal()',
      onReport: "AI.reportFailure('AI-3 Goal Coach','Thiếu thông tin mục tiêu')"
    });
    return;
  }

  window.__lastGoalPlan = Object.assign({ name, amount, deadline }, r);
  const pct = Math.round(r.data.confidence * 100);

  // Hiển thị kết quả dưới dạng textarea cho phép sửa
  wrap.innerHTML = `
    <div class="ai-result">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px">
        <div style="font-weight:600">Kế hoạch ${r.data.steps.length} bước (Có thể chỉnh sửa):</div>
        <span class="badge info">Confidence ${pct}%</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${r.data.steps.map((s, i) => `
          <div class="field" style="margin:0">
            <label style="font-size:12px; color:#567a88">Bước ${i + 1}</label>
            <textarea class="edit-step-input" style="min-height:50px; font-size:13.5px; padding:8px 12px;">${UI.esc(s)}</textarea>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="ai-reason" style="margin-top:12px"><b>Vì sao?</b> ${r.data.reason}</div>
    <div class="ai-reason" style="font-size:11.5px;color:#93aeb8;margin-top:6px"><b>Lưu ý:</b> ${r.data.disclaimer || AI.DISCLAIMER}</div>
    
    <div class="ai-actions">
      <button class="btn dark" onclick="toast('Đã chấp nhận lộ trình','ok')">Chấp nhận</button>
      <button class="btn" onclick="document.querySelector('.edit-step-input').focus(); toast('Nhấp vào các ô để sửa trực tiếp','wr')">Sửa</button>
      <button class="btn" onclick="toast('Đã từ chối lộ trình','wr')">Từ chối</button>
      <button class="btn" onclick="runGoal()">Tạo lại</button>
      <button class="btn primary" onclick="saveGoalPlan()">Lưu</button>
    </div>`;
}

function saveGoalPlan() {
  const plan = window.__lastGoalPlan;
  if (!plan) { toast('Chưa có lộ trình để lưu', 'er'); return; }

  const editedSteps = Array.from(document.querySelectorAll('.edit-step-input'))
                           .map(el => el.value.trim())
                           .filter(text => text !== '');

  const form = document.getElementById('goalForm');
  const editId = form?.dataset.editId;

  if (editId) {
    DB.update('goals', editId, {
      name: plan.name, target: plan.amount, deadline: plan.deadline,
      plan: editedSteps
    });
    delete form.dataset.editId;
    toast('Đã cập nhật mục tiêu với lộ trình AI', 'ok');
  } else {
    DB.insert('goals', {
      name: plan.name, cur: 0, target: plan.amount, prog: 0,
      tag: 'Mới', tc: 'info', deadline: plan.deadline, grp: 'active',
      plan: editedSteps
    });
    toast('Đã lưu mục tiêu mới với lộ trình AI', 'ok');
  }
  renderGoals();
}

window.runGoal = runGoal;
window.saveGoalPlan = saveGoalPlan;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#goalTabs .tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('#goalTabs .tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    renderGoals();
  }));
  renderGoals();

  document.getElementById('runGoal')?.addEventListener('click', runGoal);

  document.getElementById('goalForm')?.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(e.target)) return;
    const name     = document.getElementById('gName').value.trim();
    const target   = parseInt(document.getElementById('gAmt').value.replace(/[^\d]/g, ''), 10) || 0;
    const deadline = document.getElementById('gDeadline').value;
    const editId   = e.target.dataset.editId;

    if (editId) {
      DB.update('goals', editId, { name, target, deadline });
      delete e.target.dataset.editId;
      toast('Đã cập nhật mục tiêu', 'ok');
    } else {
      DB.insert('goals', {
        name, cur: 0, target, prog: 0,
        tag: 'Mới', tc: 'info', deadline, grp: 'active'
      });
      toast('Đã lưu mục tiêu mới', 'ok');
    }
    renderGoals();
  });
});