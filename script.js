/* =========================================
   1. ФЛЕШ-КАРТОЧКИ (Flashcards)
   ========================================= */

/**
 * Переворачивает карточку, добавляя/удаляя класс 'flipped'
 * @param {HTMLElement} card - Элемент карточки
 */
function flipCard(card) {
    card.classList.toggle('flipped');
}

/* =========================================
   2. УПРАЖНЕНИЯ: ТЕКСТОВЫЙ ВВОД (Text Input)
   ========================================= */

/**
 * Проверяет ответ пользователя в текстовом упражнении
 * Ответы читаются из data-attributes родительского элемента
 * @param {HTMLElement} button - Кнопка проверки
 */
function checkTextAnswer(button) {
    const exerciseItem = button.closest('.exercise-item');
    if (!exerciseItem) return;

    const input = exerciseItem.querySelector('.answer-input');
    const showAnswerBtn = exerciseItem.querySelector('.show-answer-btn');
    const correctAnswerDiv = exerciseItem.querySelector('.correct-answer');
    
    // Получаем правильные ответы из атрибута data-answers (JSON массив)
    const answersData = exerciseItem.getAttribute('data-answers');
    const correctAnswers = answersData ? JSON.parse(answersData) : [];
    
    const userAnswer = input.value.trim().toLowerCase();
    const isCorrect = correctAnswers.some(answer => answer.toLowerCase() === userAnswer);

    if (isCorrect) {
        input.classList.remove('incorrect');
        input.classList.add('correct');
        if (showAnswerBtn) showAnswerBtn.classList.remove('visible');
        if (correctAnswerDiv) correctAnswerDiv.classList.remove('visible');

        // Анимация успеха кнопки
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    } else {
        input.classList.remove('correct');
        input.classList.add('incorrect');
        if (showAnswerBtn) showAnswerBtn.classList.add('visible');
    }
}

/**
 * Показывает правильный ответ в текстовом упражнении
 * @param {HTMLElement} button - Кнопка показа ответа
 */
function showCorrectAnswer(button) {
    const exerciseItem = button.closest('.exercise-item');
    if (!exerciseItem) return;
    
    const correctAnswerDiv = exerciseItem.querySelector('.correct-answer');
    if (correctAnswerDiv) {
        correctAnswerDiv.classList.toggle('visible');
    }
}

/* =========================================
   3. УПРАЖНЕНИЯ: МНОЖЕСТВЕННЫЙ ВЫБОР (Multiple Choice)
   ========================================= */

/**
 * Выбирает вариант ответа в упражнении
 * @param {HTMLElement} option - Выбранный вариант
 */
function selectOption(option) {
    const container = option.closest('.multiple-choice-options');
    if (!container) return;

    const allOptions = container.querySelectorAll('.choice-option');
    
    // Сброс всех выделений
    allOptions.forEach(opt => {
        opt.classList.remove('selected');
        opt.classList.remove('correct');
        opt.classList.remove('incorrect');
    });

    option.classList.add('selected');

    // Скрытие текста объяснения при новом выборе
    const exerciseItem = container.closest('.exercise-item');
    if (exerciseItem) {
        const explanationText = exerciseItem.querySelector('.explanation-text');
        if (explanationText) {
            explanationText.classList.remove('visible');
        }
    }
}

/**
 * Валидирует выбранный вариант ответа
 * @param {HTMLElement} button - Кнопка проверки
 */
function validateMultipleChoice(button) {
    const exerciseItem = button.closest('.exercise-item');
    if (!exerciseItem) return;

    const selectedOption = exerciseItem.querySelector('.choice-option.selected');
    const explanationText = exerciseItem.querySelector('.explanation-text');

    if (!selectedOption) {
        // Анимация тряски, если ничего не выбрано
        button.style.animation = 'shake 0.5s';
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
        return;
    }

    const isCorrect = selectedOption.getAttribute('data-correct') === 'true';

    if (isCorrect) {
        selectedOption.classList.remove('incorrect');
        selectedOption.classList.add('correct');
    } else {
        selectedOption.classList.remove('correct');
        selectedOption.classList.add('incorrect');
    }

    // Показ объяснения
    if (explanationText) {
        const explanation = selectedOption.getAttribute('data-explanation');
        if (explanation) {
            explanationText.textContent = explanation;
            explanationText.classList.add('visible');
        }
    }
}

/* =========================================
   4. МОДАЛЬНОЕ ОКНО (Donate Modal)
   ========================================= */

/**
 * Открывает модальное окно поддержки
 */
function showDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Закрывает модальное окно поддержки
 */
function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Обрабатывает выбор суммы пожертвования
 * @param {string} amount - Выбранная сумма
 */
function selectDonate(amount) {
    alert(`Thank you! You selected ${amount}.`);
    closeDonateModal();
}

/* =========================================
   5. ГЛОБАЛЬНЫЕ СОБЫТИЯ (Global Events)
   ========================================= */

// Закрытие модального окна по клавише Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDonateModal();
    }
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Скрытие/показ шапки при скролле
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (header) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
    }
    lastScrollY = currentScrollY;
});
