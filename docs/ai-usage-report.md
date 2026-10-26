# Khai báo sử dụng AI — SpendWise (CSE122, Team 18)

> **Cơ sở lập báo cáo:** Bản tổng hợp lịch sử chỉnh sửa code + prompt, gồm 10 giai đoạn phát triển, khoảng 49 prompt được ghi lại và hơn 85 lần chỉnh sửa trên 30+ file.


## 1. Công cụ sử dụng

| Công cụ | Mục đích sử dụng |
|---|---|
| **DeepSeek** | Hỗ trợ tạo mã nguồn, triển khai chức năng, rà soát và sửa lỗi HTML/CSS/JavaScript theo prompt.|
| **ChatGPT** | Hỗ trợ phân tích yêu cầu, review mã nguồn, tìm nguyên nhân lỗi, đề xuất cách sửa, cải thiện cấu trúc dự án và tài liệu. |
| **Figma AI / Canva** | Hỗ trợ thiết kế hoặc hoàn thiện tài liệu thiết kế nếu thực tế nhóm đã sử dụng. |

### Bảng 2. Các prompt tiêu biểu trong quá trình xây dựng và chỉnh sửa website

| Prompt (trích nguyên văn hoặc tóm tắt sát nguyên văn) | Nội dung chỉnh sửa | Kết quả chính |
|---|---|---|
| “Hãy tạo cho tôi một trang web có chức năng và giao diện giống 100% thiết kế màn hình, riêng phần AI có thể chỉnh sửa giao diện tùy theo nhu cầu” | Khởi tạo website SpendWise dựa trên thiết kế giao diện và các chức năng đã xác định. | Xây dựng cấu trúc HTML, CSS, JavaScript ban đầu cho website và các màn hình chức năng. |
| “Có nên sửa để phần user dashboard phản ứng theo các giao dịch” | Điều chỉnh Dashboard người dùng để các chỉ số phản ánh dữ liệu giao dịch thực tế. | Chuyển các chỉ số tổng quan sang tính toán từ dữ liệu giao dịch, giúp thông tin trên Dashboard cập nhật theo dữ liệu. |
| “sau khi chỉnh sửa phân trang thì tôi lại chỉ thấy mỗi 6 giao dịch” | Sửa lỗi hiển thị danh sách giao dịch sau khi thay đổi chức năng phân trang. | Kiểm tra logic phân trang, dữ liệu khởi tạo và cơ chế lưu trữ để danh sách giao dịch được hiển thị đúng. |
| “Lỗi Uncaught Error at renderDashboard / renderTx / renderGoals” | Khắc phục lỗi JavaScript tại các hàm hiển thị Dashboard, giao dịch và mục tiêu. | Khôi phục kết nối với đối tượng dữ liệu dùng chung để các màn hình có thể đọc và hiển thị dữ liệu. |
| “Lỗi filterClients / renderClientOptions / loadBudget” | Sửa lỗi lọc khách hàng, hiển thị danh sách lựa chọn và tải ngân sách ở các màn hình Huấn luyện viên tài chính. | Điều chỉnh việc nạp các tệp JavaScript và kết nối dữ liệu giữa các chức năng liên quan. |
| “phần kiểm thử AI chỉ có thể thử AI 01” | Điều chỉnh chức năng kiểm thử AI trên màn hình Kiểm duyệt viên. | Sửa logic định tuyến để các mẫu kiểm thử gọi đúng chức năng AI tương ứng, thay vì chỉ chạy AI-1. |
| “khi nhập thiếu tên AI vẫn chạy, và có thể thay đổi phần gợi ý không” | Bổ sung kiểm tra dữ liệu đầu vào và cho phép chỉnh sửa gợi ý do AI tạo ra. | Kiểm tra tên mục tiêu trước khi xử lý và hỗ trợ người dùng điều chỉnh các bước gợi ý. |

## 3. Các lỗi và chỉnh sửa nhỏ trong quá trình hoàn thiện

| Nhóm | Vấn đề được ghi nhận | Cách xử lý được ghi nhận | Khu vực liên quan |
|---|---|---|---|
| Hiển thị trang | Dùng `document.write()` sau khi DOM đã được parse có thể làm mất nội dung trang. | Chuyển sang cơ chế mount nội dung bằng `innerHTML` và `<template>`. | `core.js`, các trang dùng layout |
| Sự kiện HTML | Dữ liệu động kết hợp với `JSON.stringify` trong thuộc tính `onclick` có thể làm hỏng attribute. | Dùng `data-*` và `addEventListener` thay cho handler inline chứa dữ liệu động. | `user-transactions.js`, `user-goals.js`, `coach-resources.js`, `admin-categories.js`, `admin-users.js` |
| Gọi phần tử DOM | Gọi `.click()` trên phần tử không còn tồn tại sau khi render lại gây lỗi `null.click`. | Gọi hàm xử lý trực tiếp thay vì mô phỏng click trên phần tử đã bị thay thế. | Luồng insight / render động |
| Dữ liệu lưu trữ | `Store.get()` có thể thay mảng rỗng mà người dùng chủ động tạo ra bằng dữ liệu mặc định. | Phân biệt khóa chưa tồn tại với giá trị đã lưu là mảng rỗng; có xử lý migrate dữ liệu. | `core.js` |
| Mã định danh | `_uid()` có nguy cơ tạo ID trùng. | Kết hợp timestamp/ngẫu nhiên và kiểm tra trùng trước khi trả ID. | `core.js` |
| Nội dung động/XSS | Nội dung người dùng được đưa trực tiếp vào `innerHTML` hoặc toast. | Bổ sung escape nội dung bằng `esc()` tại các vị trí được ghi nhận. | `core.js`, module giao dịch/danh mục |
| Trạng thái AI | Thiếu hàm xử lý khi AI thất bại hoặc không có kết quả phù hợp. | Bổ sung `renderFailure` và `reportFailure`. | `ai.js` |
| Tính thời gian | Công thức tính số tháng dùng phép chia 30 ngày. | Điều chỉnh sang hệ số 30,44 ngày theo lịch sử. | `ai.js` |
| Bộ lọc giao dịch | Bộ lọc tháng bị cố định vào một giá trị hoặc thiếu lựa chọn thời gian. | Dùng giá trị filter động, hỗ trợ “Tất cả thời gian” và các tháng được yêu cầu. | `user-transactions.js`, HTML giao dịch |
| Trạng thái rỗng | Danh sách không có kết quả thiếu thao tác giúp người dùng quay lại. | Bổ sung CTA, chẳng hạn thao tác xóa bộ lọc. | Giao dịch và các danh sách liên quan |
| Dữ liệu Coach | Danh sách khách hàng hoặc ngân sách bị hardcode/trùng với dữ liệu seed chung. | Đọc từ DB và giữ dữ liệu khởi tạo tại nguồn chung. | `coach-clients.js`, `coach-budget.js`, `data.js` |
| Chọn khách hàng | `querySelector('clientSelector')` không chọn phần tử theo ID như dự kiến. | Dùng `getElementById('clientSelector')`. | `coach-budget.js` |
| Điều hướng Coach | Liên kết “Xem” không truyền/đọc mã khách hàng từ URL. | Đọc query parameter `?id=` bằng `URLSearchParams`. | `coach-clients.js`, `coach-budget.js` |
| Ghi chú Coach | Ghi chú có thể tiếp tục giữ dữ liệu khách trước sau khi đổi khách. | Reset hoặc nạp lại dữ liệu theo khách hàng hiện tại; bổ sung luồng hiển thị ghi chú ở dashboard theo lịch sử. | Coach Budget, User Dashboard |
| Moderator Review | Nội dung chi tiết hoặc các bước gợi ý không đổi theo mục được chọn vì còn hardcode. | Render nội dung từ dữ liệu mục đang chọn và tạo danh sách bước động. | `moderator-review.js`, HTML review |
| Moderator AI | Bảng template hardcode hoặc nút “Tạo mẫu” chỉ hiện toast. | Render danh sách từ dữ liệu và lưu mẫu mới vào DB. | `moderator-ai.js`, HTML Moderator AI |
| Feedback | Phản hồi của Moderator không lưu nội dung `reply` hoặc thông tin xử lý. | Bổ sung các trường dữ liệu được ghi nhận như `reply`, `resolvedBy`, `resolvedAt`. | `moderator-feedback.js` |
| Admin | Modal xác nhận vô hiệu hóa bị trùng; lý do chưa được kiểm tra đầy đủ. | Loại bỏ khối giao diện thừa và kiểm tra trường lý do trước khi xác nhận. | `admin-users.js`, HTML quản lý người dùng |
| Admin | Một số thao tác thêm thông báo/danh mục mới chỉ hiện toast. | Chuyển sang thao tác ghi dữ liệu thực tế theo lịch sử. | `admin-system.js`, `admin-categories.js` |
| CSV | File CSV xuất ra có thể gặp vấn đề với ký tự BOM. | Bổ sung `\uFEFF` theo lịch sử chỉnh sửa. | `admin-system.js` |
| HTML ngữ nghĩa | Một số trang sử dụng nhiều `div` cho các vùng có ý nghĩa như header, main, nav hoặc section. | Chuyển một số vùng sang thẻ HTML ngữ nghĩa và bổ sung nhãn/ID cho form. | Các trang User, Coach, Moderator, Admin |
| Responsive | Bảng bị cắt ngang; CSS responsive có đoạn lặp hoặc thiếu ngoặc. | Điều chỉnh `overflow-x` và dọn cú pháp CSS. | `components.css`, `responsive.css` |
| Landing Page | `index.html` cũ được mô tả trong lịch sử là trang redirect. | Thay bằng Landing Page giới thiệu ứng dụng. | `index.html` |
| Tài liệu | Inventory thiếu màn hình, sai thông tin phiên bản; một số tài liệu còn placeholder. | Cập nhật danh mục màn hình, mô tả và tài liệu; các link/hash phải được xác minh là thật. | `README.md`, `docs/*.md` |

### Một số pattern kỹ thuật rút ra từ các lần sửa

1. **Không chỉ hiển thị thông báo thành công:** thao tác thêm/sửa/xóa cần cập nhật dữ liệu và render lại giao diện.
2. **Không dùng dữ liệu hardcode thay cho dữ liệu thực:** KPI, bảng, bộ lọc và kết quả cần dựa trên nguồn dữ liệu phù hợp.
3. **Kiểm tra dữ liệu đầu vào:** chặn các trường hợp bắt buộc bị bỏ trống và đưa ra thông báo rõ ràng.
4. **Render nội dung động an toàn:** escape dữ liệu trước khi đưa vào HTML; tránh ghép dữ liệu người dùng trực tiếp vào handler inline.
5. **Giữ một nguồn dữ liệu khởi tạo:** tránh tạo seed riêng lẻ trong nhiều module dẫn đến dữ liệu không đồng nhất.
6. **Kiểm tra trạng thái biên:** danh sách rỗng, trang đầu/cuối, khách hàng chưa chọn, AI thất bại và modal bị hủy.
7. **Kiểm thử sau khi tích hợp:** một bản sửa ở `core.js`, `data.js` hoặc layout có thể ảnh hưởng nhiều màn hình.

## 4. Cách kiểm chứng và bằng chứng

| Hạng mục | Cách kiểm chứng |
|---|---|
| DB/seed | Mở ứng dụng, kiểm tra dữ liệu ban đầu, thêm/sửa/xóa dữ liệu và tải lại trang. |
| Giao dịch | Tạo nhiều giao dịch, kiểm tra filter, phân trang, trang đầu/cuối và trạng thái không có kết quả. |
| Dashboard | Đối chiếu KPI và biểu đồ với dữ liệu giao dịch đã lưu. |
| AI-3 Goal Coach | Thử khi thiếu tên mục tiêu, sửa các bước gợi ý và lưu kế hoạch. |
| Moderator AI | Chạy từng template, kiểm tra chức năng được gọi và dạng kết quả trả về. |
| Coach | Chọn khách hàng khác nhau, mở liên kết có `?id=`, kiểm tra ngân sách và ghi chú. |
| Admin/Moderator | Thử thao tác thêm/sửa, duyệt/từ chối, validation, hủy modal và xác nhận. |
| Bảo mật đầu ra | Kiểm tra những nơi hiển thị nội dung do người dùng nhập; xác nhận nội dung được escape và không được thực thi như HTML. |
| Responsive/HTML | Mở các trang có bảng ở nhiều kích thước màn hình; kiểm tra Console, label và điều hướng. |
| Tài liệu | So sánh tên file, chức năng, inventory và bằng chứng với repository hiện tại. |

## 5. Giới hạn của các chức năng AI trong sản phẩm

Theo mô tả trong tài liệu dự án, ChatGPT/DeepSeek được dùng trong quá trình phát triển; các chức năng AI-1, AI-2 và AI-3 bên trong SpendWise là luồng mô phỏng bằng JavaScript/rule-based, không phải bằng chứng rằng ứng dụng đang gọi API của mô hình AI bên ngoài.

| Chức năng | Cách mô tả thận trọng |
|---|---|
| AI-1 — Phân loại giao dịch | Chức năng phân loại mô phỏng trong ứng dụng; xác nhận quy tắc cụ thể bằng mã nguồn hiện tại. |
| AI-2 — Spending Pattern Insight | Chức năng tổng hợp/gợi ý theo logic và dữ liệu của ứng dụng; không mô tả là phản hồi từ LLM nếu không có tích hợp API. |
| AI-3 — Goal Coach | Luồng hỗ trợ mục tiêu minh họa; kiểm tra mã nguồn để xác định cách sinh gợi ý thực tế. |

## 6. Điều rút ra từ quá trình sử dụng AI

1. Prompt cần nêu rõ bối cảnh, file liên quan, hành vi hiện tại và kết quả mong muốn.
2. Mã nguồn chạy được ở một màn hình chưa chắc đã đúng khi tích hợp với các module khác.
3. Một bản sửa có thể tạo lỗi mới ở phần dữ liệu, thứ tự nạp script hoặc trạng thái giao diện.
4. Các thao tác CRUD, filter và AI action phải thay đổi dữ liệu thật, không chỉ hiển thị thông báo.
5. Cần kiểm tra dữ liệu đầu vào, danh sách rỗng, trạng thái biên và dữ liệu lưu sau khi tải lại trang.
6. Cần phân biệt AI dùng trong quá trình lập trình với AI được tích hợp trong sản phẩm.
7. Nhóm chịu trách nhiệm với mã nguồn và báo cáo đã nộp, kể cả khi AI sinh phần lớn code.

