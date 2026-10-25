document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('userBody');
  if (!tbody) return;

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

    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="border:none">' +
        UI.emptyState(
          'Chưa có người dùng nào',
          'Bấm "Mời tài khoản" ở góc phải để thêm người dùng đầu tiên vào hệ thống.'
        ) + '</td></tr>';
      updateDisableBtn();
      return;
    }

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

    function updateDisableBtn() {
    const count = tbody.querySelectorAll('.userChk:checked').length;

    const infoEl = document.querySelector('[data-selected-info]');
    if (infoEl) infoEl.textContent = 'Đã chọn ' + count + ' người dùng';

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

  document.querySelectorAll('[onclick*="openModal(\'disableModal\')"]').forEach(b => {
    b.onclick = () => {
      if (!tbody.querySelectorAll('.userChk:checked').length) {
        toast('Vui lòng chọn người dùng trước', 'er');
        return;
      }
      openModal('disableModal');
    };
  });

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

    window.confirmDisable = function() {
    const reason = document.getElementById('disableReason')?.value.trim();
    if (!reason) {
      toast('Vui lòng nhập lý do vô hiệu hóa', 'er');
      document.getElementById('disableReason').focus();
      return;
    }
    
    const ids = Array.from(tbody.querySelectorAll('.userChk:checked')).map(c => c.closest('tr').dataset.id);
    if (!ids.length) { 
      toast('Chưa chọn người dùng nào', 'er'); 
      closeModal('disableModal');
      return; 
    }
    if (ids.includes('u-1')) {toast('Không thể vô hiệu hóa tài khoản đang đăng nhập', 'er'); return;}
    ids.forEach(id => DB.update('users', id, { status: 'Vô hiệu hóa' }));
    closeModal('disableModal');
    document.getElementById('disableReason').value = ''; // Reset ô nhập
    render();
    toast('Đã vô hiệu hóa ' + ids.length + ' tài khoản', 'er');
  };
  if (!tbody.dataset.initDone) {
    tbody.innerHTML = UI.skeletonRows(4, 6);
    setTimeout(() => {
      tbody.dataset.initDone = '1';
      render();
    }, 280);
  } else {
    render();
  }});