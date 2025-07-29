# Hướng dẫn tạo bài kiểm tra mới

Dự án này sử dụng một hệ thống linh hoạt để tạo bài kiểm tra mới một cách nhanh chóng bằng cách soạn thảo các tệp văn bản đơn giản (`.txt`).

## Quy trình tạo bài kiểm tra mới

Để thêm một bài kiểm tra mới, bạn chỉ cần thực hiện 2 bước đơn giản:
1.  Tạo một tệp `.txt` mới chứa nội dung bài kiểm tra trong thư mục `data/`.
2.  Thêm một liên kết đến bài kiểm tra đó trong tệp `index.html`.

---
### Bước 1: Tạo tệp dữ liệu `.txt`

1.  Trong thư mục `data/`, tạo một tệp mới có đuôi `.txt`. Tên tệp nên viết liền không dấu, ví dụ: `hinh-hoc-chuong-1.txt`.
2.  Mở tệp đó ra và soạn nội dung theo đúng định dạng dưới đây.

**Định dạng chuẩn:**
```txt
TITLE: [Tiêu đề sẽ hiển thị trên cùng của bài kiểm tra]
ID: [mã_định_danh_duy_nhất_không_dấu]

Q: [Nội dung câu hỏi số 1]
O: [Nội dung lựa chọn SAI 1]
O: [Nội dung lựa chọn SAI 2]
A: [Nội dung lựa chọn ĐÚNG]
E: [Nội dung giải thích cho câu hỏi]

Q: [Nội dung câu hỏi số 2]
O: [Nội dung lựa chọn SAI 1]
A: [Nội dung lựa chọn ĐÚNG]
O: [Nội dung lựa chọn SAI 2]
E: [Nội dung giải thích cho câu hỏi]
```

**Ví dụ thực tế (tệp `hinh-hoc-chuong-1.txt`):**
```txt
TITLE: Kiểm tra Hình học Chương 1
ID: hinh-hoc-chuong-1

Q: Tổng số đo ba góc trong một tam giác là bao nhiêu?
O: 90 độ
A: 180 độ
O: 360 độ
E: Theo định lý tổng ba góc, tổng số đo của ba góc trong một tam giác phẳng luôn bằng 180 độ.

Q: Hình nào sau đây không phải là tứ giác?
A: Hình tam giác
O: Hình vuông
O: Hình chữ nhật
E: Tứ giác là một đa giác có 4 cạnh. Hình tam giác chỉ có 3 cạnh.
```

---
### Bước 2: Thêm liên kết vào trang chủ (`index.html`)

1.  Mở tệp `index.html`.
2.  Tìm đến thẻ `<main class="test-selection">`.
3.  Sao chép một khối `<a href="..." class="test-card">...</a>` có sẵn và chỉnh sửa lại.

**Quan trọng:**
* Phần `href` phải trỏ đến `quiz.html?exam=` và theo sau là **mã ID** bạn đã đặt trong tệp `.txt`.
* Sửa lại `h2` để hiển thị đúng tên bài kiểm tra trên nút bấm.

**Ví dụ thêm bài "Kiểm tra Hình học Chương 1":**
```html
<main class="test-selection">
    <a href="quiz.html?exam=menhde" class="test-card">
        <div class="test-details">
            <h2 class="test-title">Bài ôn tập mệnh đề</h2>
        </div>
    </a>
    
    <a href="quiz.html?exam=hinh-hoc-chuong-1" class="test-card">
         <div class="test-details">
            <h2 class="test-title">Kiểm tra Hình học Chương 1</h2>
        </div>
    </a>
    </main>
```
Sau khi hoàn thành hai bước trên và tải các tệp đã thay đổi lên GitHub, bài kiểm tra mới sẽ xuất hiện trên trang chủ và sẵn sàng để sử dụng.