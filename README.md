# SpendWise - CSE122 BTL-18

> **Học phần:** Phát triển ứng dụng Web cơ bản (CSE122)  
> **Đề tài:** Tài chính cá nhân / Financial Literacy  
> **Sản phẩm:** Frontend nhiều vai trò, CRUD + LocalStorage + 3 tính năng AI mô phỏng.

---

## 1. Giới thiệu

**SpendWise** là ứng dụng web hỗ trợ quản lý tài chính cá nhân và nâng cao tri thức tài chính (Financial Literacy).

Ứng dụng cung cấp nền tảng tương tác đa vai trò (**User, Coach, Moderator, Admin**), giúp người dùng quản lý chi tiêu, lập mục tiêu tiết kiệm và nhận các gợi ý thông minh từ ba tính năng AI mô phỏng nhằm cải thiện thói quen tài chính.

Các chức năng chính bao gồm:

- Quản lý giao dịch thu nhập và chi tiêu.
- Theo dõi ngân sách và mục tiêu tiết kiệm.
- Phân tích xu hướng chi tiêu.
- Đề xuất giải pháp cải thiện thói quen tài chính.
- Quản lý tài nguyên giáo dục tài chính.
- Phân quyền và quản lý người dùng theo vai trò.
- Lưu trữ dữ liệu trên trình duyệt bằng LocalStorage.

## 2. Thành viên nhóm

| STT | Họ và tên | MSSV | Phân công |
|---|---|---|---|
| 1 | Nguyễn Duy Quang | 2551060672 | Phụ trách User & Design System |
| 2 | Lê Thị Ly | 2551060648 | Phụ trách Coach & Core/AI Infrastructure |
| 3 | Trần Anh Thư | 2551060696 | Phụ trách Moderator, Admin & Layout/Responsive |


## 3. Công nghệ sử dụng

Dự án được xây dựng bằng các công nghệ web cơ bản, không sử dụng framework frontend.

| Công nghệ | Mục đích sử dụng |
|---|---|
| HTML5 | Xây dựng cấu trúc giao diện và sử dụng các thẻ HTML ngữ nghĩa |
| CSS3 | Thiết kế giao diện, bố cục, hiệu ứng và khả năng responsive |
| Flexbox | Sắp xếp các thành phần giao diện theo chiều ngang hoặc chiều dọc |
| CSS Grid | Xây dựng bố cục dạng lưới |
| CSS Variables | Quản lý màu sắc, kích thước và các thuộc tính thiết kế dùng chung |
| JavaScript ES6+ | Xử lý logic nghiệp vụ, tương tác và thao tác dữ liệu |
| LocalStorage | Lưu trữ dữ liệu cục bộ trên trình duyệt |
| Vanilla JavaScript/CSS | Xây dựng ứng dụng mà không phụ thuộc vào framework frontend |

**Đặc điểm kỹ thuật:**

- Không sử dụng backend hoặc cơ sở dữ liệu tập trung.
- Dữ liệu được lưu trữ cục bộ bằng LocalStorage.
- Các chức năng AI được mô phỏng bằng JavaScript theo quy tắc định sẵn (rule-based).
- Giao diện được tổ chức theo các vai trò người dùng.
- Hỗ trợ bố cục responsive cho các kích thước màn hình phù hợp với thiết kế.

## 4. Link triển khai (Live Deployment)

- **Link Deploy:** https://cse122-spendwise-team18.vercel.app/
- **Link thiết kế Figma/Canva:** https://canva.link/84aezfp2ua6gn20


## 5. Hướng dẫn chạy cục bộ (Local Setup)

### 5.1. Yêu cầu

- Đã cài đặt Git.
- Đã cài đặt Visual Studio Code hoặc một trình soạn thảo mã nguồn tương đương.
- Có trình duyệt web hiện đại như Google Chrome hoặc Microsoft Edge.
- Khuyến nghị cài đặt extension **Live Server** trong Visual Studio Code.

### 5.2. Các bước cài đặt

**Bước 1: Clone repository**

Mở Terminal và chạy lệnh:

```bash
git clone https://github.com/TAT171/cse122-SpendWise-team18.git
```

**Bước 2: Mở dự án**

Mở thư mục `cse122-SpendWise-team18` bằng Visual Studio Code.

**Bước 3: Khởi chạy ứng dụng**

Cài đặt extension **Live Server** nếu máy chưa có.

Trong Visual Studio Code:

1. Mở thư mục dự án.
2. Tìm file `index.html`.
3. Nhấp chuột phải vào file.
4. Chọn **Open with Live Server**.
5. Trình duyệt sẽ tự động mở trang đăng nhập của ứng dụng.

### 5.3. Tài khoản kiểm thử

Tài khoản kiểm thử được cung cấp để hỗ trợ việc trải nghiệm ứng dụng.

| Thông tin | Giá trị |
|---|---|
| Email | `minhanh@email.com` |
| Mật khẩu | `12345678` |


## 6. Danh sách màn hình

Dự án bao gồm **15 màn hình**, được chia thành ba màn hình chung và 12 màn hình theo bốn vai trò người dùng.

Các vai trò chính:

- **User:** Người dùng quản lý tài chính cá nhân.
- **Coach:** Huấn luyện viên hỗ trợ và hướng dẫn người dùng.
- **Moderator:** Kiểm duyệt tài nguyên và nội dung.
- **Admin:** Quản trị viên quản lý hệ thống.

Danh sách chi tiết các màn hình, trạng thái hoàn thiện và phân công thực hiện được trình bày trong file:

[`docs/screen-inventory.md`]

## 7. Phân quyền và luồng nghiệp vụ

SpendWise tổ chức các chức năng theo bốn vai trò chính.

### 7.1. User — Người dùng

Người dùng có thể:

- Quản lý giao dịch thu nhập và chi tiêu.
- Thêm, sửa và xóa giao dịch.
- Theo dõi ngân sách cá nhân.
- Tạo và quản lý mục tiêu tiết kiệm.
- Xem thống kê và báo cáo tài chính.
- Sử dụng ba tính năng AI mô phỏng.
- Tiếp nhận và điều chỉnh các đề xuất từ hệ thống.

### 7.2. Coach — Huấn luyện viên

Huấn luyện viên có thể:

- Xem báo cáo chi tiêu của khách hàng theo phạm vi quyền được cấp.
- Theo dõi tình hình thực hiện ngân sách.
- Hỗ trợ khách hàng xây dựng kế hoạch tài chính.
- Tạo tài nguyên giáo dục tài chính.
- Gửi tài nguyên đến Moderator để kiểm duyệt.

### 7.3. Moderator — Kiểm duyệt viên

Kiểm duyệt viên có thể:

- Xem danh sách tài nguyên đang chờ kiểm duyệt.
- Phê duyệt hoặc từ chối tài nguyên do Coach gửi.
- Quản lý các mẫu và quy tắc AI theo chức năng được triển khai.
- Tiếp nhận và xử lý phản hồi của người dùng.
- Theo dõi trạng thái xử lý nội dung.

### 7.4. Admin — Quản trị viên

Quản trị viên có thể:

- Quản lý danh mục dùng chung của hệ thống.
- Quản lý tài khoản và thông tin người dùng.
- Theo dõi dashboard tổng quan hệ thống.
- Giám sát hoạt động của ứng dụng.
- Xuất báo cáo theo các chức năng được triển khai.

### 7.5. Luồng nghiệp vụ tổng quát

Luồng nghiệp vụ của hệ thống được tổ chức như sau:

1. Người dùng đăng nhập và truy cập các chức năng tương ứng với vai trò.
2. User quản lý giao dịch, ngân sách và mục tiêu tiết kiệm.
3. Hệ thống lưu trữ dữ liệu và cung cấp thông tin phục vụ thống kê.
4. Các tính năng AI mô phỏng phân tích dữ liệu hoặc nội dung đầu vào để đưa ra gợi ý.
5. Coach xây dựng tài nguyên giáo dục tài chính và gửi đi kiểm duyệt.
6. Moderator kiểm tra, phê duyệt hoặc từ chối tài nguyên.
7. Admin quản lý các thành phần hệ thống và theo dõi hoạt động tổng quan.

## 8. Tính năng AI

SpendWise tích hợp ba tính năng AI mô phỏng nhằm hỗ trợ người dùng quản lý tài chính cá nhân.

### 8.1. AI-1: Expense Categorizer

**Mục tiêu:** Tự động phân loại giao dịch dựa trên nội dung mô tả.

**Cách hoạt động:**

- Tiếp nhận mô tả giao dịch.
- Phân tích từ khóa theo các quy tắc được định nghĩa trước.
- Đề xuất danh mục phù hợp.
- Cho phép người dùng chấp nhận, chỉnh sửa hoặc từ chối kết quả.

**Ví dụ:** Một giao dịch có mô tả liên quan đến ăn uống có thể được đề xuất vào danh mục Ăn uống.

### 8.2. AI-2: Spending Pattern Insight

**Mục tiêu:** Phân tích xu hướng chi tiêu và đưa ra các gợi ý giúp người dùng quản lý tài chính hiệu quả hơn.

**Cách hoạt động:**

- Phân tích dữ liệu chi tiêu hiện có.
- Xác định các danh mục có mức chi tiêu đáng chú ý.
- Đưa ra cảnh báo khi phát hiện khoản chi bất thường theo quy tắc đã thiết lập.
- Đề xuất các biện pháp điều chỉnh ngân sách.

### 8.3. AI-3: Goal Coach

**Mục tiêu:** Hỗ trợ người dùng xây dựng lộ trình thực hiện mục tiêu tiết kiệm.

**Cách hoạt động:**

- Tiếp nhận thông tin mục tiêu tiết kiệm.
- Xem xét số tiền mục tiêu và tiến độ hiện tại.
- Đưa ra gợi ý kế hoạch tiết kiệm theo các bước.
- Hỗ trợ người dùng điều chỉnh kế hoạch phù hợp với tình hình tài chính.

Lộ trình gợi ý được tổ chức thành ba bước:

1. **Đánh giá:** Xác định mục tiêu và tình hình tài chính hiện tại.
2. **Lập kế hoạch:** Đề xuất mức tiết kiệm và thời gian thực hiện.
3. **Theo dõi:** Theo dõi tiến độ và điều chỉnh kế hoạch khi cần thiết.

### 8.4. Trạng thái xử lý AI

Các tính năng AI được thiết kế để hỗ trợ trải nghiệm người dùng thông qua những trạng thái xử lý phù hợp:

- **Loading:** Hiển thị khi hệ thống đang xử lý yêu cầu.
- **Success:** Hiển thị kết quả gợi ý khi xử lý thành công.
- **Failure UX:** Thông báo khi không thể tạo kết quả hoặc dữ liệu đầu vào không phù hợp.
- **Accept:** Người dùng chấp nhận đề xuất.
- **Edit:** Người dùng chỉnh sửa đề xuất.
- **Reject:** Người dùng từ chối đề xuất.

> **Lưu ý:** Các tính năng AI trong phiên bản hiện tại được mô phỏng bằng JavaScript theo quy tắc định sẵn, không phải mô hình AI thực sự được kết nối qua API.

## 9. Cấu trúc thư mục

```text
cse122-SpendWise-team18/
├── css/
│   ├── base.css
│   ├── components.css
│   ├── layout.css
│   └── responsive.css
│
├── js/
│   ├── core.js
│   ├── ai.js
│   ├── data.js
│   └── page scripts
│
├── docs/
│   ├── screen-inventory.md
│   ├── ai-usage-report.md
│   └── obs-evidence.md
│
├── login.html
├── user-*.html
├── coach-*.html
├── moderator-*.html
├── admin-*.html
│
└── README.md
```

**Chức năng các thư mục:**

| Thư mục/File | Mô tả |
|---|---|
| `css/` | Chứa các file CSS phục vụ giao diện, component, layout và responsive |
| `js/` | Chứa logic nghiệp vụ, dữ liệu và các chức năng JavaScript |
| `docs/` | Chứa tài liệu mô tả màn hình, báo cáo sử dụng AI và video minh chứng |
| `index.html` | Màn hình bắt đầu|
| `login.html` | Giao diện đăng nhập |
| `user-*.html` | Các giao diện dành cho User |
| `coach-*.html` | Các giao diện dành cho Coach |
| `moderator-*.html` | Các giao diện dành cho Moderator |
| `admin-*.html` | Các giao diện dành cho Admin |
| `README.md` | Tài liệu giới thiệu và hướng dẫn sử dụng dự án |


## 10. Video minh chứng OBS

Các video minh chứng được sử dụng để ghi lại quá trình thực hiện dự án và hỗ trợ việc đánh giá kết quả làm việc của các thành viên.

Danh sách video và thông tin minh chứng được trình bày tại:

[`docs/obs-evidence.md`]

## 11. Khai báo sử dụng AI

Dự án có sử dụng các công cụ AI trong quá trình phát triển và xây dựng một số chức năng mô phỏng.

Báo cáo chi tiết được lưu tại:

[`docs/ai-usage-report.md`]

## 12. Hạn chế đã biết

### 12.1. Hạn chế về lưu trữ dữ liệu

- Dữ liệu được lưu trong LocalStorage của trình duyệt.
- Dữ liệu không tự động đồng bộ giữa các thiết bị.
- Dữ liệu không được chia sẻ realtime giữa nhiều người dùng thông qua backend.
- Việc xóa dữ liệu trình duyệt có thể làm mất dữ liệu đã lưu cục bộ.

### 12.2. Hạn chế về AI

- Các tính năng AI được mô phỏng bằng JavaScript theo quy tắc định sẵn.
- Khả năng phân tích phụ thuộc vào các quy tắc và dữ liệu đầu vào.
- Chưa kết nối với các API mô hình ngôn ngữ lớn như Gemini hoặc OpenAI.
- Các đề xuất chỉ mang tính chất tham khảo và hỗ trợ quản lý tài chính cá nhân.

### 12.3. Hạn chế về hệ thống

- Chưa có backend tập trung để quản lý dữ liệu.
- Chưa có cơ sở dữ liệu dùng chung.
- Khả năng quản lý và đồng bộ dữ liệu giữa nhiều người dùng còn hạn chế.
- Các chức năng quản lý quyền cần được đánh giá theo phạm vi triển khai thực tế của frontend.


## 13. License

Dự án SpendWise được thực hiện phục vụ mục đích học tập trong khuôn khổ học phần **CSE122 - Phát triển ứng dụng Web cơ bản, Trường Đại học Thủy Lợi**.

Sản phẩm được xây dựng nhằm minh họa kiến thức về HTML, CSS, JavaScript, quản lý dữ liệu phía trình duyệt và thiết kế ứng dụng web nhiều vai trò.

Dự án không được phát triển với mục đích thương mại.

---

**SpendWise - Quản lý tài chính cá nhân thông minh hơn, xây dựng thói quen tài chính tốt hơn.**