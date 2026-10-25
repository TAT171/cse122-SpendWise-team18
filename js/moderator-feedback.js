document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('fbList');
  if (!list) return;
  let currentId = null;

    function renderList() {
    const items = DB.all('feedback');

    if (!items.length) {
      list.innerHTML = UI.emptyState(
        'Chưa có phản hồi nào',
        'Khi người dùng gửi báo cáo lỗi AI hoặc góp ý, phản hồi sẽ hiển thị ở đây để bạn xử lý.'
      );

      const detail = document.getElementById('fbDetailPanel');
      if (detail) {
        detail.innerHTML = UI.emptyState(
          'Chưa chọn phản hồi',
          'Chọn một phản hồi ở danh sách bên trái để xem chi tiết và phản hồi lại người dùng.'
        );
      }
      return;
    }

    list.innerHTML = items.map((it, i) => `
      <div class="card" style="padding:12px;cursor:pointer;${it.id === currentId ? 'border-color:#7fd4e8' : ''}" data-id="${it.id}">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:12px;color:#567a88">#${it.id}</span>
          <span class="badge ${it.level === 'Cao' ? 'er' : it.level === 'Thấp' ? 'ok' : 'wr'}">${it.level}</span>
        </div>
        <div style="font-weight:600;font-size:13.5px">${UI.esc(it.title)}</div>
      </div>`).join('');
  }

  function loadDetail(id) {
    const it = DB.get('feedback', id);
    if (!it) return;
    currentId = id;
    document.getElementById('fbCode').textContent   = '#' + it.id;
    const st = document.getElementById('fbStatus');
    st.textContent = it.status === 'closed' ? 'Đã xử lý' : 'Đang xử lý';
    st.className = 'badge ' + (it.status === 'closed' ? 'ok' : 'wr');
    document.getElementById('fbTitle').textContent = it.title;
    document.getElementById('fbDesc').textContent  = it.desc;
    renderList();
  }

  list.addEventListener('click', e => {
    const card = e.target.closest('[data-id]');
    if (card) loadDetail(card.dataset.id);
  });

  window.handleResolveFB = function () {
    const reply = document.getElementById('fbReply');
    if (reply && !reply.value.trim()) { toast('Vui lòng nhập phản hồi trước khi giải quyết', 'er'); reply.focus(); return; }
    if (!currentId) { toast('Chưa chọn phản hồi', 'er'); return; }
    DB.update('feedback', currentId, { status: 'closed' });
    if (reply) reply.value = '';
    renderList();
    toast('Đã giải quyết và gửi phản hồi cho người dùng', 'ok');
  };

  renderList();
  const first = DB.all('feedback')[0];
  if (first) loadDetail(first.id);
});