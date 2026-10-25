
const MENUS = {
  user:[
    {l:'Tổng quan',            h:'user-finance-dashboard.html',    i:'grid'},
    {l:'Giao dịch',            h:'user-transaction-management.html', i:'rows'},
    {l:'Mục tiêu tiết kiệm',   h:'user-saving-goals.html',          i:'target'}
  ],
  coach:[
    {l:'Khách hàng',       h:'coach-client-list.html',        i:'user'},
    {l:'Duyệt ngân sách',  h:'coach-budget-review.html',      i:'chart'},
    {l:'Tài nguyên',       h:'coach-resource-management.html',i:'doc'}
  ],
  moderator:[
    {l:'Duyệt tài nguyên',    h:'moderator-resource-review.html',          i:'check'},
    {l:'Mẫu AI',              h:'moderator-ai-template-management.html',  i:'spark'},
    {l:'Trung tâm phản hồi',  h:'moderator-feedback-center.html',          i:'flag'}
  ],
  admin:[
    {l:'Danh mục chi tiêu', h:'admin-expense-category-management.html', i:'tag'},
    {l:'Người dùng',        h:'admin-user-management.html',             i:'user'},
    {l:'Hệ thống',          h:'admin-system-dashboard.html',            i:'gear'}
  ]
}
/* =========================================================
   SpendWise – Layout auto-inject (sidebar + topbar)
   Sử dụng: <div id="app-root" data-role="user" data-crumbs="..."></div>
   ========================================================= */

const MENUS = {
  user:[
    {l:'Tổng quan',            h:'user-finance-dashboard.html',    i:'grid'},
    {l:'Giao dịch',            h:'user-transaction-management.html', i:'rows'},
    {l:'Mục tiêu tiết kiệm',   h:'user-saving-goals.html',          i:'target'}
  ],
  coach:[
    {l:'Khách hàng',       h:'coach-client-list.html',        i:'user'},
    {l:'Duyệt ngân sách',  h:'coach-budget-review.html',      i:'chart'},
    {l:'Tài nguyên',       h:'coach-resource-management.html',i:'doc'}
  ],
  moderator:[
    {l:'Duyệt tài nguyên',    h:'moderator-resource-review.html',          i:'check'},
    {l:'Mẫu AI',              h:'moderator-ai-template-management.html',  i:'spark'},
    {l:'Trung tâm phản hồi',  h:'moderator-feedback-center.html',          i:'flag'}
  ],
  admin:[
    {l:'Danh mục chi tiêu', h:'admin-expense-category-management.html', i:'tag'},
    {l:'Người dùng',        h:'admin-user-management.html',             i:'user'},
    {l:'Hệ thống',          h:'admin-system-dashboard.html',            i:'gear'}
  ]
};

const ROLE_LABELS = {user:'Người dùng',coach:'Huấn luyện viên',moderator:'Kiểm duyệt viên',admin:'Quản trị viên'};

const ICONS = {
  grid:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  rows:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  target:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>',
  user:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>',
  chart:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>',
  doc:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  check:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
  spark:'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z"/></svg>',
  flag:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21V4h13l-2 4 2 4H4"/></svg>',
  tag:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12l-8 8-9-9V4h7z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  gear:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  logout:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
  search:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>'
};

function buildSidebar(role, current){
  const items = MENUS[role] || MENUS.user;
  return `<aside class="sidebar">
    <a class="brand" href="${items[0].h}"><span class="logo-mark">▢</span> SpendWise</a>
    <div class="role-label">${ROLE_LABELS[role]||'Người dùng'}</div>
    <nav class="nav">${items.map(m=>`
      <a class="nav-item ${current===m.h?'active':''}" href="${m.h}">
        ${ICONS[m.i]||''}<span>${m.l}</span>
      </a>`).join('')}</nav>
    <div class="logout-wrap">
      <button type="button" class="logout-btn" onclick="logout()">
        ${ICONS.logout}<span>Đăng xuất</span>
      </button>
    </div>
  </aside>`;
}

function buildTopbar(crumbs){
  return `<div class="topbar">
    <div class="crumb">${(crumbs||[]).map((c,i,a)=>i===a.length-1?`<b>${c}</b>`:c).join(' / ')}</div>
    <div class="actions">
      <button class="icon-btn" title="Tìm kiếm" onclick="toast('Mở tìm kiếm toàn cục','wr')">
        ${ICONS.search.replace('width="16" height="16"','width="18" height="18"')}
      </button>
      <button class="icon-btn" title="Thông báo" onclick="toast('3 thông báo mới','wr')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16z"/><path d="M10 20a2 2 0 004 0"/></svg>
      </button>

      <div class="avatar" title="Nguyễn Minh Anh">MA</div>
    </div>
  </div>`;
}

/* ---------- Auto-mount ---------- */
(function autoMount(){
  const root = document.getElementById('app-root');
  if(!root) return;

  const role   = root.dataset.role || Session.getRole() || 'user';
  const crumbs = (root.dataset.crumbs || '').split('|').filter(Boolean);
  const tmpl   = document.getElementById('page-content');
  const inner  = tmpl ? tmpl.innerHTML : '';
  const current = location.pathname.split('/').pop();

  const app = document.createElement('div');
  app.className = 'app';
  app.innerHTML = `
    ${buildSidebar(role, current)}
    <div class="main">
      ${buildTopbar(crumbs)}
      <div class="content">${inner}</div>
    </div>`;

  root.replaceWith(app);
  if(tmpl) tmpl.remove();
})();
})();

