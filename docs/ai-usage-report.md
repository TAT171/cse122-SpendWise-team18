# Khai báo sử dụng AI – SpendWise

## 1. Công cụ sử dụng

| Công cụ | Vai trò | Mức độ sử dụng |
|---|---|---|
| DeepSeek | Sinh mã nguồn chính (HTML, CSS, JavaScript) | Rất cao (~90% code) |
| ChatGPT | Viết báo cáo, debug lỗi, gợi ý cấu trúc | Cao |
| Figma AI / Canva | Thiết kế giao diện ban đầu | Trung bình |

## 2. Quy trình làm việc với AI

Nhóm không sử dụng AI theo kiểu "copy-paste mù quáng". Quy trình thực tế:
Bước 1: Xác định yêu cầu chức năng 
↓
Bước 2: Prompt AI sinh code khung
↓
Bước 3: Đọc lại code, hiểu từng hàm
↓
Bước 4: Chạy thử → phát hiện lỗi
↓
Bước 5: Tự sửa hoặc prompt lại để AI sửa
↓
Bước 6: Test lại → commit


## 3. Phần AI sinh ra (theo từng module)

| Module | File | % AI sinh | Sinh viên đã làm gì |
|---|---|---|---|
| Kiến trúc DB | `js/core.js` | ~80% | Đọc hiểu IIFE, sửa lỗi `seed()`, thêm `UI.errorState` |
| AI Logic | `js/ai.js` | ~90% | Hiểu rule-based, thêm `AI.renderFailure`, `AI.reportFailure` |
| Data | `js/data.js` | ~70% | Chỉnh sửa schema, thêm 10 giao dịch + 6 resources |
| User Module | `js/user-*.js` | ~85% | Fix phân trang, validation, empty state |
| Coach Module | `js/coach-*.js` | ~85% | Fix selector, thêm URL param `?id=` |
| Moderator/Admin | `js/moderator-*.js`, `js/admin-*.js` | ~85% | Fix filter, modal validation, CSV export |

## 4. Lỗi AI mắc phải và cách sửa

### Ví dụ 1: AI dùng `innerHTML` gây lỗ hổng XSS
- **Prompt đã dùng:** *"Viết hàm render danh sách giao dịch từ LocalStorage"*
- **Lỗi AI sinh ra:** `tbody.innerHTML = '<td>${r.desc}</td>'` — nếu người dùng nhập `<img src=x onerror=alert(1)>` vào mô tả → XSS
- **Cách sinh viên sửa:** Tự viết hàm `esc()` trong `core.js`, thay mọi `innerHTML` bằng `esc(r.desc)`. 
- **Minh chứng:** Commit `[hash]` trong file `js/core.js`

### Ví dụ 2: AI viết phân trang giả
- **Prompt:** *"Thêm phân trang cho bảng giao dịch"*
- **Lỗi:** AI viết `<button onclick="toast('Trang trước')">` — không cắt mảng thật
- **Cách sửa:** Tự viết lại dùng `slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE)` + disable nút ở biên
- **File:** `js/user-transactions.js`

### Ví dụ 3: AI hardcode DB trong `core.js`
- **Lỗi:** AI sinh hàm `seed()` với 4 giao dịch cứng, không đồng bộ `data.js`
- **Cách sửa:** Refactor `seed()` để deep-clone từ `window.SEED_DATA`, đảm bảo Single Source of Truth
- **File:** `js/core.js`

### Ví dụ 4: AI quên phím Escape đóng Modal
- **Lỗi:** AI chỉ xử lý click backdrop, không có `keydown` Escape
- **Cách sửa:** Thêm `document.addEventListener('keydown', e => { if (e.key === 'Escape') ...})`
- **File:** `js/core.js`

### Ví dụ 5: AI hardcode AI-1 cho mọi mẫu test
- **Lỗi:** `moderator-ai.js` gọi `AI.categorize()` cho cả 3 mẫu → sai nghiệp vụ
- **Cách sửa:** Viết phân nhánh theo `templateName` → gọi đúng `AI.categorize` / `AI.patternInsight` / `AI.goalCoach`
- **File:** `js/moderator-ai.js`

## 5. Phần sinh viên thực sự làm (KHÔNG phải AI)

- **Thiết kế Design System:** Chọn bảng màu cyan (#8ce5ff), typography, spacing — AI không tự nghĩ ra
- **Quyết định kiến trúc:** Phân tách `core.js` vs `data.js`, dùng LocalStorage thay vì API thật
- **Tích hợp đa module:** Kết nối `layout.js` + `core.js` + page scripts — AI không tự làm được
- **Test toàn bộ 15 màn hình:** Chạy Live Server, F5, resize 320/375/768/1280px, test 3 AI
- **Fix bug tương tác:** AI sinh code độc lập, sinh viên phải sửa để các module khớp nhau

## 6. Bài học

Sử dụng AI hiệu quả không phải là "để AI code hết", mà là:
1. **Biết đặt prompt đúng** để AI sinh code phù hợp ngữ cảnh
2. **Đủ kiến thức để phát hiện** lỗi AI (XSS, hardcode, missing edge case)
3. **Đủ kỹ năng để sửa** lỗi đó một cách chính xác
4. **Chịu trách nhiệm** với code mình commit — vì tên mình đứng trên Git log
