document.addEventListener('DOMContentLoaded', () => {
  const queue = document.getElementById('modQueue');
  if (!queue) return;
  let currentId = null;

  function renderQueue() {
    const items = DB.find('resources', { status: 'pending' });
    queue.innerHTML = items.length ? items.map(it => `
      <div class="card" style="padding:12px;cursor:pointer;${it.id === currentId ? 'border-color:#7fd4e8' : ''}" data-id="${it.id}">
        <div style="font-weight:600;font-size:13.5px">${UI.esc(it.title)}</div>
        <div style="font-size:12px;color:#567a88;margin-top:4px">Bởi ${UI.esc(it.author)} · 1 giờ trước</div>
      </div>`).join('')
      : UI.emptyState('Hàng đợi trống', 'Không có nội dung chờ duyệt.');
          const countEl = document.getElementById('queueCount');
    if (countEl) countEl.textContent = items.length + ' nội dung';
  }

  function loadDetail(id) {
    const it = DB.get('resources', id);
    if (!it) return;
    currentId = id;
    document.getElementById('rvTitle').textContent = it.title;
    document.getElementById('rvBody').textContent  = it.desc || 'Nội dung mẫu cho tài nguyên.';
    renderQueue();
  }

  queue.addEventListener('click', e => {
    const card = e.target.closest('[data-id]');
    if (card) {
      loadDetail(card.dataset.id);
      toast('Đã chọn: ' + DB.get('resources', card.dataset.id).title, 'wr');
    }
  });

  /* Replace inline onclick của các nút duyệt */
  document.querySelectorAll('.card button').forEach(b => {
    const text = b.textContent.trim();
    if (text === 'Duyệt') {
      b.onclick = () => {
        if (!currentId) return;
        const r = DB.get('resources', currentId);
        DB.update('resources', currentId, { status: 'approved' });
        renderQueue();
        toast('Đã duyệt tài nguyên "' + r.title + '"', 'ok');
        currentId = null;
      };
    } else if (text === 'Yêu cầu sửa') {
      b.onclick = () => {
        if (!currentId) return;
        DB.update('resources', currentId, { status: 'draft' });
        renderQueue();
        toast('Đã yêu cầu sửa tài nguyên', 'wr');
        currentId = null;
      };
    } else if (text === 'Từ chối') {
      b.onclick = () => {
        if (!currentId) return;
        DB.update('resources', currentId, { status: 'rejected' });
        renderQueue();
        toast('Đã từ chối tài nguyên', 'er');
        currentId = null;
      };
    }
  });

  renderQueue();
  const first = DB.find('resources', { status: 'pending' })[0];
  if (first) loadDetail(first.id);
});