# SpendWise — Báo cáo đề tài

> **Học phần:** CSE122 – Phát triển ứng dụng Web cơ bản  
> **Đề tài:** BTL-18 – Tài chính cá nhân / Financial Literacy  
> **Quy mô:** 3 sinh viên  
> **Sản phẩm:** Frontend nhiều vai trò, CRUD + LocalStorage + 3 tính năng AI mô phỏng

## 1. Ngữ cảnh

Người mới quản lý tài chính có thể biết mình đã chi bao nhiêu nhưng gặp khó khăn khi hiểu xu hướng chi tiêu, chuyển nhận định thành hành động và phối hợp với huấn luyện viên để được review. 
SpendWise tập trung vào **giáo dục tài chính cá nhân**, không cung cấp tư vấn đầu tư.

## 2. Phát biểu vấn đề

- **P1: Giao dịch khó phân loại nhất quán:** Người dùng khó xếp loại các khoản chi một cách chuẩn xác và đồng bộ qua thời gian. 
- **P2: Mục tiêu tiết kiệm thiếu kế hoạch cụ thể:** Thiếu sự lộ trình và hướng dẫn từng bước để đạt được các mục tiêu tài chính đề ra. 
- **P3:Dashboard có nhiều số liệu nhưng ít giải thích:** Các con số hiển thị chưa đi kèm bối cảnh hoặc giải thích rõ ràng để người dùng đưa ra quyết định. 
- **P4: Khó nhận biết khoản chi bất thường:** Người dùng dễ bỏ qua các chi tiêu đột biến hoặc không hợp lý do không có công cụ cảnh báo. 

## 3. Mục tiêu

•	**Xây dựng lộ trình tiết kiệm khả thi & có tính giáo dục:** Hướng dẫn người dùng thiết lập và chia nhỏ mục tiêu tài chính thành các bước thực hiện cụ thể, giúp chuyển đổi mong muốn thành hành động thực tế. 

•	**Trực quan hóa và giải thích dữ liệu chi tiêu (Insight Engine):** Chuyển đổi dữ liệu thô trên Bảng điều khiển thành các mô tả xu hướng chi tiêu đi kèm lý giải nguyên nhân rõ ràng, giúp người dùng hiểu sâu sắc thói quen tài chính của bản thân. 

•	**Phát hiện & cảnh báo khoản chi bất thường:** Tự động nhận diện các biến động tài chính đột biến hoặc không phù hợp với hạn mức để kịp thời đưa ra cảnh báo cho người dùng. 

•	**Hệ sinh thái kết nối đa vai trò:** Tạo nền tảng tương tác hiệu quả giữa Người dùng và Huấn luyện viên tài chính (để review ngân sách), đồng thời đảm bảo nội dung giáo dục tài chính được Kiểm duyệt viên và Quản trị viên kiểm soát chất lượng kỹ lưỡng. 

## 4. Vai trò và phạm vi

| Vai trò | Trách nhiệm | Số màn hình |
|---|---|---:|
| User | Quản lý giao dịch và mục tiêu; dùng 3 AI | 3 |
| Coach | Review ngân sách, theo dõi khách hàng, tạo tài nguyên giáo dục | 3 |
| Moderator | Duyệt tài nguyên, quản lý mẫu AI, xử lý phản hồi | 3 |
| Admin | Quản lý danh mục và người dùng, giám sát hệ thống | 3 |

Ngoài 12 màn hình theo vai trò, sản phẩm có 3 màn hình chung: 
index.html (Landing Page), login.html (Đăng nhập), 404.html (Báo lỗi).

## 5. Luồng nghiệp vụ

### 5.1. Luồng chung — đăng nhập

```text
Mở index.html (Landing Page giới thiệu sản phẩm)
→ Bấm "Đăng nhập" hoặc "Bắt đầu ngay"
→ Chuyển đến login.html
→ Nhập email/mật khẩu → validate → thông báo kết quả -> user-finance-dashboard.html
HOẶC
→ Chọn một trong bốn nút demo role
→ Session.setRole(role) → chuyển đến màn hình mặc định:
   user      → user-finance-dashboard.html
   coach     → coach-client-list.html
   moderator → moderator-resource-review.html
   admin     → admin-system-dashboard.html
```

### 5.2. Luồng User

#### U-1 — Xem dashboard và AI-2

```text
user-finance-dashboard.html
→ Yêu cầu phân tích chi tiêu
→ Hiển thị loading
→ Hiển thị tổng chi, danh mục chi nhiều, khoản bất thường,
  lý do, confidence và disclaimer
→ Người dùng chấp nhận / sửa / từ chối / lưu ghi chú /
  chuyển cho Coach / tạo lại
```

#### U-1 — Thêm/sửa giao dịch và phân loại bằng AI-1

```text
user-finance-dashboard.html
→ user-transaction-management.html
→ Nhập mô tả, số tiền, ngày và danh mục
→ Chạy phân loại
→ Hiển thị trạng thái loading
→ Hiển thị danh mục dự đoán, confidence, lý do và disclaimer
→ Người dùng chấp nhận / sửa / từ chối / phân loại lại / lưu
→ Lưu giao dịch qua DB.insert hoặc DB.update
→ Render lại danh sách giao dịch
```

#### U-2 — Lập kế hoạch tiết kiệm với AI-3

```text
user-saving-goals.html
→ Chọn tab active / done / archived
→ Nhập tên mục tiêu, số tiền và thời hạn
→ Yêu cầu gợi ý lộ trình
→ Hiển thị loading rồi kết quả 3 bước, lý do và disclaimer
→ Người dùng chấp nhận / sửa / từ chối / tạo lại / lưu
→ Lưu mục tiêu hoặc cập nhật mục tiêu qua DB
→ Render lại danh sách mục tiêu
```



### 5.3. Luồng Coach

#### C-1 — Review ngân sách khách hàng

```text
coach-client-list.html
-> Dashboard hiển thị thông tin về số lượng khách, cần chú ý và đúng mục tiêu
→ Lọc khách hàng theo rủi ro → hiển thị khách hàng tương ứng với mức rủi ro
→ Chọn khách hàng → "xem" -> coach-budget-review.html
→ Chọn thẻ thống kê để mở modal chỉnh sửa
→ DB.update('budgets')
→ Nhập ghi chú → lưu vào coachNotes
              -> hủy (không thực hiện ghi chú nữa)
              -> xóa ghi chú
```

#### C-2 — Tạo và quản lý tài nguyên giáo dục

```text
coach-resource-management.html
→ Tạo hoặc sửa tài nguyên → kiểm tra dữ liệu đầu vào
→ Gửi duyệt → lưu status = 'pending'
→ Theo dõi trạng thái tài nguyên
→ Tài nguyên bị từ chối có thể được lưu trữ theo quy tắc nghiệp vụ
```

### 5.4. Luồng Moderator

#### M-1 — Duyệt tài nguyên

```text
moderator-resource-review.html
→ Lấy resources có status = 'pending'
→ Duyệt / yêu cầu sửa / từ chối
→ Cập nhật trạng thái tài nguyên
```

#### M-2 — Kiểm thử và quản lý mẫu AI

```text
moderator-ai-template-management.html
→ Hiển thị mẫu từ DB.all('aiTemplates')
→ Chọn Test → nạp input mẫu → chạy AI.categorize(input)
→ Chọn Sửa → kiểm tra form → cập nhật mẫu và version
```

#### M-3 — Xử lý phản hồi

```text
moderator-feedback-center.html
→ Hiển thị danh sách phản hồi và chi tiết
→ Chọn phản hồi → nhập câu trả lời
→ Giải quyết → cập nhật trạng thái feedback
```

### 5.5. Luồng Admin

#### A-1 — Quản lý danh mục chi tiêu

```text
admin-expense-category-management.html
→ Hiển thị danh mục
→ Thêm / sửa / lưu trữ / khôi phục
→ Cập nhật dữ liệu và render lại bảng
```

#### A-2 — Quản lý người dùng

```text
admin-user-management.html
→ Tìm kiếm/chọn người dùng
→ Sửa tên hoặc vai trò; vô hiệu hóa có xác nhận
→ Có thể thêm người dùng bằng email và vai trò
→ Cập nhật dữ liệu và render lại bảng
```

#### A-3 — Giám sát hệ thống

```text
admin-system-dashboard.html
→ Tính toán thống kê từ dữ liệu hiện có
→ Xuất báo cáo
→ Tạo thông báo
->Quick actions -> Mời người dùng ->admin-user-management.html
                -> Quản lí danh mục ->admin-expense-categories-management.html
                -> Xem hàng đợi
                -> Cấu hình AI
```

## 6. Tính năng AI

| Mã | Tên | Màn hình | Hành động chính |
|---|---|---|---|
| AI-1 | Expense Categorizer | User Transactions; Moderator AI Templates | Chấp nhận, sửa, từ chối, phân loại lại, lưu; test trong Moderator |
| AI-2 | Spending Pattern Insight | User Dashboard | Chấp nhận, sửa, từ chối, lưu ghi chú, chuyển cho Coach, tạo lại |
| AI-3 | Goal Coach | User Saving Goals | Chấp nhận, sửa, từ chối, tạo lại, lưu |

Các AI là mô phỏng bằng JavaScript. Khi có lỗi hoặc không đủ dữ liệu, giao diện cần cung cấp thông báo và cách tiếp tục thủ công. Chi tiết trạng thái cần được kiểm thử thực tế trước khi ghi nhận là hoàn thành.

## 7. Công nghệ

- HTML5 semantic, CSS3 (Flexbox, Grid, custom properties).
- JavaScript ES6+ thuần.
- LocalStorage với khóa `spendwise_db_v1`, dữ liệu seed từ `js/data.js`.
- Không có backend và không gọi API AI thật.

## 8. Tài liệu liên quan

- Danh sách màn hình: `docs/screen-inventory.md`
- Ma trận vai trò: `docs/roles-and-features.md`
- Phân công và Git: `docs/team-assignment.md`
- Khai báo AI: `docs/ai-usage-report.md`
- Minh chứng OBS: `docs/obs-evidence.md`
