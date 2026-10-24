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
  setTimeout(()=>{t.style.opacity=1;t.style.transform='translateY(0)';}, 10);  clearTimeout(window.__toastT);
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
  const KEY = 'spendwise_db_v2';

  function seed() {
    // Dùng window.SEED_DATA từ js/data.js (load trước core.js)
    if (window.SEED_DATA) {
      // Deep copy để tránh mutate object gốc khi DB.insert/update
      return JSON.parse(JSON.stringify(window.SEED_DATA));
    }
    console.warn('[DB] window.SEED_DATA chưa được load. Kiểm tra js/data.js.');
    return {
      transactions: [], categories: [], goals: [], users: [],
      resources: [], feedback: [], notifications: [], coachNotes: [],
      budgets: [], coachClients: [], aiTemplates: []
    };
  }

    const DB = {
    // ═══════════════════════════════════════════════════════════
    // METADATA — học pattern CareRouteDB (đã điều chỉnh cho 1 key)
    // ═══════════════════════════════════════════════════════════

    // localStorage key duy nhất (toàn bộ data nằm trong này)
    STORAGE_KEY: KEY,

    // Danh sách entity hợp lệ — dùng để debug / validate / render admin
    ENTITIES: [
      'transactions', 'categories', 'goals', 'users',
      'resources', 'feedback', 'notifications', 'coachNotes',
      'budgets', 'coachClients', 'aiTemplates'
    ],

    // Expose seed data dạng getter (read-only, luôn lấy mới nhất)
    // → Dùng để test: DB.INITIAL_DATA.categories.length === 7
    get INITIAL_DATA() {
      return window.SEED_DATA || {};
    },

    // ═══════════════════════════════════════════════════════════
    // CORE STORAGE (GIỮ NGUYÊN — không sửa gì)
    // ═══════════════════════════════════════════════════════════
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
    _uid(prefix) {
  if (!this._counters) this._counters = {};
  if (!this._counters[prefix]) {
    const list = this._data[prefix] || [];
    this._counters[prefix] = list.length;
  }
  this._counters[prefix]++;
  return prefix + '-' + this._counters[prefix];
},
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
        reset() { this._data = seed(); this._persist(); },

    // ═══════════════════════════════════════════════════════════
    // DOMAIN HELPERS — học CareRouteDB
    // Đây là lớp wrapper trên generic CRUD ở trên. KHÔNG phá code cũ.
    // Dùng khi nào muốn API rõ nghĩa hơn all/get/insert/update.
    // ═══════════════════════════════════════════════════════════

    // ---------- Transactions ----------
    getTransactions() { return this.all('transactions'); },
    getTransactionById(id) { return this.get('transactions', id); },
    saveTransaction(item) {
      const exists = item.id && this.get('transactions', item.id);
      return exists
        ? this.update('transactions', item.id, item)
        : this.insert('transactions', item);
    },
    deleteTransaction(id) { return this.remove('transactions', id); },

    // ---------- Categories ----------
    getCategories() { return this.all('categories'); },
    getCategoryById(id) { return this.get('categories', id); },
    saveCategory(item) {
      const exists = item.id && this.get('categories', item.id);
      return exists
        ? this.update('categories', item.id, item)
        : this.insert('categories', item);
    },
    deleteCategory(id) { return this.remove('categories', id); },

    // ---------- Goals ----------
    getGoals() { return this.all('goals'); },
    getGoalById(id) { return this.get('goals', id); },
    saveGoal(item) {
      const exists = item.id && this.get('goals', item.id);
      return exists
        ? this.update('goals', item.id, item)
        : this.insert('goals', item);
    },
    deleteGoal(id) { return this.remove('goals', id); },

    // ---------- Users ----------
    getUsers() { return this.all('users'); },
    getUserById(id) { return this.get('users', id); },
    saveUser(item) {
      const exists = item.id && this.get('users', item.id);
      return exists
        ? this.update('users', item.id, item)
        : this.insert('users', item);
    },
    deleteUser(id) { return this.remove('users', id); },

    // ---------- Resources ----------
    getResources() { return this.all('resources'); },
    getResourceById(id) { return this.get('resources', id); },
    saveResource(item) {
      const exists = item.id && this.get('resources', item.id);
      return exists
        ? this.update('resources', item.id, item)
        : this.insert('resources', item);
    },
    deleteResource(id) { return this.remove('resources', id); },

    // ---------- Feedback ----------
    getFeedback() { return this.all('feedback'); },
    getFeedbackById(id) { return this.get('feedback', id); },
    saveFeedback(item) {
      const exists = item.id && this.get('feedback', item.id);
      return exists
        ? this.update('feedback', item.id, item)
        : this.insert('feedback', item);
    },
    deleteFeedback(id) { return this.remove('feedback', id); },
    resolveFeedback(id, replyText) {
      return this.update('feedback', id, {
        status: 'closed',
        reply: replyText || '',
        closedAt: new Date().toISOString()
      });
    },

    // ---------- Notifications ----------
    getNotifications() { return this.all('notifications'); },
    addNotification(item) { return this.insert('notifications', item); },
    markNotificationRead(id) {
      return this.update('notifications', id, { read: true });
    },

    // ---------- Coach Notes ----------
    getCoachNotes(clientName) {
      const list = this.all('coachNotes');
      return clientName ? list.filter(n => n.client === clientName) : list;
    },
    getLastCoachNote(clientName) {
      const list = this.getCoachNotes(clientName);
      return list[list.length - 1] || null;
    },
    saveCoachNote(item) {
      const exists = item.id && this.get('coachNotes', item.id);
      return exists
        ? this.update('coachNotes', item.id, item)
        : this.insert('coachNotes', item);
    },
    deleteCoachNote(id) { return this.remove('coachNotes', id); },

    // ---------- Budgets ----------
    getBudgets() { return this.all('budgets'); },
    getBudgetByClient(clientName) {
      return this.all('budgets').find(b => b.client === clientName) || null;
    },
    saveBudget(item) {
      const exists = item.id && this.get('budgets', item.id);
      return exists
        ? this.update('budgets', item.id, item)
        : this.insert('budgets', item);
    },

    // ---------- Coach Clients ----------
    getCoachClients() { return this.all('coachClients'); },

    // ---------- AI Templates ----------
    getAITemplates() { return this.all('aiTemplates'); },
    getAITemplateById(id) { return this.get('aiTemplates', id); },
    saveAITemplate(item) {
      const exists = item.id && this.get('aiTemplates', item.id);
      return exists
        ? this.update('aiTemplates', item.id, item)
        : this.insert('aiTemplates', item);
    },
    toggleAITemplate(id) {
      const t = this.get('aiTemplates', id);
      if (!t) return null;
      return this.update('aiTemplates', id, {
        status: t.status === 'on' ? 'off' : 'on',
        updated: UI.todayISO()
      });
    },

    // ---------- Aggregations / Analytics ----------
    countBy(type, field) {
      return this.all(type).reduce((acc, item) => {
        const k = item[field] ?? '—';
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {});
    },
    sumBy(type, field) {
      return this.all(type).reduce((s, item) => s + (Number(item[field]) || 0), 0);
    },

    // ---------- Reset 1 entity (giữ các entity khác) ----------
    resetEntity(type) {
      if (!window.SEED_DATA || !window.SEED_DATA[type]) return false;
      this._data[type] = JSON.parse(JSON.stringify(window.SEED_DATA[type]));
      this._persist();
      return true;
    }  
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

