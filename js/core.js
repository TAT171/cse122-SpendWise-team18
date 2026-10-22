/* =========================================================
   SpendWise – Core utilities (SV dùng chung)
   ========================================================= */

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => Number(n).toLocaleString('vi-VN') + ' đ';
const fmtDate = s => { const d=new Date(s); if(isNaN(d)) return s; const p=n=>String(n).padStart(2,'0'); return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`; };

/* ---------- Category definitions ---------- */
const CATS = {
  'Ăn uống':   {cls:'or',   color:'#f39c12'},
  'Di chuyển': {cls:'info', color:'#4db8d4'},
  'Mua sắm':   {cls:'er',   color:'#e05252'},
  'Giải trí':  {cls:'pu',   color:'#9b59b6'},
  'Hoá đơn':   {cls:'ok',   color:'#2e9e5b'},
  'Thu nhập':  {cls:'ok',   color:'#2e9e5b'},
  'Khác':      {cls:'muted',color:'#567a88'}
};
const CAT_LIST = Object.keys(CATS);

function catBadge(cat){
  const c = CATS[cat] || CATS['Khác'];
  return `<span class="badge ${c.cls}"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${c.color}"></span>${cat}</span>`;
}

/* ---------- Toast ---------- */
function toast(msg, type='ok'){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div'); t.id='toast';
    Object.assign(t.style,{position:'fixed',bottom:'22px',right:'22px',zIndex:9999,padding:'12px 18px',borderRadius:'10px',fontWeight:500,fontSize:'13.5px',boxShadow:'0 8px 24px rgba(15,40,55,.18)',transition:'all .25s',opacity:0,transform:'translateY(10px)',maxWidth:'360px',display:'flex',alignItems:'center',gap:'10px'});
    document.body.appendChild(t);
  }
  const icons = {
    ok:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
    er:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>',
    wr:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5"/></svg>'
  };
  t.style.background = type==='ok'?'#e4f6eb':type==='er'?'#fdeaea':'#fdf3dd';
  t.style.color = type==='ok'?'#2e9e5b':type==='er'?'#e05252':'#d9930b';
  t.innerHTML = `${icons[type]||icons.ok}<span>${msg}</span>`;
  requestAnimationFrame(()=>{t.style.opacity=1;t.style.transform='translateY(0)';});
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(()=>{t.style.opacity=0;t.style.transform='translateY(10px)';},2600);
}

/* ---------- Modal ---------- */
function openModal(id){ const m=document.getElementById(id); if(m) m.classList.add('open'); }
function closeModal(id){ const m=document.getElementById(id); if(m) m.classList.remove('open'); }
document.addEventListener('click', e=>{ if(e.target.classList && e.target.classList.contains('modal-backdrop')) e.target.classList.remove('open'); });

/* ---------- Session ---------- */
const Session = {
  setRole(r){ localStorage.setItem('sw_role', r); },
  getRole(){ return localStorage.getItem('sw_role') || 'user'; },
  clear(){ localStorage.removeItem('sw_role'); }
};
function logout(){ Session.clear(); location.href = 'login.html'; }

/* ---------- Validation ---------- */
function validate(form){
  let ok = true;
  $$('[data-required]', form).forEach(el=>{
    const err = el.parentElement.querySelector('.err');
    if(!el.value.trim()){ el.classList.add('error'); if(err) err.textContent=err.dataset.msg||'Trường này là bắt buộc.'; ok=false; }
    else{ el.classList.remove('error'); if(err) err.textContent=''; }
  });
  const email = $('input[type=email]', form);
  if(email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){
    email.classList.add('error'); const e=email.parentElement.querySelector('.err'); if(e) e.textContent='Email không hợp lệ.'; ok=false;
  }
  return ok;
}

/* =========================================================
   DB – LocalStorage-backed store (gộp vào core.js)
   ========================================================= */
(function () {
  const KEY = 'spendwise_db_v1';

  function seed() {
    return {
      transactions: [
        {id:'tx-1', desc:'Highlands Coffee', cat:'Ăn uống',    type:'out', date:'2026-10-01', amt:-85000},
        {id:'tx-2', desc:'Lương tháng 9',    cat:'Thu nhập',   type:'in',  date:'2026-09-30', amt:24000000},
        {id:'tx-3', desc:'Grab',             cat:'Di chuyển',  type:'out', date:'2026-09-29', amt:-72000},
        {id:'tx-4', desc:'Nhà sách Fahasa',  cat:'Mua sắm',    type:'out', date:'2026-09-27', amt:-325000}
      ],
      categories: [
        {id:'cat-1', name:'Ăn uống',   icon:'🍜', color:'#f39c12', keywords:'cafe, quán ăn, nhà hàng',  uses:1240, status:'active'},
        {id:'cat-2', name:'Di chuyển', icon:'🚕', color:'#4db8d4', keywords:'grab, taxi, xe buýt',      uses:860,  status:'active'},
        {id:'cat-3', name:'Mua sắm',   icon:'🛍️', color:'#e05252', keywords:'shopee, lazada, siêu thị', uses:720,  status:'active'},
        {id:'cat-4', name:'Giải trí',  icon:'🎬', color:'#9b59b6', keywords:'phim, game, netflix',      uses:410,  status:'active'},
        {id:'cat-5', name:'Hoá đơn',   icon:'🧾', color:'#2e9e5b', keywords:'điện, nước, internet',     uses:590,  status:'active'},
        {id:'cat-6', name:'Thu nhập',  icon:'💰', color:'#2e9e5b', keywords:'lương, thưởng',            uses:320,  status:'active'},
        {id:'cat-7', name:'Khác',      icon:'❓', color:'#567a88', keywords:'—',                         uses:130,  status:'active'}
      ],
      goals: [
        {id:'g-1', name:'Quỹ khẩn cấp',   cur:18000000, target:30000000, prog:60,  tag:'Đúng tiến độ', tc:'ok',    deadline:'2027-01-31', grp:'active'},
        {id:'g-2', name:'Du lịch Đà Lạt', cur:5600000,  target:12000000, prog:47,  tag:'Cần chú ý',    tc:'er',    deadline:'2026-12-15', grp:'active'},
        {id:'g-3', name:'Khóa học UX',    cur:8000000,  target:8000000,  prog:100, tag:'Hoàn thành',   tc:'info',  deadline:'2026-09-20', grp:'done'},
        {id:'g-4', name:'Máy ảnh cũ',     cur:2000000,  target:15000000, prog:13,  tag:'Đã lưu trữ',   tc:'muted', deadline:'2027-06-01', grp:'arc'}
      ],
      users: [
        {id:'u-1', name:'Nguyễn Minh Anh', role:'Người dùng',       status:'Hoạt động',  last:'Hôm nay 09:20'},
        {id:'u-2', name:'Thu Trang',       role:'Huấn luyện viên', status:'Hoạt động',  last:'Hôm qua'},
        {id:'u-3', name:'Lan Anh',         role:'Kiểm duyệt',       status:'Hoạt động',  last:'30/09'},
        {id:'u-4', name:'Quốc Bảo',        role:'Người dùng',       status:'Vô hiệu hóa',last:'21/09'}
      ],
      resources: [
        {id:'rs-1', title:'5 bước lập quỹ khẩn cấp',            cat:'Tiết kiệm', status:'approved', author:'HLV Thu Trang', updated:'2026-09-30'},
        {id:'rs-2', title:'Ăn uống tiết kiệm cho người bận rộn', cat:'Ngân sách', status:'pending',  author:'HLV Thu Trang', updated:'2026-09-29'},
        {id:'rs-3', title:'Hiểu về chi tiêu cảm xúc',           cat:'Thói quen', status:'draft',    author:'HLV Thu Trang', updated:'2026-09-28'},
        {id:'rs-4', title:'Checklist cuối tháng',                cat:'Kế hoạch',  status:'rejected', author:'HLV Thu Trang', updated:'2026-09-26'}
      ],
      feedback: [
        {id:'FB-1042', status:'open',   level:'Trung bình', title:'AI phân loại GrabFood thành Di chuyển', desc:'Giao dịch 245.000 đ ngày 29/09 là đồ ăn giao tận nơi nhưng được gán danh mục Di chuyển.', assignee:'Lan Anh', timeline:[{time:'09:12', text:'Người dùng gửi báo cáo'}]},
        {id:'FB-1041', status:'open',   level:'Trung bình', title:'Không lưu được mục tiêu',              desc:'Người dùng nhấn Lưu nhưng mục tiêu không xuất hiện lại sau khi tải lại trang.', assignee:'Chưa phân công', timeline:[{time:'Hôm qua'}]},
        {id:'FB-1038', status:'closed', level:'Thấp',       title:'Góp ý nội dung tài nguyên',            desc:'Đề xuất bổ sung ví dụ minh hoạ bằng VND cho bài viết về quỹ khẩn cấp.', assignee:'Lan Anh', timeline:[{time:'30/09'}]}
      ],
      notifications: [],
      coachNotes: []
    };
  }

  const DB = {
    _data: null,
    _ensure() {
      if (this._data) return;
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) { this._data = JSON.parse(raw); return; }
      } catch (e) { console.warn('[DB] parse failed', e); }
      this._data = seed();
      this._persist();
    },
    _persist() {
      try { localStorage.setItem(KEY, JSON.stringify(this._data)); } catch (e) { console.warn('[DB] persist failed', e); }
    },
    _uid(prefix) { return prefix + '-' + Math.random().toString(36).slice(2, 8); },
    all(type)      { this._ensure(); return (this._data[type] || []).slice(); },
    find(type, q)  { this._ensure(); return (this._data[type] || []).filter(it => Object.keys(q).every(k => it[k] === q[k])); },
    get(type, id)  { this._ensure(); return (this._data[type] || []).find(x => x.id === id); },
    insert(type, item) {
      this._ensure();
      if (!this._data[type]) this._data[type] = [];
      const rec = Object.assign({ id: item.id || this._uid(type) }, item);
      this._data[type].push(rec); this._persist(); return rec;
    },
    update(type, id, patch) {
      this._ensure();
      const list = this._data[type] || [];
      const i = list.findIndex(x => x.id === id);
      if (i < 0) return null;
      list[i] = Object.assign({}, list[i], patch);
      this._persist(); return list[i];
    },
    remove(type, id) {
      this._ensure();
      const list = this._data[type] || [];
      const i = list.findIndex(x => x.id === id);
      if (i < 0) return false;
      list.splice(i, 1); this._persist(); return true;
    },
    reset() { this._data = seed(); this._persist(); }
  };

  window.DB = DB;
})();

/* =========================================================
   UI – helpers dùng cho page scripts
   ========================================================= */
(function () {
  window.UI = {
    esc: esc,
    toast: toast,
    openModal: openModal,
    closeModal: closeModal,
    validate: validate,
    skeletonRows(rows = 3, cols = 5) {
      let html = '';
      for (let r = 0; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++)
          html += '<td><span style="display:inline-block;height:12px;width:80%;background:#e3f3f8;border-radius:4px"></span></td>';
        html += '</tr>';
      }
      return html;
    },
    emptyState(title, desc, action) {
      return '<div class="empty" style="text-align:center;padding:40px 16px">' +
        '<div style="width:56px;height:56px;border-radius:50%;background:#e8f8ff;display:grid;place-items:center;margin:0 auto 12px;color:#6fd4f0;font-size:22px">◌</div>' +
        '<div style="font-weight:600;margin-bottom:6px">' + esc(title || 'Trống') + '</div>' +
        '<div style="color:#567a88;font-size:13px">' + esc(desc || '') + '</div>' +
        (action ? '<div style="margin-top:14px">' + action + '</div>' : '') + '</div>';
    },
    confirmBox(msg, cb) { cb(window.confirm(msg)); },
    simulateLoad(ms, cb) { setTimeout(cb, ms); },
    todayISO() {
      const d = new Date(), p = n => String(n).padStart(2, '0');
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    },
    riskBadge(level) {
      const lv = String(level || '').toLowerCase();
      const cls = lv === 'cao' ? 'er' : lv === 'trung bình' ? 'wr' : lv === 'thấp' ? 'ok' : 'info';
      return '<span class="badge ' + cls + '">' + esc(level || '—') + '</span>';
    },
    clearFormErrors(form) {
      if (!form) return;
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.err').forEach(el => el.textContent = '');
    }
  };
})();

/* =========================================================
   Accessibility & interaction enhancements
   - scope="col" cho mọi <th>
   - Skip-link (ẩn đến khi Tab)
   - aria-live cho toast
   - id="main-content" cho .content
   - Disable submit button trong lúc xử lý
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // 1. scope="col" cho mọi <th>
  document.querySelectorAll('th').forEach(th => {
    if (!th.getAttribute('scope')) th.setAttribute('scope', 'col');
  });

  // 2. Skip-link — ẩn đến khi focus
  if (!document.getElementById('skip-link')) {
    const skip = document.createElement('a');
    skip.id = 'skip-link';
    skip.href = '#main-content';
    skip.textContent = 'Bỏ qua điều hướng, đến nội dung chính';
    skip.style.cssText =
      'position:absolute;left:-9999px;top:8px;padding:8px 16px;' +
      'background:#1b2b33;color:#fff;z-index:99999;text-decoration:none;' +
      'border-radius:6px;font-weight:600;font-size:13px';
    skip.addEventListener('focus', () => { skip.style.left = '8px'; });
    skip.addEventListener('blur',  () => { skip.style.left = '-9999px'; });
    document.body.insertBefore(skip, document.body.firstChild);
  }

  // 3. id="main-content" cho .content (đích của skip-link)
  document.querySelectorAll('.content').forEach(el => {
    if (!el.id) el.id = 'main-content';
  });

  // 4. aria-live cho toast
  const ensureToastA11y = () => {
    const t = document.getElementById('toast');
    if (t) {
      if (!t.getAttribute('aria-live')) t.setAttribute('aria-live', 'polite');
      if (!t.getAttribute('role'))      t.setAttribute('role', 'status');
    }
  };
  ensureToastA11y();
  if (typeof window.toast === 'function' && !window.__toastA11yWrapped) {
    const orig = window.toast;
    window.toast = function () {
      orig.apply(this, arguments);
      ensureToastA11y();
    };
    window.__toastA11yWrapped = true;
  }

  // 5. Disable submit button trong lúc xử lý (UX + trạng thái "vô hiệu hóa")
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        setTimeout(() => { btn.disabled = false; }, 900);
      }
    });
  });
});

/* Expose to window for inline onclick */
window.toast = toast;
window.openModal = openModal;
window.closeModal = closeModal;
window.logout = logout;
window.catBadge = catBadge;
window.money = money;

