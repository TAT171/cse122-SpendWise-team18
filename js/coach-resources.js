/* =========================================================
   Coach – Resource Management (full CRUD)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('resBody');
  if (!tbody) return;

  const STATUS_MAP = {
    approved: { label:'Đã duyệt',  cls:'ok'    },
    pending:  { label:'Chờ duyệt', cls:'er'    },
    draft:    { label:'Bản nháp',  cls:'muted' },
    rejected: { label:'Từ chối',   cls:'er'    }
  };

  /* ---------- Inject edit modal ---------- */
  if (!document.getElementById('resEditModal')) {
    const m = document.createElement('div');
    m.className = 'modal-backdrop';
    m.id = 'resEditModal';
    m.innerHTML = `
      <div class="modal">
        <div class="modal-head">
          <h3>Sửa tài nguyên</h3>
          <button class="icon-btn" onclick="closeModal('resEditModal')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <form id="resEditForm" style="display:flex;flex-direction:column;gap:12px">
          <div class="field"><label>Tiêu đề</label><input type="text" id="reTitle" data-required><span class="err"></span></div>
          <div class="field"><label>Danh mục</label>
            <select id="reCat"><option>Tiết kiệm</option><option>Ngân sách</option><option>Thói quen</option><option>Kế hoạch</option></select>
          </div>
          <div style="display:flex;gap:10px">
            <button class="btn primary" type="submit">Lưu thay đổi</button>
            <button class="btn" type="button" onclick="closeModal('resEditModal')">Hủy</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(m);

    document.getElementById('resEditForm').addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(e.target)) return;
      const id = e.target.dataset.editId;
      if (!id) return;
      DB.update('resources', id, {
        title:   document.getElementById('reTitle').value.trim(),
        cat:     document.getElementById('reCat').value,
        updated: UI.todayISO()
      });
      closeModal('resEditModal');
      render();
      toast('Đã cập nhật tài nguyên', 'ok');
    });
  }

  function render() {
    const list = DB.all('resources').filter(r => r.author === 'HLV Thu Trang');
    tbody.innerHTML = list.map(r => {
      const st = STATUS_MAP[r.status] || { label: r.status, cls:'muted' };
      return `
        <tr data-id="${r.id}">
          <td>${UI.esc(r.title)}</td>
          <td>${UI.esc(r.cat)}</td>
          <td><span class="badge ${st.cls}">${st.label}</span></td>
          <td>${fmtDate(r.updated)}</td>
          <td><div class="row-actions">
            <a data-act="edit" data-id="${r.id}">Sửa</a> ·
            <a data-act="preview" data-id="${r.id}">Xem trước</a>
            ${r.status === 'draft'    ? `· <a data-act="submit"  data-id="${r.id}">Gửi duyệt</a>` : ''}
            ${r.status === 'rejected' ? `· <a data-act="archive" data-id="${r.id}">Lưu trữ</a>`    : ''}
          </div></td>
        </tr>`;
    }).join('');
  }

  tbody.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const id = a.dataset.id, r = DB.get('resources', id);
    if (!r) return;
    if (a.dataset.act === 'edit') {
      document.getElementById('reTitle').value = r.title;
      document.getElementById('reCat').value = r.cat;
      document.getElementById('resEditForm').dataset.editId = id;
      openModal('resEditModal');
    } else if (a.dataset.act === 'preview') {
      toast('Đang tải xem trước…', 'wr');
    } else if (a.dataset.act === 'submit') {
      DB.update('resources', id, { status: 'pending', updated: UI.todayISO() });
      render();
      toast('Đã gửi duyệt: ' + r.title, 'ok');
    } else if (a.dataset.act === 'archive') {
      if (confirm('Lưu trữ "' + r.title + '"?')) {
        DB.remove('resources', id);
        render();
        toast('Đã lưu trữ: ' + r.title, 'ok');
      }
    }
  });

  document.getElementById('resForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const body = document.getElementById('resBodyInput');
    if (body && body.value.trim().length < 100) {
      body.classList.add('error');
      body.parentElement.querySelector('.err').textContent = 'Nội dung cần tối thiểu 100 ký tự.';
      return;
    }
    if (!validate(e.target)) return;
    const title = e.target.querySelector('input[type="text"]').value.trim();
    DB.insert('resources', {
      title, cat:'Ngân sách', status:'pending',
      author:'HLV Thu Trang', updated: UI.todayISO()
    });
    render();
    toast('Đã gửi kiểm duyệt', 'ok');
    e.target.reset();
  });

  render();
});