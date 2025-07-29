// --- PHẦN CÀI ĐẶT GOOGLE FORM (Giữ nguyên) ---
const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfNn5BF8oejY9kTGkoTLIO0BzhF99R9fURFA6avaASmXPw32w/formResponse';
const NAME_ENTRY_ID = 'entry.1858710141';
const QUIZ_NAME_ENTRY_ID = 'entry.1565538368'; // <-- Thay bằng mã Entry ID của bạn
const SCORE_ENTRY_ID = 'entry.1307362548';
// --- KẾT THÚC PHẦN CÀI ĐẶT ---


/**
 * HÀM XÁO TRỘN MẢNG (Fisher-Yates shuffle)
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


/**
 * Hàm phân tích nội dung từ file .txt thành đối tượng quiz - ĐÃ CẬP NHẬT
 */
function parseQuizTxt(txt) {
    const lines = txt.trim().split('\n');
    const quiz = { title: '', id: '', questions: [] };
    let currentQuestion = null;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('TITLE:')) {
            quiz.title = line.replace('TITLE:', '').trim();
        } else if (line.startsWith('ID:')) {
            quiz.id = line.replace('ID:', '').trim();
        } else if (line.startsWith('Q:')) {
            if (currentQuestion) quiz.questions.push(currentQuestion);
            currentQuestion = {
                text: line.replace('Q:', '').trim(),
                originalIndex: quiz.questions.length,
                options: [], // Mảng chứa các lựa chọn
                answer: '',  // Text của đáp án đúng
                explanation: ''
            };
        } else if (line.startsWith('O:')) {
            // Đây là một đáp án SAI
            currentQuestion.options.push(line.replace('O:', '').trim());
        } else if (line.startsWith('A:')) {
            // Đây là đáp án ĐÚNG
            const correctAnswerText = line.replace('A:', '').trim();
            currentQuestion.options.push(correctAnswerText);
            currentQuestion.answer = correctAnswerText; // Lưu lại text của đáp án đúng
        } else if (line.startsWith('E:')) {
            currentQuestion.explanation = line.replace('E:', '').trim();
        }
    });

    if (currentQuestion) quiz.questions.push(currentQuestion);
    return quiz;
}


/**
 * Hàm tải dữ liệu bài thi từ một file .txt
 */
async function fetchQuizData(examId) {
    try {
        const response = await fetch(`data/${examId}.txt`);
        if (!response.ok) throw new Error('Không tìm thấy tệp bài kiểm tra.');
        const txtData = await response.text();
        return parseQuizTxt(txtData);
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        return null;
    }
}


/**
 * Logic cho trang làm bài thi (quiz.html) - ĐÃ CẬP NHẬT
 */
async function handleQuizPage() {
    const quizTitleEl = document.getElementById('quiz-title');
    const quizFormEl = document.getElementById('quiz-form');

    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('exam');

    if (!examId) {
        quizTitleEl.textContent = "Không có bài kiểm tra nào được chọn.";
        return;
    }

    const quizData = await fetchQuizData(examId);

    if (!quizData) {
        quizTitleEl.textContent = "Lỗi tải bài kiểm tra.";
        return;
    }

    // Xáo trộn câu hỏi và các lựa chọn
    shuffleArray(quizData.questions);
    quizData.questions.forEach(q => shuffleArray(q.options));

    document.title = quizData.title;
    quizTitleEl.textContent = quizData.title;

    let questionsHTML = '';
    quizData.questions.forEach((q, index) => {
        const questionId = `q${q.originalIndex}`;
        questionsHTML += `<div class="question" data-question-id="${questionId}">`;
        questionsHTML += `<p><strong>Câu ${index + 1}:</strong> ${q.text}</p>`;
        
        q.options.forEach((optionText, optionIdx) => {
            const optionLetter = String.fromCharCode(65 + optionIdx);
            // Giá trị của radio button là nội dung của lựa chọn
            questionsHTML += `<label><input type="radio" name="${questionId}" value="${optionText}"> ${optionLetter}. ${optionText}</label><br>`;
        });
        questionsHTML += `</div>`;
    });
    quizFormEl.querySelector('#submit-btn').insertAdjacentHTML('beforebegin', questionsHTML);

    if (window.MathJax && window.MathJax.startup) {
        MathJax.startup.promise.then(() => {
            MathJax.typesetPromise();
        });
    }

    quizFormEl.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const studentName = document.getElementById('student-name').value;
        if (!studentName) {
            alert('Vui lòng nhập đầy đủ Họ và tên!');
            return;
        }
        const userAnswers = new FormData(quizFormEl);
        const answersObject = Object.fromEntries(userAnswers.entries());
        
        const submissionData = {
            quizId: quizData.id,
            title: quizData.title,
            name: studentName,
            answers: answersObject
        };

        localStorage.setItem('submissionData', JSON.stringify(submissionData));
        window.location.href = 'ket-qua.html';
    });
}


/**
 * Logic cho trang xem kết quả (ket-qua.html) - ĐÃ CẬP NHẬT
 */
async function handleResultPage() {
    const resultEl = document.getElementById('result');
    const reviewContentEl = document.getElementById('review-content');

    const savedData = JSON.parse(localStorage.getItem('submissionData'));
    if (!savedData) {
        resultEl.innerHTML = '<h3>Không tìm thấy dữ liệu bài làm.</h3>';
        return;
    }

    const quizData = await fetchQuizData(savedData.quizId);
    if (!quizData) {
        resultEl.innerHTML = '<h3>Lỗi tải dữ liệu bài kiểm tra để chấm.</h3>';
        return;
    }

    let score = 0;
    let reviewHTML = '';
    const { name, title, answers: userAnswers } = savedData;

    quizData.questions.forEach((q, index) => {
        const questionId = `q${q.originalIndex}`; 
        const userAnswerText = userAnswers[questionId];
        const correctAnswerText = q.answer;

        reviewHTML += `<div class="review-item"><p><strong>Câu hỏi gốc ${index + 1}:</strong> ${q.text}</p>`;

        if (userAnswerText) {
            reviewHTML += `<p><strong>Bạn chọn:</strong> ${userAnswerText}</p>`;
            
            if (userAnswerText === correctAnswerText) {
                score++;
                reviewHTML += `<p class="review-correct">✅ Chính xác</p>`;
            } else {
                reviewHTML += `<p class="review-incorrect">❌ Sai rồi</p>`;
                reviewHTML += `<p class="review-correct-answer"><strong>Đáp án đúng:</strong> ${correctAnswerText}</p>`;
            }
        } else {
            reviewHTML += `<p><strong>Bạn chưa trả lời.</strong></p>`;
            reviewHTML += `<p class="review-correct-answer"><strong>Đáp án đúng:</strong> ${correctAnswerText}</p>`;
        }
        reviewHTML += `<div class="explanation"><strong>Giải thích:</strong> ${q.explanation}</div></div>`;
    });

    const totalQuestions = quizData.questions.length;
    const scoreText = `${score}/${totalQuestions}`;
    resultEl.innerHTML = `<h3>Kết quả của ${name}: ${scoreText} câu đúng!</h3>`;
    reviewContentEl.innerHTML = reviewHTML;
    
    if (window.MathJax && window.MathJax.startup) {
        MathJax.startup.promise.then(() => {
            MathJax.typesetPromise();
        });
    }
    
    submitToGoogleForms(name, title, scoreText);
    localStorage.removeItem('submissionData');
}


// Hàm gửi Google Form (không đổi)
async function submitToGoogleForms(name, quizName, score) {
    const formData = new URLSearchParams();
    formData.append(NAME_ENTRY_ID, name);
    formData.append(QUIZ_NAME_ENTRY_ID, quizName);
    formData.append(SCORE_ENTRY_ID, score);
    try {
        await fetch(GOOGLE_FORM_ACTION_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
    } catch (error) { console.error('Lỗi khi gửi đến Google Forms:', error); }
}


// Chạy logic tương ứng cho từng trang
if (document.getElementById('quiz-form')) {
    handleQuizPage();
} else if (document.getElementById('review-content')) {
    handleResultPage();
}