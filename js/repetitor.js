//РЕПЕТИТОРЫ

const ITEMS_PER_PAGE2 = 3; // Количество репетиторов на одной странице
let currentPage2 = 1; // Текущая страница
let allTutors = []; // Все репетиторы (загружаются из API)

// Загрузка данных при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
    await fetchTutors(); // Загружаем данные о репетиторах из API
    setupPagination2(allTutors); // Настраиваем пагинацию
    renderTutors(allTutors, currentPage2); // Отображаем первую страницу репетиторов
});

// Функция для получения данных о репетиторах через API
async function fetchTutors() {
    const apiUrl = "http://cat-facts-api.std-900.ist.mospolytech.ru/api/tutors?api_key=c4574f8c-e4ac-48bb-89ef-c2febc3c55dc";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        allTutors = await response.json(); // Сохраняем всех репетиторов в переменную
        console.log("Данные о репетиторах успешно загружены:", allTutors);
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        alert("Не удалось загрузить данные.");
    }
}

// Обработчик изменения уровня в выпадающем списке
document.getElementById("qualification-filter").addEventListener("change", (event) => {
    const selectedLevel = event.target.value;
    filterTutorsByLevel(selectedLevel); // Фильтруем и обновляем отображение курсов
});

// Функция для фильтрации  по уровню
function filterTutorsByLevel(level) {
    // Проверяем выбранный уровень
    if (level === "allTutors") {
        filteredTutors = [...allTutors]; // Если выбран "Все курсы", копируем все курсы
    } else {
        filteredTutors = allTutors.filter(tutors => tutors.language_level === level); // Фильтруем по уровню
    }

    currentPage2 = 1; // Сбрасываем на первую страницу после фильтрации
    setupPagination2(filteredTutors); // Настраиваем пагинацию для отфильтрованных данных
    renderTutors(filteredTutors, currentPage2); // Отображаем первую страницу отфильтрованных данных
}

// Обработчик изменения минимального опыта
document.getElementById("experience-filter").addEventListener("input", (event) => {
    const minExperience = parseInt(event.target.value);
    filterTutorsByExperience(minExperience); // Фильтруем и обновляем отображение репетиторов
});


// Функция для фильтрации репетиторов по минимальному опыту
function filterTutorsByExperience(minExperience) {
    if (isNaN(minExperience) || minExperience <= 0) {
        filteredTutors = [...allTutors]; // Если значение не указано или некорректно, показываем всех репетиторов
    } else {
        filteredTutors = allTutors.filter(tutor => tutor.work_experience >= minExperience); // Фильтруем по опыту
    }

    currentPage2 = 1; // Сбрасываем на первую страницу после фильтрации
    setupPagination2(filteredTutors); // Настраиваем пагинацию для отфильтрованных данных
    renderTutors(filteredTutors, currentPage2); // Отображаем первую страницу отфильтрованных данных
}

// Функция для отображения списка репетиторов на текущей странице
// Функция для отображения списка репетиторов на текущей странице
function renderTutors(tutors, page) {
    const tutorContainer = document.getElementById("tutor-container");

    // Очищаем контейнер перед добавлением новых данных
    tutorContainer.innerHTML = "";

    // Рассчитываем индекс начала и конца текущей страницы
    const startIndex = (page - 1) * ITEMS_PER_PAGE2;
    const endIndex = startIndex + ITEMS_PER_PAGE2;

    // Получаем данные для текущей страницы
    const tutorsToRender = tutors.slice(startIndex, endIndex);

    // Создаем карточки для каждого репетитора
    tutorsToRender.forEach(tutor => {
        const tutorCard = document.createElement("div");
        tutorCard.className = "col-md-4"; // Используем сетку Bootstrap

        tutorCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${tutor.name}</h5>
                    <p><strong>Опыт:</strong> ${tutor.work_experience} лет</p>
                    <p><strong>Языки, которые знает:</strong> ${tutor.languages_spoken.join(", ")}</p>
                    <p><strong>Языки, которые преподаёт:</strong> ${tutor.languages_offered.join(", ")}</p>
                    <p><strong>Уровень:</strong> ${tutor.language_level}</p>
                    <p><strong>Цена за час:</strong> ${tutor.price_per_hour} руб.</p>
                    <button class="button" data-bs-toggle="modal" data-bs-target="#bookingModal" 
                        onclick="openBookingForm('${tutor.name}', ${tutor.price_per_hour})">
                        Записаться на занятие
                    </button>
                </div>
            </div>
        `;

        tutorContainer.appendChild(tutorCard);
    });
}

// Функция для открытия модального окна с формой записи
function openBookingForm(tutorName, pricePerHour) {
    // Устанавливаем значения в форму
    document.getElementById("bookingTutorName").value = tutorName;
    document.getElementById("bookingPrice").value = `${pricePerHour} руб.`;
    
}

// Функция для отправки данных формы записи
async function submitBookingForm(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Собираем данные из формы
    const formData = {
        //id: 1, // Уникальный идентификатор заявки (если сервер ожидает его)
        tutor_id:  1,
        course_id: 7, 
        student_id:4,
        date_start: document.getElementById("bookingDate")?.value || "2025-02-15",
        time_start: document.getElementById("bookingTime")?.value || "16:08:00",
        duration:  6,
        persons: 1, 
        price: parseFloat(document.getElementById("bookingPrice")?.value.replace(" руб.", "")) || 0,
        early_registration: false,
        early_registration: false, 
        supplementary: false,
        personalized: false,
        excursions: false,
        assessment: false,
        group_enrollment: false,
        interactive: false,
        intensive_course: false
    };

    // Проверяем обязательные поля перед отправкой
    if (!formData.tutor_id || !formData.date_start || !formData.time_start || formData.price < 0) {
        alert("Пожалуйста, заполните все обязательные поля!");
        return;
    }

    try {
        // Отправляем данные на сервер
        const response = await fetch(
            "http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders?api_key=c4574f8c-e4ac-48bb-89ef-c2febc3c55dc",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            }
        );

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Ошибка сервера:", errorDetails);
            throw new Error(`Ошибка ${response.status}: ${errorDetails.message}`);
        }

        // Успешное сообщение
        alert("Вы успешно записались на занятие!");

        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById("bookingModal"));
        if (modal) modal.hide();

        // Сбрасываем форму
        document.getElementById("bookingForm").reset();
    } catch (error) {
        console.error(error);
        alert(`Произошла ошибка при записи. ${error.message}`);
    }
}

function showNotification(message, type = "success") {
    const notificationContainer = document.getElementById("notifications");

    // Создаём элемент уведомления
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.role = "alert";
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Добавляем уведомление в контейнер
    notificationContainer.appendChild(notification);

    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);
}