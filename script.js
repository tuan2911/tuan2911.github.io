// Lấy các phần tử HTML cần dùng
const quizTitleEl = document.getElementById('quiz-title');
const quizFormEl = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const resultEl = document.getElementById('result');

let currentQuizData = null; // Biến để lưu dữ liệu quiz sau khi đọc file

// HÀM MỚI: Đọc và chuyển đổi file .txt thành đối tượng quiz
function parseTxtToQuiz(txt) {
    const lines = txt.trim().split('\n');
    const quiz = { title: '', questions: [] };
    let currentQuestion = null;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('TITLE:')) {
            quiz.title = line.replace('TITLE:', '').trim();
        } else if (line.startsWith('Q:')) {
            if (currentQuestion) {
                quiz.questions.push(currentQuestion);
            }
            currentQuestion = {
                question: line.replace('Q:', '').trim(),
                options: [],
                answer: ''
            };
        } else if (line.startsWith('-')) {
            if (currentQuestion) {
                currentQuestion.options.push(line.replace('-', '').trim());
            }
        } else if (line.startsWith('A:')) {
            if (currentQuestion) {
                currentQuestion.answer = line.replace('A:', '').trim();
            }
        }
    });

    if (currentQuestion) {
        quiz.questions.push(currentQuestion);
    }

    return quiz;
}


// HÀM MỚI: Tải dữ liệu từ file .txt và hiển thị
async function loadAndRenderQuiz() {
    // 1. Lấy mã môn học từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('mon');

    if (!subject) {
        quizTitleEl.innerText = "Vui lòng chọn một bài kiểm tra!";
        return;
    }

    try {
        // 2. Tải file .txt tương ứng
        const response = await fetch(`${subject}.txt`);
        if (!response.ok) {
            throw new Error('Không tìm thấy tệp bài kiểm tra.');
        }
        const txtData = await response.text();

        // 3. Chuyển đổi .txt thành đối tượng và lưu lại
        currentQuizData = parseTxtToQuiz(txtData);

        // 4. Hiển thị bài kiểm tra
        document.title = currentQuizData.title;
        quizTitleEl.innerText = currentQuizData.title;

        let quizHTML = '';
        currentQuizData.questions.forEach((q, index) => {
            quizHTML += `<div class="question">`;
            quizHTML += `<p><strong>Câu ${index + 1}:</strong> ${q.question}</p>`;
            q.options.forEach(option => {
                quizHTML += `<label><input type="radio" name="q${index}" value="${option}"> ${option}</label><br>`;
            });
            quizHTML += `</div>`;
        });
        quizFormEl.innerHTML = quizHTML;

    } catch (error) {
        quizTitleEl.innerText = "Lỗi: " + error.message;
        submitBtn.style.display = 'none'; // Ẩn nút nộp bài nếu có lỗi
    }
}


// HÀM XỬ LÝ NỘP BÀI (không thay đổi nhiều)
submitBtn.addEventListener('click', () => {
    if (!currentQuizData) return;

    let score = 0;
    currentQuizData.questions.forEach((q, index) => {
        const userAnswer = quizFormEl.querySelector(`input[name="q${index}"]:checked`);
        if (userAnswer && userAnswer.value === q.answer) {
            score++;
        }
    });

    resultEl.innerHTML = `<h3>Kết quả: Bạn đã trả lời đúng ${score}/${currentQuizData.questions.length} câu!</h3>`;
    resultEl.style.color = score > currentQuizData.questions.length / 2 ? 'green' : 'red';
    
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = 'grey';
});


// Chạy hàm chính để tải và hiển thị bài kiểm tra
loadAndRenderQuiz();
