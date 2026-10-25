function demoLogin(role){
  Session.setRole(role);
  const routes = {
    user:'user-finance-dashboard.html',
    coach:'coach-client-list.html',
    moderator:'moderator-resource-review.html',
    admin:'admin-system-dashboard.html'
  };
  location.href = routes[role] || routes.user;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', e=>{
    e.preventDefault();
    const msg = document.getElementById('loginMsg');
    if(!validate(e.target)){
      msg.className='auth-msg er'; msg.textContent='Vui lòng kiểm tra lại thông tin.'; return;
    }
    msg.className='auth-msg ok'; msg.textContent='Đăng nhập thành công! Đang chuyển hướng…';
    setTimeout(()=> demoLogin('user'), 700);
  });
});

window.demoLogin = demoLogin;