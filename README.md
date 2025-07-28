# Tạo bài kiểm tra mới
- Mỗi bài là một file html
    - Ví dụ: kiem-tra-toan.html, kiem-tra-van.html
- Mỗi bài sẽ có một **<u>data-quiz-id</u>** riêng do người tạo đặt
    - Ví dụ: kiem-tra-toan.html có thể có **<u>data-quiz-id</u>** là **'toan'**
    ```html
    <form id="quiz-form" data-quiz-id="toan">
        ...
    </form>
    ```
*Lấy ví dụ là đang tạo bài kiểm tra toán*
- Chúng ta sẽ có một file **kiem-tra-toan.html** chứa câu hỏi và file **ket-qua.html** chưa toàn bộ đáp án của các bài kiểm tra trên web.
- quiz id của bài kiểm tra và quiz id trong file kết quả phải **<u>trùng nhau</u>**.
- Dưới đây là mẫu để tạo một bài kiểm tra:
```html
<div class="question" data-question-id="q1"><p><strong>Câu 1:</strong> Câu hỏi</p><label><input type="radio" name="q1" value="a"> A. </label><br><label><input type="radio" name="q1" value="b"> B. /label><br><label><input type="radio" name="q1" value="c"> C. </label><br></div>
```
