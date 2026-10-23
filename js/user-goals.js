/* =========================================================
   User Saving Goals – CRUD + AI Goal Coach (DB)
   ========================================================= */
function renderGoals() {
  const status = document.querySelector('#goalTabs .tab.active')?.dataset.grp || 'active';
  const list = DB.all('goals').filter(g => g.grp === status);
  const el = document.getElementById('goalList');
  if (!el) return;

  el.innerHTML = list.length ? list.map(g => `
    <div class="card" data-id="${g.id}">
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
    </div>`).join('')
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
  const name     = document.getElementById('gName').value || 'Mục tiêu';
  const amount   = parseInt(document.getElementById('gAmt').value.replace(/[^\d]/g, ''), 10) || 0;
  const deadline = document.getElementById('gDeadline').value || '';
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

  wrap.innerHTML = `
    <div class="ai-result">
    <div style="font-weight:600;margin-bottom:8px">Kế hoạch ${r.data.steps.length} bước:</div>
    <ol>${r.data.steps.map(s => `<li>${s}</li>`).join('')}</ol>
  </div>
  <div class="ai-reason"><b>Vì sao?</b> ${r.data.reason}</div>    <div class="ai-reason" style="font-size:11.5px;color:#93aeb8;margin-top:6px"><b>Lưu ý:</b> ${(r.data && r.data.disclaimer) || AI.DISCLAIMER}</div>
    <div class="ai-actions">
      <button class="btn dark" onclick="toast('Đã chấp nhận lộ trình','ok')">Chấp nhận</button>
      <button class="btn" onclick="toast('Đã mở chỉnh sửa lộ trình','wr')">Sửa</button>
      <button class="btn" onclick="toast('Đã từ chối lộ trình','wr')">Từ chối</button>
      <button class="btn" onclick="runGoal()">Tạo lại</button>
      <button class="btn primary" onclick="saveGoalPlan()">Lưu</button>
    </div>`;
}

function saveGoalPlan() {
  const plan = window.__lastGoalPlan;
  if (!plan) { toast('Chưa có lộ trình để lưu', 'er'); return; }

  // Nếu form đang edit một goal → cập nhật goal đó
  const form = document.getElementById('goalForm');
  const editId = form?.dataset.editId;

  if (editId) {
    DB.update('goals', editId, {
      name: plan.name,
      target: plan.amount,
      deadline: plan.deadline,
      plan: plan.data.steps
    });
    delete form.dataset.editId;
    toast('Đã cập nhật mục tiêu với lộ trình AI', 'ok');
  } else {
    DB.insert('goals', {
      name: plan.name,
      cur: 0,
      target: plan.amount,
      prog: 0,
      tag: 'Mới',
      tc: 'info',
      deadline: plan.deadline,
      grp: 'active',
      plan: plan.data.steps
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

window.runGoal = runGoal;
