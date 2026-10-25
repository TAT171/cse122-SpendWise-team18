/* =========================================================
   Admin – Expense Category Management (full CRUD)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('catBody');
  const form  = document.getElementById('catForm');
  if (!tbody) return;

  /* ---------- Inject edit modal (ẩn mặc định) ---------- */
  if (!document.getElementById('catEditModal')) {
    const m = document.createElement('div');
    m.className = 'modal-backdrop';
    m.id = 'catEditModal';
    m.innerHTML = `
      <div class="modal">
        <div class="modal-head">
          <h3>Sửa danh mục</h3>
          <button class="icon-btn" onclick="closeModal('catEditModal')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <form id="catEditForm" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field"><label>Tên</label><input type="text" id="ceName" data-required><span class="err"></span></div>
          <div class="field"><label>Màu</label><input type="color" id="ceColor" value="#7fd4e8"></div>
          <div class="field" style="grid-column:1/-1"><label>Từ khoá</label><input type="text" id="ceKeywords"></div>
          <div style="grid-column:1/-1;display:flex;gap:10px">
            <button class="btn primary" type="submit">Lưu thay đổi</button>
            <button class="btn" type="button" onclick="closeModal('catEditModal')">Hủy</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(m);

    document.getElementById('catEditForm').addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(e.target)) return;
      const id = e.target.dataset.editId;
      if (!id) return;
      DB.update('categories', id, {
        name:     document.getElementById('ceName').value.trim(),
        color:    document.getElementById('ceColor').value,
        keywords: document.getElementById('ceKeywords').value.trim()
      });
      closeModal('catEditModal');
      render();
      toast('Đã cập nhật danh mục', 'ok');
    });
  }

  /* ---------- Render ---------- */
  function render() {
    const cats = DB.all('categories');
    tbody.innerHTML = cats.length ? cats.map(c => `
      <tr data-id="${c.id}">
        <td style="font-size:18px">${UI.esc(c.icon || '📁')}</td>
        <td><b>${UI.esc(c.name)}</b></td>
        <td><span style="display:inline-block;width:22px;height:22px;border-radius:5px;background:${UI.esc(c.color)};vertical-align:middle"></span></td>
        <td style="color:#567a88">${UI.esc(c.keywords || '—')}</td>
        <td>${c.uses || 0}</td>
        <td><span class="badge ${c.status === 'active' ? 'ok' : 'muted'}">${c.status === 'active' ? 'Đang dùng' : 'Lưu trữ'}</span></td>
        <td><div class="row-actions">
          <a data-act="edit" data-id="${c.id}">Sửa</a> ·
          ${c.status === 'active'
            ? `<a data-act="archive" data-id="${c.id}">Lưu trữ</a>`
            : `<a data-act="restore" data-id="${c.id}">Khôi phục</a>`}
        </div></td>
      </tr>`).join('')
      : '<tr><td colspan="7">' + UI.emptyState('Chưa có danh mục', 'Thêm danh mục đầu tiên.') + '</td></tr>';
  }

  tbody.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const id = a.dataset.id, cat = DB.get('categories', id);
    if (!cat) return;
    if (a.dataset.act === 'edit') {
      document.getElementById('ceName').value = cat.name;
      document.getElementById('ceColor').value = cat.color || '#7fd4e8';
      document.getElementById('ceKeywords').value = cat.keywords || '';
      document.getElementById('catEditForm').dataset.editId = id;
      openModal('catEditModal');
    } else if (a.dataset.act === 'archive') {
      if (confirm('Lưu trữ danh mục "' + cat.name + '"?')) {
        DB.update('categories', id, { status: 'archived' });
        render();
        toast('Đã lưu trữ danh mục', 'ok');
      }
    } else if (a.dataset.act === 'restore') {
      DB.update('categories', id, { status: 'active' });
      render();
      toast('Đã khôi phục danh mục', 'ok');
    }
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(form)) return;
      const inputs = form.querySelectorAll('input');
      const name = inputs[0].value.trim();
      if (!name) { toast('Vui lòng nhập tên danh mục', 'er'); return; }
      DB.insert('categories', {
        name, color: inputs[1].value, keywords: inputs[2].value.trim(),
        icon: '📁', uses: 0, status: 'active'
      });
      form.reset();
      closeModal('catModal');
      render();
      toast('Đã thêm danh mục "' + name + '"', 'ok');
    });
  }

  // ---- Skeleton loading lần đầu ----
  if (!tbody.dataset.initDone) {
    tbody.innerHTML = UI.skeletonRows(5, 7);
    setTimeout(() => {
      tbody.dataset.initDone = '1';
      render();
    }, 280);
  } else {
    render();
  }});