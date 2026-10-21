/* =========================================================
   SpendWise – Mock Data (centralized)
   Nguồn dữ liệu giả lập DUY NHẤT của dự án.
   Gom từ: core.js (transactions, categories, goals, users,
   resources, feedback), coach-budget.js (budgets, coachNotes),
   coach-clients.js (coachClients), moderator-ai.js (aiTemplates),
   user-dashboard.js (mockTx → chuyển vào transactions).

   LƯU Ý: file này được load TRƯỚC core.js trong tất cả HTML.
   ========================================================= */
window.SEED_DATA = {
  /* ---------- Giao dịch ---------- */
  transactions: [
    {id:'tx-1',  desc:'Highlands Coffee',   cat:'Ăn uống',   type:'out', date:'2026-10-01', amt:-85000},
    {id:'tx-2',  desc:'Lương tháng 9',      cat:'Thu nhập',  type:'in',  date:'2026-09-30', amt:24000000},
    {id:'tx-3',  desc:'Grab',               cat:'Di chuyển', type:'out', date:'2026-09-29', amt:-72000},
    {id:'tx-4',  desc:'Nhà sách Fahasa',    cat:'Mua sắm',   type:'out', date:'2026-09-27', amt:-325000},
    {id:'tx-5',  desc:'Điện tử',            cat:'Mua sắm',   type:'out', date:'2026-09-25', amt:-1280000},
    {id:'tx-6',  desc:'Ăn tối nhà hàng',    cat:'Ăn uống',   type:'out', date:'2026-09-20', amt:-890000},
    {id:'tx-7',  desc:'Netflix',            cat:'Giải trí',  type:'out', date:'2026-09-18', amt:-260000},
    {id:'tx-8',  desc:'Tiền điện tháng 9',  cat:'Hoá đơn',   type:'out', date:'2026-09-15', amt:-450000},
    {id:'tx-9',  desc:'Phúc Long',          cat:'Ăn uống',   type:'out', date:'2026-09-12', amt:-96000},
    {id:'tx-10', desc:'Xăng xe',            cat:'Di chuyển', type:'out', date:'2026-09-10', amt:-150000}
  ],

  /* ---------- Danh mục ---------- */
  categories: [
    {id:'cat-1', name:'Ăn uống',   icon:'🍜', color:'#f39c12', keywords:'cafe, quán ăn, nhà hàng',  uses:1240, status:'active'},
    {id:'cat-2', name:'Di chuyển', icon:'🚕', color:'#4db8d4', keywords:'grab, taxi, xe buýt',      uses:860,  status:'active'},
    {id:'cat-3', name:'Mua sắm',   icon:'🛍️', color:'#e05252', keywords:'shopee, lazada, siêu thị', uses:720,  status:'active'},
    {id:'cat-4', name:'Giải trí',  icon:'🎬', color:'#9b59b6', keywords:'phim, game, netflix',      uses:410,  status:'active'},
    {id:'cat-5', name:'Hoá đơn',   icon:'🧾', color:'#2e9e5b', keywords:'điện, nước, internet',     uses:590,  status:'active'},
    {id:'cat-6', name:'Thu nhập',  icon:'💰', color:'#2e9e5b', keywords:'lương, thưởng',            uses:320,  status:'active'},
    {id:'cat-7', name:'Khác',      icon:'❓', color:'#567a88', keywords:'—',                         uses:130,  status:'active'}
  ],

  /* ---------- Mục tiêu tiết kiệm ---------- */
  goals: [
    {id:'g-1', name:'Quỹ khẩn cấp',   cur:18000000, target:30000000, prog:60,  tag:'Đúng tiến độ', tc:'ok',    deadline:'2027-01-31', grp:'active'},
    {id:'g-2', name:'Du lịch Đà Lạt', cur:5600000,  target:12000000, prog:47,  tag:'Cần chú ý',    tc:'er',    deadline:'2026-12-15', grp:'active'},
    {id:'g-3', name:'Khóa học UX',    cur:8000000,  target:8000000,  prog:100, tag:'Hoàn thành',   tc:'info',  deadline:'2026-09-20', grp:'done'},
    {id:'g-4', name:'Máy ảnh cũ',     cur:2000000,  target:15000000, prog:13,  tag:'Đã lưu trữ',   tc:'muted', deadline:'2027-06-01', grp:'arc'}
  ],

  /* ---------- Người dùng ---------- */
  users: [
    {id:'u-1', name:'Nguyễn Minh Anh', role:'Người dùng',       status:'Hoạt động',   last:'Hôm nay 09:20'},
    {id:'u-2', name:'Thu Trang',       role:'Huấn luyện viên', status:'Hoạt động',   last:'Hôm qua'},
    {id:'u-3', name:'Lan Anh',         role:'Kiểm duyệt',       status:'Hoạt động',   last:'30/09'},
    {id:'u-4', name:'Quốc Bảo',        role:'Người dùng',       status:'Vô hiệu hóa', last:'21/09'}
  ],

  /* ---------- Tài nguyên ---------- */
  resources: [
    {id:'rs-1', title:'5 bước lập quỹ khẩn cấp',            cat:'Tiết kiệm', status:'approved', author:'HLV Thu Trang', updated:'2026-09-30'},
    {id:'rs-2', title:'Ăn uống tiết kiệm cho người bận rộn', cat:'Ngân sách', status:'pending',  author:'HLV Thu Trang', updated:'2026-09-29'},
    {id:'rs-3', title:'Hiểu về chi tiêu cảm xúc',           cat:'Thói quen', status:'draft',    author:'HLV Thu Trang', updated:'2026-09-28'},
    {id:'rs-4', title:'Checklist cuối tháng',                cat:'Kế hoạch',  status:'rejected', author:'HLV Thu Trang', updated:'2026-09-26'}
  ],

  /* ---------- Phản hồi ---------- */
  feedback: [
    {id:'FB-1042', status:'open',   level:'Trung bình', title:'AI phân loại GrabFood thành Di chuyển', desc:'Giao dịch 245.000 đ ngày 29/09 là đồ ăn giao tận nơi nhưng được gán danh mục Di chuyển.', assignee:'Lan Anh', timeline:[{time:'09:12', text:'Người dùng gửi báo cáo'}]},
    {id:'FB-1041', status:'open',   level:'Trung bình', title:'Không lưu được mục tiêu',              desc:'Người dùng nhấn Lưu nhưng mục tiêu không xuất hiện lại sau khi tải lại trang.', assignee:'Chưa phân công', timeline:[{time:'Hôm qua'}]},
    {id:'FB-1038', status:'closed', level:'Thấp',       title:'Góp ý nội dung tài nguyên',            desc:'Đề xuất bổ sung ví dụ minh hoạ bằng VND cho bài viết về quỹ khẩn cấp.', assignee:'Lan Anh', timeline:[{time:'30/09'}]}
  ],

  /* ---------- Thông báo (rỗng ban đầu) ---------- */
  notifications: [],

  /* ---------- Ghi chú Coach ---------- */
  coachNotes: [
    {id:'note-1', client:'Nguyễn Minh Anh', title:'Điều chỉnh ngân sách mua sắm',
     content:'Đề nghị giảm mua sắm 500.000 đ và chuyển sang quỹ khẩn cấp.', created:'2026-10-01'}
  ],

  /* ---------- Ngân sách (Coach) ---------- */
  budgets: [
    {id:'b-1', client:'Nguyễn Minh Anh', month:'2026-10', total:20000000, spent:12680000,
     lines:[
       {cat:'Ăn uống',   plan:4000000, actual:3120000},
       {cat:'Di chuyển', plan:2000000, actual:2450000},
       {cat:'Mua sắm',   plan:2500000, actual:3100000}
     ]},
    {id:'b-2', client:'Trần Quốc Bảo', month:'2026-10', total:15500000, spent:9800000,
     lines:[
       {cat:'Ăn uống',   plan:3000000, actual:2800000},
       {cat:'Di chuyển', plan:1500000, actual:1800000}
     ]}
  ],

  /* ---------- Khách hàng Coach ---------- */
  coachClients: [
    {id:'c-1', n:'Nguyễn Minh Anh', b:20000000, g:60, r:'Thấp',       u:'1 giờ trước'},
    {id:'c-2', n:'Trần Quốc Bảo',   b:15500000, g:42, r:'Cao',        u:'Hôm qua'},
    {id:'c-3', n:'Lê Thu Hà',       b:28000000, g:71, r:'Trung bình', u:'2 ngày trước'},
    {id:'c-4', n:'Phạm Gia Huy',    b:18000000, g:88, r:'Thấp',       u:'3 ngày trước'}
  ],

  /* ---------- AI Templates (Moderator) ---------- */
  aiTemplates: [
    {id:'tpl-1', name:'Expense Categorizer',      version:'v2.4', status:'on',  updated:'2026-09-30',
     prompt:'Phân loại giao dịch theo mô tả, số tiền và lịch sử gần nhất.',
     fallback:'Khác',          confidence:'0.75', lang:'Tiếng Việt'},
    {id:'tpl-2', name:'Spending Pattern Insight', version:'v1.8', status:'on',  updated:'2026-09-29',
     prompt:'Phân tích pattern chi tiêu 30 ngày.',
     fallback:'Không đủ dữ liệu', confidence:'0.75', lang:'Tiếng Việt'},
    {id:'tpl-3', name:'Goal Coach',               version:'v1.3', status:'off', updated:'2026-09-27',
     prompt:'Đề xuất lộ trình tiết kiệm theo mục tiêu.',
     fallback:'Nhập thêm số tiền', confidence:'0.75', lang:'Tiếng Việt'}
  ]
};
