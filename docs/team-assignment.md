# Phân công công việc và quy tắc Git — SpendWise

## 1. Nguyên tắc phân công

- Mỗi tệp có một **owner chính** để giảm xung đột merge.
- Owner chịu trách nhiệm review thay đổi vào tệp mình sở hữu.
- Nếu thành viên khác cần sửa tệp của owner, hãy trao đổi trước và ghi rõ phạm vi trong PR.
- Không suy ra rằng tệp đã hoàn thành chỉ từ bảng phân công; trạng thái phải được xác nhận trong repository.


## 2. Phân công theo thành viên

### Quy ước: 
- SV01 - Nguyễn Duy Quang
- SV02 - Lê Thị Ly
- SV03 - Trần Anh Thư

### 2.1. SV01 — User và design system

**Tệp dùng chung sở hữu**

- `css/base.css` — reset, design tokens, typography và tiện ích bố cục cơ bản.
- `css/components.css` — nút, card, badge, bảng, form, modal, tabs và empty state.
- `js/data.js` — dữ liệu seed `window.SEED_DATA`.

**Tệp riêng sở hữu**

- `login.html`
- `user-finance-dashboard.html`
- `user-transaction-management.html`
- `user-saving-goals.html`
- `js/user-dashboard.js`
- `js/user-transactions.js`
- `js/user-goals.js`

**Trách nhiệm**

- Giữ dữ liệu seed đồng bộ với các màn hình và API DB.
- Duy trì design system.
- Xây dựng ba luồng User và tích hợp các hành động AI phía User.
- Báo cho SV02 khi cần thay đổi schema hoặc entity.

### 2.2. SV02 — Coach và hạ tầng dùng chung

**Tệp dùng chung sở hữu**

- `css/ai.css` — panel AI, spinner, thanh confidence và test console.
- `js/ai.js` — các hàm AI mô phỏng và xử lý failure.
- `js/core.js` — tiện ích DOM, định dạng, Session, validation, DB và UI.
- `js/auth.js` — logic đăng nhập demo.
- `404.html`

**Tệp riêng sở hữu**

- `coach-client-list.html`
- `coach-budget-review.html`
- `coach-resource-management.html`
- `js/coach-clients.js`
- `js/coach-budget.js`
- `js/coach-resources.js`

**Trách nhiệm**

- Giữ API DB, Session, validation, toast và modal ổn định; thông báo cho cả nhóm trước khi thay đổi API công khai.
- Duy trì các hàm AI-1, AI-2, AI-3 và xử lý lỗi theo thiết kế.
- Xây dựng ba màn hình Coach.
- Phối hợp với SV01 về dữ liệu và SV03 về test console của Moderator.

### 2.3. SV03 — Moderator, Admin và tích hợp

**Tệp dùng chung sở hữu**

- `css/layout.css` — auth shell, app shell, sidebar, topbar và bố cục trang lỗi.
- `css/responsive.css` — breakpoint và bố cục responsive.
- `js/layout.js` — sidebar/topbar theo `data-role` và breadcrumb.
- `index.html` — trang chuyển hướng đầu vào.

**Tệp riêng sở hữu**

- `moderator-resource-review.html` và `js/moderator-review.js`
- `moderator-ai-template-management.html` và `js/moderator-ai.js`
- `moderator-feedback-center.html` và `js/moderator-feedback.js`
- `admin-expense-category-management.html` và `js/admin-categories.js`
- `admin-user-management.html` và `js/admin-users.js`
- `admin-system-dashboard.html` và `js/admin-system.js`

**Trách nhiệm**

- Xây dựng sáu màn hình Moderator/Admin.
- Duy trì layout và responsive.
- Kiểm thử tích hợp các luồng giữa vai trò.
- Điều phối phát hành `dev` sang `main` sau khi nhóm xác nhận đạt yêu cầu.

### 2.4. Trách nhiệm xuyên suốt (Cross-Responsibility)
- **SV01:** Quản lý Design System (`base.css`, `components.css`) và Accessibility (A11y).
- **SV02:** Quản lý kiến trúc JS (`core.js`, `ai.js`) và cấu trúc dữ liệu (`data.js`).
- **SV03:** Quản lý Layout/Responsive (`layout.css`, `responsive.css`), QA và Deploy.

## 3. Danh mục owner tệp dùng chung

“Tệp dùng chung” trong bảng này là tệp hạ tầng được nhiều màn hình sử dụng; các trang entry như `login.html`, `index.html` và `404.html` có owner riêng nhưng không được tính là thư viện dùng chung.

| Tệp | Owner | Ghi chú khi sửa |
|---|---|---|
| `css/base.css` | SV01 | Thay đổi token ảnh hưởng toàn giao diện |
| `css/components.css` | SV01 | Thay đổi component có thể ảnh hưởng nhiều màn hình |
| `js/data.js` | SV01 | Thêm entity cần phối hợp cập nhật DB |
| `css/ai.css` | SV02 | Giữ đồng bộ với markup của các panel AI |
| `js/ai.js` | SV02 | Thay đổi chữ ký hàm cần thông báo cho các trang gọi |
| `js/core.js` | SV02 | Thay đổi API DB/Session/UI cần thông báo cả nhóm |
| `js/auth.js` | SV02 | Giữ đồng bộ với `login.html` |
| `css/layout.css` | SV03 | Kiểm tra sidebar, topbar và trang lỗi |
| `css/responsive.css` | SV03 | Kiểm tra tối thiểu desktop và viewport mobile |
| `js/layout.js` | SV03 | Kiểm tra tất cả `data-role` và breadcrumb |

## 4. Quy tắc Git

### 4.1. Nhánh

```text
main            # Bản ổn định
dev             # Nhánh tích hợp
feature/user  
feature/Coach      
feature/Admin_Mod     
```

### 4.2. Commit message

Định dạng:

```text
<type>: <mô tả ngắn bằng tiếng Anh hoặc tiếng Việt>
```

| Type | Dùng khi |
|---|---|
| `feat:` | Thêm tính năng |
| `fix:` | Sửa lỗi |
| `style:` | Chỉ thay đổi giao diện/format, không đổi logic |
| `refactor:` | Tái cấu trúc |
| `docs:` | Tài liệu |
| `test:` | Thêm/sửa kiểm thử |

Ví dụ:

```text
feat: add user finance dashboard
fix: handle empty transaction list
style: improve responsive sidebar
refactor: centralize database helpers
docs: update screen inventory
test: cover AI failure state
```

Không dùng message mơ hồ như `update`, `done`, `final`, `abc` hoặc `code moi`.

### 4.4. Quy trình Pull Request

```text
Cập nhật dev
→ Tạo nhánh từ dev
→ Code và commit
→ Push nhánh
→ Mở PR vào dev
→ Reviewer kiểm tra và approve
→ Merge vào dev
→ Kiểm thử tích hợp
→ SV03 điều phối merge dev vào main
```

### 4.5. Checklist PR

```markdown
## Mô tả
<!-- Nêu ngắn gọn thay đổi -->

## Task
- Task/Trello:
- Nhánh:

## Đã kiểm tra
- [ ] Chạy trên desktop
- [ ] Kiểm tra viewport mobile (375px)
- [ ] Không có lỗi Console
- [ ] Có empty state phù hợp
- [ ] Form có validation
- [ ] Luồng CRUD/LocalStorage hoạt động
- [ ] Các trang liên quan vẫn hoạt động

## Reviewer
Mỗi SV review chéo phần công việc của 2 người còn lại
```

### 4.6. Quy tắc review

- Mỗi PR cần ít nhất một approve từ thành viên khác tác giả.
- PR thay đổi tệp dùng chung cần owner của tệp review.
- SV01 và SV02 nên review chéo phần nghiệp vụ/hạ tầng.
- SV03 review các thay đổi ảnh hưởng layout/tích hợp; SV03 không thay thế yêu cầu owner review tệp dùng chung.
- Không merge PR khi còn lỗi Console hoặc xung đột chưa giải quyết.

## 5. OBS — phân công minh chứng

Tên video cần thống nhất giữa bảng này và `docs/obs-evidence.md`. Mỗi video nên thể hiện đúng task, tệp, nhánh và commit thực tế; không điền commit hash giả định.

| Thành viên | Phạm vi minh chứng |
|---|---|
| SV01 | Login, seed data, 3 màn hình User |
| SV02 | 3 màn hình Coach, core/DB và AI |
| SV03 | 3 màn hình Moderator, 3 màn hình Admin, layout/responsive |
