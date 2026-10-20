/* =========================================================
   Admin – User Management (full CRUD + disabled button)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('userBody');
  if (!tbody) return;

  /* ---------- Inject edit modal ---------- */
  if (!document.getElementById('userEditModal')) {
    const m = document.createElement('div');
    m.className = 'modal-backdrop';
    m.id = 'userEditModal';
    m.innerHTML = `
      <div class="modal">
        <div class="modal-head">
          <h3>Sửa người dùng</h3>
          <button class="icon-btn" onclick="closeModal('userEditModal')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <form id="userEditForm" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field"><label>Họ tên</label><input type="text" id="ueName" data-required><span class="err"></span></div>
          <div class="field"><label>Vai trò</label>
            <select id="ueRole">
              <option>Người dùng</option><option>Huấn luyện viên</option>
              <option>Kiểm duyệt</option><option>Quản trị viên</option>
            </select>
          </div>
          <div style="grid-column:1/-1;display:flex;gap:10px">
            <button class="btn primary" type="submit">Lưu thay đổi</button>
            <button class="btn" type="button" onclick="closeModal('userEditModal')">Hủy</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(m);

    document.getElementById('userEditForm').addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(e.target)) return;
      const id = e.target.dataset.editId;
      if (!id) return;
      DB.update('users', id, {
        name: document.getElementById('ueName').value.trim(),
        role: document.getElementById('ueRole').value
      });
      closeModal('userEditModal');
      render();
      toast('Đã cập nhật người dùng', 'ok');
    });
  }

    function render() {
    const users = DB.all('users');

    // ---- Empty state ----
    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="border:none">' +
        UI.emptyState(
          'Chưa có người dùng nào',
          'Bấm "Mời tài khoản" ở góc phải để thêm người dùng đầu tiên vào hệ thống.'
        ) + '</td></tr>';
      updateDisableBtn();
      return;
    }

    // ---- Có data ----
    tbody.innerHTML = users.map(u => `
      <tr data-id="${u.id}">
        <td><input type="checkbox" class="userChk" style="accent-color:#4db8d4;width:15px;height:15px"></td>
        <td><b>${UI.esc(u.name)}</b></td>
        <td>${UI.esc(u.role)}</td>
        <td><span class="badge ${u.status === 'Hoạt động' ? 'ok' : 'er'}">${UI.esc(u.status)}</span></td>
        <td style="color:#567a88">${UI.esc(u.last)}</td>
        <td><a data-act="edit" data-id="${u.id}" style="color:#4db8d4">Sửa</a></td>
      </tr>`).join('');

    tbody.querySelectorAll('.userChk').forEach(c => c.addEventListener('change', updateDisableBtn));
    updateDisableBtn();
  }

  /* ---------- Disabled state cho nút "Vô hiệu hóa" ---------- */
    function updateDisableBtn() {
    const count = tbody.querySelectorAll('.userChk:checked').length;

    // Cập nhật text "Đã chọn X người dùng"
    const infoEl = document.querySelector('[data-selected-info]');
    if (infoEl) infoEl.textContent = 'Đã chọn ' + count + ' người dùng';

    // Cập nhật text trong card "Xác nhận vô hiệu hóa" — thay vì hardcode "2"
    const disableCountEl = document.getElementById('disableCount');
    if (disableCountEl) disableCountEl.textContent = count;

    // Disable nút "Vô hiệu hóa" khi chưa chọn ai
    document.querySelectorAll('.btn.danger').forEach(b => {
      if (/Vô hiệu hóa/.test(b.textContent)) b.disabled = count === 0;
    });
  }

  tbody.addEventListener('click', e => {
    const a = e.target.closest('[data-act="edit"]');
    if (!a) return;
    const u = DB.get('users', a.dataset.id);
    if (!u) return;
    document.getElementById('ueName').value = u.name;
    document.getElementById('ueRole').value = u.role;
    document.getElementById('userEditForm').dataset.editId = u.id;
    openModal('userEditModal');
  });

  /* ---------- Modal disable ---------- */
  document.querySelectorAll('[onclick*="openModal(\'disableModal\')"]').forEach(b => {
    b.onclick = () => {
      if (!tbody.querySelectorAll('.userChk:checked').length) {
        toast('Vui lòng chọn người dùng trước', 'er');
        return;
      }
      openModal('disableModal');
    };
  });

  document.querySelectorAll('#disableModal button').forEach(b => {
    if (b.textContent.trim() === 'Xác nhận') {
      b.onclick = () => {
        const ids = Array.from(tbody.querySelectorAll('.userChk:checked')).map(c => c.closest('tr').dataset.id);
        ids.forEach(id => DB.update('users', id, { status: 'Vô hiệu hóa' }));
        closeModal('disableModal');
        render();
        toast('Đã vô hiệu hóa ' + ids.length + ' tài khoản', 'er');
      };
    }
  });

  /* ---------- Mời tài khoản ---------- */
  document.querySelectorAll('button').forEach(b => {
    if (b.textContent.trim() === 'Gửi lời mời') {
      b.onclick = () => {
        const card = b.closest('.card');
        const email = card?.querySelector('input[type="email"]')?.value?.trim();
        const role  = card?.querySelector('select')?.value || 'Người dùng';
        if (!email) { toast('Vui lòng nhập email', 'er'); return; }
        DB.insert('users', { name: email.split('@')[0], role, status: 'Hoạt động', last: 'Chưa đăng nhập' });
        render();
        toast('Đã gửi lời mời tới ' + email, 'ok');
      };
    }
  });

  window.handleDisable = function () {
    const r = document.getElementById('disableReason');
    if (r && !r.value.trim()) { toast('Vui lòng nhập lý do', 'er'); r.focus(); return; }
    const ids = Array.from(tbody.querySelectorAll('.userChk:checked')).map(c => c.closest('tr').dataset.id);
    if (!ids.length) { toast('Chưa chọn người dùng nào', 'er'); return; }
    ids.forEach(id => DB.update('users', id, { status: 'Vô hiệu hóa' }));
    render();
    toast('Đã vô hiệu hóa ' + ids.length + ' tài khoản', 'er');
  };

  // ---- Skeleton loading lần đầu ----
  if (!tbody.dataset.initDone) {
    tbody.innerHTML = UI.skeletonRows(4, 6);
    setTimeout(() => {
      tbody.dataset.initDone = '1';
      render();
    }, 280);
  } else {
    render();
  }});