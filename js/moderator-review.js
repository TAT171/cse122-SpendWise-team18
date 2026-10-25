document.addEventListener('DOMContentLoaded', () => {
  const queue = document.getElementById('modQueue');
  if (!queue) return;
  
  let currentId = null;
  let currentFilter = 'pending';

  function renderQueue() {
    const items = currentFilter === 'all' 
      ? DB.all('resources') 
      : DB.find('resources', { status: currentFilter });
      
    queue.innerHTML = items.length ? items.map(it => {
      let badge = '';
      if (it.status === 'approved') badge = '<span class="badge ok">Đã duyệt</span>';
      else if (it.status === 'rejected') badge = '<span class="badge er">Từ chối</span>';
      else if (it.status === 'draft') badge = '<span class="badge wr">Cần sửa</span>';
      else badge = '<span class="badge wr">Chờ duyệt</span>';

      return `
      <div class="card" style="padding:12px;cursor:pointer;${it.id === currentId ? 'border-color:#7fd4e8;background:#f4fbff' : ''}" data-id="${it.id}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px">
          <div style="font-weight:600;font-size:13.5px">${UI.esc(it.title)}</div>
          ${badge}
        </div>
        <div style="font-size:12px;color:#567a88">Bởi ${UI.esc(it.author)}</div>
      </div>`;
    }).join('')
      : UI.emptyState('Trống', `Không có tài nguyên nào ở trạng thái này.`);

    const countEl = document.getElementById('queueCount');
    if (countEl) countEl.textContent = items.length + ' nội dung';
    
    if (!items.length) {
      document.getElementById('rvTitle').textContent = 'Chưa chọn tài nguyên';
      document.getElementById('rvBody').textContent = 'Vui lòng chọn một tài nguyên ở cột bên trái.';
      const actionWrap = document.getElementById('rvActionButtons');
      if (actionWrap) actionWrap.style.display = 'none';
    }
  }

  function loadDetail(id) {
    const it = DB.get('resources', id);
    if (!it) return;
    currentId = id;
    
    document.getElementById('rvTitle').textContent = it.title;
    document.getElementById('rvBody').textContent  = it.desc || 'Chưa có nội dung chi tiết cho tài nguyên này.';
    
    const stepsList = document.getElementById('rvSteps');
    if (stepsList) {
      if (it.steps && it.steps.length > 0) {
        stepsList.innerHTML = it.steps.map(step => `<li>${UI.esc(step)}</li>`).join('');
      } else {
        stepsList.innerHTML = '<li style="color:#93aeb8; list-style:none; margin-left:-20px;">Chưa có gợi ý thực hiện nào.</li>';
      }
    }
    
    const statusBadge = document.querySelector('.card .badge.er'); 
    if (statusBadge) {
        statusBadge.textContent = it.status === 'pending' ? 'Chờ duyệt' : 
                                  it.status === 'approved' ? 'Đã duyệt' : 'Từ chối';
        statusBadge.className = 'badge ' + (it.status === 'approved' ? 'ok' : 'er');
    }

    const actionWrap = document.getElementById('rvActionButtons');
    if (actionWrap) {
      actionWrap.style.display = it.status === 'pending' ? 'flex' : 'none';
    }
    
    renderQueue(); 
  }

  queue.addEventListener('click', e => {
    const card = e.target.closest('[data-id]');
    if (card) loadDetail(card.dataset.id);
  });

  window.handleModAction = function(action) {
    if (!currentId) return;
    const r = DB.get('resources', currentId);
    DB.update('resources', currentId, { status: action, updated: UI.todayISO() });
    
    if (action === 'approved') toast('Đã duyệt tài nguyên "' + r.title + '"', 'ok');
    else if (action === 'rejected') toast('Đã từ chối tài nguyên', 'er');
    
    currentId = null;
    renderQueue();
    document.getElementById('rvTitle').textContent = 'Chưa chọn tài nguyên';
    document.getElementById('rvBody').textContent = 'Vui lòng chọn một tài nguyên ở cột bên trái.';
    const actionWrap = document.getElementById('rvActionButtons');
    if (actionWrap) actionWrap.style.display = 'none';
  };

  window.filterModQueue = function(status) {
    currentFilter = status;
    currentId = null;
    renderQueue();
  };

  renderQueue();
  const first = DB.find('resources', { status: 'pending' })[0];
  if (first) loadDetail(first.id);
});