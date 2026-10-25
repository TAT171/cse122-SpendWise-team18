# Khai báo sử dụng AI – SpendWise

## 1. Công cụ sử dụng
| Công cụ | Mục đích |
|---|---|
| Figma AI / Canva | Tạo và chỉnh sửa thiết kế UI/UX, xuất Component Guide. |
| DeepSeek | Hỗ trợ viết logic JavaScript (CRUD, Filter, LocalStorage). |
| ChatGPT | Viết và định dạng tài liệu Markdown, hỗ trợ debug CSS. |

## 2. Phần AI hỗ trợ & Phần sinh viên chỉnh sửa
- **Thiết kế:** AI tạo khung ban đầu. Sinh viên chỉnh lại màu sắc (Design Tokens) cho đồng bộ, thêm trạng thái Empty/Loading.
- **Mã nguồn:** AI gợi ý hàm render. Sinh viên tích hợp vào dự án, sửa lỗi `innerHTML` (XSS) thành `textContent`, và viết thêm logic chặn AI chạy khi thiếu dữ liệu.
- **Tài liệu:** AI tạo khung báo cáo. Sinh viên đối chiếu lại với code thực tế (số lượng màn hình, tên hàm) để chỉnh sửa cho chính xác.

## 3. Ví dụ cụ thể về sửa lỗi AI (Dùng cho vấn đáp)
- **Prompt đã dùng:** *"Viết hàm JS phân trang cho danh sách giao dịch lưu trong LocalStorage."*
- **Lỗi AI sinh ra:** AI viết nút "Trước/Sau" chỉ gọi `alert()` hoặc `toast()` (phân trang giả), không cắt mảng dữ liệu thực tế. Đồng thời dùng `innerHTML` trực tiếp gây lỗi XSS.
- **Cách sinh viên sửa:** 
  1. Tự viết lại logic dùng `slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)` để phân trang thật.
  2. Thêm hàm `esc()` để escape dữ liệu trước khi render.
  3. Khắc phục triệt để tại file `js/user-transactions.js`.

## 4. Ghi chú về tính năng AI trong SpendWise
Các công cụ AI (ChatGPT, DeepSeek) chỉ dùng lúc code. Ứng dụng SpendWise **không kết nối API AI bên ngoài**. Các tính năng AI-1, AI-2, AI-3 trong app là **mô phỏng bằng JavaScript (rule-based)** nhằm mục đích demo luồng UX.