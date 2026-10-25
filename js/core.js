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

(function () {
  const KEY = 'spendwise_db_v1';

  function seed() {
    if (window.SEED_DATA) {
      return JSON.parse(JSON.stringify(window.SEED_DATA));
    }
    return {
      transactions: [], categories: [], goals: [], users: [], resources: [], 
      feedback: [], notifications: [], coachNotes: [], 
      budgets: [], coachClients: [], aiTemplates: []
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