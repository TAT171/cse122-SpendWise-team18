/* =========================================================
   User Transactions – CRUD + LocalStorage + Phân trang thật
   ========================================================= */
let currentPage = 1;
const PAGE_SIZE = 5;

function renderTx() {
  const q         = (document.getElementById('txQ')?.value || '').toLowerCase();
  const selCat    = document.getElementById('txCat')?.value || '';
  const selType   = document.getElementById('txType')?.value || '';
  const selDate   = document.getElementById('txDateRange')?.value || 'all';

  const allData = DB.all('transactions');

  const list = allData.filter(r => {
    if (q && !r.desc.toLowerCase().includes(q) && !String(r.amt).includes(q)) return false;
    if (selCat && r.cat !== selCat) return false;
    if (selType && r.type !== selType) return false;
    if (selDate !== 'all' && !r.date.startsWith(selDate)) return false;
    return true;
  });

  const totalPages = Math.ceil(list.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedList = list.slice(startIdx, startIdx + PAGE_SIZE);

  const tbody = document.querySelector('#txTable tbody');
  if (!tbody) return;

  const getCatColor = cat => {
    if (cat === 'Ăn uống' || cat === 'Mua sắm') return 'color:#e05252';
    if (cat === 'Thu nhập') return 'color:#2e9e5b';
    if (cat === 'Di chuyển') return 'color:#4db8d4';
    return 'color:#567a88';
  };

  tbody.innerHTML = paginatedList.length ? paginatedList.map(r => `
    <tr data-id="${r.id}">
      <td style="font-weight:500;color:var(--tx)">${esc(r.desc)}</td>
      <td style="${getCatColor(r.cat)};font-weight:500">${r.cat}</td>
      <td>${r.type === 'in' ? 'Thu' : 'Chi'}</td>
      <td>${fmtDate(r.date).slice(0, 5)}</td>
      <td style="font-weight:500">${(r.amt > 0 ? '+' : '')}${money(r.amt)}</td>
      <td>
        <div class="row-actions" style="gap:6px;font-size:13px">
          <a data-act="edit" data-id="${r.id}">Sửa</a>
          ${r.type === 'out' ? `<span style="color:var(--tx3)">·</span><a data-act="archive" data-id="${r.id}">Lưu trữ</a>` : ''}
        </div>
      </td>
    </tr>`).join('')
    : `<tr><td colspan="6">
        <div class="empty">
          <div class="ico">🔍</div>
          Không tìm thấy giao dịch nào phù hợp.
          <div style="margin-top:12px">
            <button class="btn primary" onclick="resetTxFilters()">Xóa tất cả bộ lọc</button>
          </div>
        </div>
      </td></tr>`;

  const countEl = document.getElementById('txCount');
  if (countEl) {
    const start = list.length ? startIdx + 1 : 0;
    const end = Math.min(startIdx + PAGE_SIZE, list.length);
    countEl.textContent = `${start}-${end} / ${list.length} (Trang ${currentPage}/${totalPages})`;
  }

  const pager = document.getElementById('txPager');
  if (pager) {
    pager.innerHTML = `
      <button class="btn" ${currentPage <= 1 ? 'disabled' : ''} onclick="changePage(-1)">Trước</button>
      <button class="btn" ${currentPage >= totalPages ? 'disabled' : ''} onclick="changePage(1)">Sau</button>
    `;
  }
}

function changePage(dir) { currentPage += dir; renderTx(); }

function resetTxFilters() {
  document.getElementById('txQ').value = '';
  document.getElementById('txCat').value = '';
  document.getElementById('txType').value = '';
  document.getElementById('txDateRange').value = 'all';
  currentPage = 1;
  renderTx();
  toast('Đã xóa bộ lọc', 'ok');
}

['txQ', 'txCat', 'txType', 'txDateRange'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener(id === 'txQ' ? 'input' : 'change', () => {
      currentPage = 1;
      renderTx();
    });
  }
});

document.querySelector('#txTable')?.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (!a) return;
  const id = a.dataset.id;
  const tx = DB.get('transactions', id);
  if (!tx) return;
  
  if (a.dataset.act === 'edit') {
    document.getElementById('txDesc').value = tx.desc;
    document.getElementById('txAmt').value  = (tx.amt > 0 ? '+' : '') + money(tx.amt);
    document.getElementById('txDate').value = tx.date;
    document.getElementById('txCategory').value = tx.cat;
    document.getElementById('addForm').dataset.editId = id;
    document.getElementById('addForm').scrollIntoView({ behavior: 'smooth' });
    toast('Đang chỉnh sửa: ' + tx.desc, 'wr');
  } else if (a.dataset.act === 'archive') {
    if (confirm('Lưu trữ giao dịch "' + tx.desc + '"?')) {
      DB.remove('transactions', id);
      renderTx();
      toast('Đã lưu trữ giao dịch', 'ok');
    }
  }
});

document.getElementById('saveTx')?.addEventListener('click', () => {
  if (!validate(document.getElementById('txForm'))) { toast('Vui lòng nhập đủ thông tin', 'er'); return; }
  const amtStr = document.getElementById('txAmt').value.replace(/[^\d-]/g, '');
  const amt    = parseInt(amtStr, 10) || 0;
  const cat    = document.getElementById('txCategory').value;
  const type   = amt < 0 ? 'out' : 'in';
  const desc   = document.getElementById('txDesc').value.trim();
  const date   = document.getElementById('txDate').value;

  const editId = document.getElementById('addForm').dataset.editId;
  if (editId) {
    DB.update('transactions', editId, { desc, cat, type, date, amt });
    delete document.getElementById('addForm').dataset.editId;
    toast('Đã cập nhật giao dịch', 'ok');
  } else {
    DB.insert('transactions', { desc, cat, type, date, amt });
    toast('Đã lưu giao dịch mới', 'ok');
  }
  renderTx();
  resetForm();
});

async function runCat() {
  const desc = document.getElementById('txDesc')?.value || '';
  const wrap = document.getElementById('aiCatBody');

  if (!desc.trim()) {
    wrap.innerHTML = AI.renderFailure({
      message: 'Vui lòng nhập mô tả giao dịch trước khi phân loại.',
      onEdit:  "document.getElementById('txDesc').focus()",
      onRetry: 'runCat()',
      onReport: "AI.reportFailure('AI-1 Expense Categorizer','Người dùng chưa nhập mô tả')"
    });
    return;
  }

  wrap.innerHTML = `<div class="ai-loading"><div class="spinner"></div> AI đang phân loại…</div>`;
  const r = await AI.categorize(desc);
  window.__lastCatResult = r;

  const catSel = document.getElementById('txCategory');
  if (catSel) catSel.value = r.data.cat;
  wrap.innerHTML = `
  <div class="ai-result">Phân loại đề xuất: ${catBadge(r.data.cat)} <span class="badge info">Confidence ${(r.data.confidence * 100).toFixed(0)}%</span></div>
  <div class="ai-reason"><b>Vì sao?</b> ${r.data.reason}</div>
  <div class="ai-reason" style="font-size:11.5px;color:#93aeb8;margin-top:6px"><b>Lưu ý:</b> ${(r.data && r.data.disclaimer) || AI.DISCLAIMER}</div>
    <div class="ai-actions">
      <button class="btn dark" type="button" onclick="acceptCat('${r.data.cat}')">Chấp nhận</button>
      <button class="btn" type="button" onclick="document.getElementById('txCategory').focus();toast('Chọn lại danh mục nếu cần','wr')">Sửa</button>
      <button class="btn" type="button" onclick="toast('Đã từ chối gợi ý','wr')">Từ chối</button>
      <button class="btn" type="button" onclick="runCat()">Phân loại lại</button>
      <button class="btn primary" type="button" onclick="saveCategorized()">Lưu</button>
    </div>`;
}

function saveCategorized() {
  if (!window.__lastCatResult) { toast('Chưa có kết quả AI để lưu', 'er'); return; }
  document.getElementById('saveTx')?.click();
}

function acceptCat(cat) {
  const catSel = document.getElementById('txCategory');
  if (catSel && catSel.value && catSel.value !== cat) {
    if (!confirm('Bạn đã chọn "' + catSel.value + '". Ghi đè bằng "' + cat + '" của AI?')) return;
  }
  if (catSel) catSel.value = cat;
  toast('Đã áp dụng nhãn: ' + cat, 'ok');
}

function resetForm() {
  const d = document.getElementById('txDesc');
  const a = document.getElementById('txAmt');
  const c = document.getElementById('txCategory');
  if (d) d.value = '';
  if (a) a.value = '-96.000 đ';
  if (c) c.value = 'Ăn uống';
  const form = document.getElementById('addForm');
  if (form) delete form.dataset.editId;
  const wrap = document.getElementById('aiCatBody');
  if (wrap) {
    wrap.innerHTML = `<button class="btn primary" type="button" id="runCategorize">Chạy phân loại</button>`;
    document.getElementById('runCategorize')?.addEventListener('click', runCat);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('runCategorize')?.addEventListener('click', runCat);
  const tbody = document.querySelector('#txTable tbody');
  if (tbody) {
    tbody.innerHTML = UI.skeletonRows(6, 6);
    setTimeout(() => renderTx(), 280);
  } else {
    renderTx();
  }
});

window.runCat    = runCat;
window.acceptCat = acceptCat;
window.resetForm = resetForm;
window.changePage = changePage;
window.resetTxFilters = resetTxFilters;