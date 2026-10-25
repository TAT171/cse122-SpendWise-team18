# Ma trận tính năng theo vai trò — SpendWise

## 1. Ma trận tổng quan

| Vai trò | Đọc | Tạo | Sửa | Lưu trữ/khóa | Tìm kiếm/lọc | Dashboard | AI | Tương tác |
|---|---|---|---|---|---|---|---|---|
| User | Giao dịch, mục tiêu, dữ liệu tài chính | Giao dịch, mục tiêu | Giao dịch, mục tiêu | Lưu trữ giao dịch/mục tiêu | Danh mục, loại, ngày, mô tả | Finance Dashboard | AI-1, AI-2, AI-3 | Chuyển insight/ghi chú cho Coach |
| Coach | Khách hàng, ngân sách, tài nguyên, ghi chú | Tài nguyên, ghi chú; tạo ngân sách nếu chưa có | Ngân sách, tài nguyên, ghi chú | Lưu trữ tài nguyên | Chọn khách hàng, lọc trạng thái/rủi ro | Client List | Xem kết quả AI-2 được chia sẻ | Nhận thông tin từ User; gửi tài nguyên cho Moderator |
| Moderator | Tài nguyên, mẫu AI, phản hồi | Phản hồi trả lời nếu mô hình dữ liệu hỗ trợ | Trạng thái tài nguyên, mẫu AI, phản hồi | Từ chối tài nguyên, tắt mẫu, đóng phản hồi | Trạng thái | — | Test AI-1 | Nhận tài nguyên từ Coach; trả kết quả duyệt |
| Admin | Danh mục, người dùng, tài nguyên, thông báo | Danh mục, lời mời người dùng, thông báo | Danh mục, người dùng | Lưu trữ danh mục, vô hiệu hóa người dùng | Tìm kiếm người dùng, chọn nhiều | System Dashboard | — | Giám sát dữ liệu toàn hệ thống |

## 2. Tính năng theo màn hình

### 2.1. `user-finance-dashboard.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| KPI tài chính | Read | Tính từ dữ liệu giao dịch và ngân sách |
| Biểu đồ 7 ngày | Read | Biểu diễn bằng HTML/CSS hoặc giải pháp đã có trong repo |
| Ngân sách theo danh mục | Read | Thanh tiến độ theo danh mục |
| AI-2 Spending Pattern Insight | AI | `AI.patternInsight(rows)`; cần loading, kết quả, giải thích và failure state |

### 2.2. `user-transaction-management.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Bảng giao dịch, tìm kiếm và lọc | Read | Đọc giao dịch và render bảng |
| Thêm/sửa/lưu trữ | CRUD | Dùng API DB thống nhất trong `js/core.js` |
| AI-1 Expense Categorizer | AI | `AI.categorize(desc)`; hiển thị danh mục, confidence và lý do |

### 2.3. `user-saving-goals.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Tab active/done/archived | Read/filter | Lọc theo trạng thái mục tiêu |
| Tạo/sửa/lưu trữ mục tiêu | CRUD | Dùng API DB thống nhất |
| AI-3 Goal Coach | AI | `AI.goalCoach(name, amount, deadline)`; đề xuất 3 bước |

### 2.4. `coach-client-list.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Danh sách và thống kê khách hàng | Read | Render dữ liệu khách hàng |
| Lọc rủi ro | Filter | Lọc danh sách theo tiêu chí rủi ro |
| Empty state | UX | Phân biệt không có dữ liệu và không có kết quả phù hợp |

### 2.5. `coach-budget-review.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Chọn khách hàng và xem ngân sách | Read | Tải ngân sách theo khách hàng |
| Tạo/sửa ngân sách | CRUD | Validate dữ liệu trước khi lưu |
| Ghi chú huấn luyện viên | CRUD | Lưu và hiển thị ghi chú theo khách hàng |
| Hiển thị anomaly | Read | Hiển thị kết quả AI-2 nếu có dữ liệu được chia sẻ |

### 2.6. `coach-resource-management.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Danh sách tài nguyên | Read | Render tài nguyên và trạng thái |
| Tạo/sửa/gửi duyệt | CRUD/workflow | Gửi duyệt bằng trạng thái `pending` |
| Validate nội dung | Validation | Quy tắc độ dài phải thống nhất với code thực tế |

### 2.7. `moderator-resource-review.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Hàng đợi chờ duyệt | Read | Lọc tài nguyên có trạng thái `pending` |
| Duyệt/yêu cầu sửa/từ chối | Workflow | Cập nhật trạng thái và phản hồi phù hợp |

### 2.8. `moderator-ai-template-management.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Danh sách mẫu AI | Read | Đọc dữ liệu `aiTemplates` |
| Sửa/bật/tắt/tăng version | Update | Validate dữ liệu và cập nhật version |
| Test console | AI/test | Gọi `AI.categorize(input)` theo mô tả hiện tại; xác minh tương thích với cấu trúc mẫu |

### 2.9. `moderator-feedback-center.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Danh sách và chi tiết phản hồi | Read | Hiển thị danh sách và nội dung được chọn |
| Trả lời/đóng phản hồi | Update | Validate câu trả lời và cập nhật trạng thái |

### 2.10. `admin-expense-category-management.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Danh sách danh mục | Read | Render danh mục |
| Thêm/sửa/lưu trữ/khôi phục | CRUD/workflow | Cập nhật trạng thái active/archived |

### 2.11. `admin-user-management.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Danh sách/tìm kiếm người dùng | Read/filter | Render và lọc danh sách |
| Sửa/vô hiệu hóa/mời | CRUD/workflow | Validate email, xác nhận hành động quan trọng |
| Chọn nhiều | UX | Vô hiệu hóa nút thao tác khi chưa chọn bản ghi |

### 2.12. `admin-system-dashboard.html`

| Tính năng | Loại | Mô tả kỹ thuật |
|---|---|---|
| Thống kê hệ thống | Read | Tính từ dữ liệu hiện có |
| Xuất CSV | Export | Tạo tệp CSV; kiểm tra encoding và dữ liệu |
| Tạo thông báo | Create | Lưu thông báo và cập nhật giao diện |

## 3. Ma trận AI theo vai trò

| Tính năng AI | User | Coach | Moderator | Admin |
|---|---|---|---|---|
| AI-1 Expense Categorizer | Luồng phân loại giao dịch | — | Test console | — |
| AI-2 Spending Pattern Insight | Luồng phân tích chi tiêu | Xem insight được chia sẻ | — | — |
| AI-3 Goal Coach | Luồng lập kế hoạch mục tiêu | — | — | — |
