const mockapi = 'https://6839dba56561b8d882b1f55e.mockapi.io/questions';

const maxScore = 20;
let questions = [];

function getCorrectAnswerIdx(question) {
    for (let i = 1; i <= 4; i++) {
        if (question["right" + i]) return i;
    }
    return null;
}

function renderAllQuestions() {
    const quizDiv = document.getElementById('quiz');
    quizDiv.innerHTML = questions.map((q, idx) => `
        <div class="question-block">
          <p><b>${idx + 1}. ${q.question}</b></p>
          <div class="answers">
            <label><input type="radio" name="answer${idx}" value="1" required> ${q.answer1}</label>
            <br>
            <label><input type="radio" name="answer${idx}" value="2"> ${q.answer2}</label>
            <br>
            <label><input type="radio" name="answer${idx}" value="3"> ${q.answer3}</label>
            <br>
            <label><input type="radio" name="answer${idx}" value="4"> ${q.answer4}</label>
          </div>
        </div>
      `).join('');
}

function calcGrade(percentage) {
    if (percentage >= 90) return 5;
    if (percentage >= 75) return 4;
    if (percentage >= 60) return 3;
    if (percentage >= 40) return 2;
    return 1;
}

document.getElementById('quizForm').onsubmit = function (e) {
    e.preventDefault();
    let score = 0;
    let wrongAnswers = [];
    for (let i = 0; i < questions.length; i++) {
        const selected = document.querySelector(`input[name="answer${i}"]:checked`);
        if (selected) {
            if (parseInt(selected.value, 10) === getCorrectAnswerIdx(questions[i])) {
                score++;
            } else {
                wrongAnswers.push({
                    number: i + 1,
                    answer: questions[i][`answer${selected.value}`]
                });
            }
        }
    }
    const percent = Math.round((score / maxScore) * 100);
    const grade = calcGrade(percent);

    let wrongListHtml = '';
    if (wrongAnswers.length > 0) {
        wrongListHtml =
            '<div class="wrong-list"><div><span>Неправильные ответы:</span></div><ul>' +
            wrongAnswers.map(item =>
                `<li>${item.number} — ${item.answer}</li>`
            ).join('') +
            '</ul></div>';
    } else {
        wrongListHtml = '<div class="wrong-list"><span>Все ответы верные!</span></div>';
    }

    document.getElementById('result').innerHTML = `
        <br>
        <span class="score">Ваши баллы: ${score} из ${maxScore}</span><br>
        <span>Процент: ${percent}%</span><br>
        <span>Оценка: ${grade}</span>
        ${wrongListHtml}
      `;
    document.getElementById('result').scrollIntoView({ behavior: "smooth" });
};

fetch(mockapi)
    .then(res => res.json())
    .then(data => {
        questions = data.slice(0, maxScore);
        renderAllQuestions();
    })
    .catch(() => {
        document.getElementById('quiz').innerHTML = 'Ошибка загрузки вопросов!';
        document.getElementById('submitBtn').disabled = true;
    });