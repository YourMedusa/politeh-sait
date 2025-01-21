// Отправка формы заявки на сервер
document.getElementById("applicationForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const courseSelect = document.getElementById("courseSelect");
        const startDate = document.getElementById("startDate");
        const timeStart = document.getElementById("timeStart");
        const courseDuration = document.getElementById("courseDuration");
        const personsCount = document.getElementById("personsCount");
        const totalPrice = document.getElementById("totalPrice");

        // Проверяем наличие всех обязательных элементов
        if (!courseSelect || !startDate || !timeStart || !courseDuration || !personsCount || !totalPrice) {
            throw new Error("Не все обязательные элементы формы найдены.");
        }

        // Собираем данные из формы
        const requestData = {
            id: 1,
            tutor_id: parseInt(document.getElementById("tutorId")?.value) || 0,
            course_id: parseInt(courseSelect.value),
            date_start: startDate.value,
            time_start: timeStart.value,
            duration: parseInt(courseDuration.value.split(' ')[0]),
            persons: parseInt(personsCount.value),
            price: parseFloat(totalPrice.value.replace(' руб.', '')),
            early_registration: document.getElementById("earlyRegistration")?.checked || false,
            group_enrollment: false,
            intensive_course: document.getElementById("intensiveCourse")?.checked || false,
            supplementary: document.getElementById("supplementary")?.checked || false,
            personalized: document.getElementById("personalized")?.checked || false,
            excursions: document.getElementById("excursions")?.checked || false,
            assessment: document.getElementById("assessment")?.checked || false,
            interactive: document.getElementById("interactive")?.checked || false,
        };
        // Отправляем запрос на сервер
        const response = await fetch(
            "http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders?api_key=c4574f8c-e4ac-48bb-89ef-c2febc3c55dc",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            }
        );

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Ошибка сервера:", errorDetails);
            throw new Error(errorDetails.message || `HTTP ${response.status}`);
        }

        // Уведомление об успешной отправке
        showNotification("Заявка успешно отправлена!", "success");

        // Закрываем модальное окно (если используется)
        const modal = bootstrap.Modal.getInstance(document.getElementById("applyModal"));
        if (modal) modal.hide();

        // Очищаем форму после успешной отправки
        clearForm();
    } catch (error) {
        console.error(error);
        
        // Уведомление об ошибке
        showNotification(`Ошибка при отправке заявки. ${error.message}`, "danger");
    }
});

// Функция для очистки формы
function clearForm() {
    document.getElementById("applicationForm").reset();
}

// Функция для отображения уведомлений
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.role = "alert";
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

    // Добавляем уведомление в body
    document.body.appendChild(notification);

    // Автоматическое скрытие уведомления через 5 секунд
    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("fade");
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Функция для отображения подробной информации о курсе в модальном окне
function showCourseDetails(courseId) {
    const selectedCourse = allCourses.find(course => course.id === courseId);

    const modalContent = `
      <div class="modal-header">
          <h5 class="modal-title">${selectedCourse.name}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
          <p><strong>Описание:</strong> ${selectedCourse.description}</p>
          <p><strong>Преподаватель:</strong> ${selectedCourse.teacher}</p>
          <p><strong>Уровень:</strong> ${selectedCourse.level}</p>
          <p><strong>Длительность:</strong> ${selectedCourse.total_length} недель</p>
          <p><strong>Часы в неделю:</strong> ${selectedCourse.week_length}</p>
          <p><strong>Стоимость за час:</strong> ${selectedCourse.course_fee_per_hour} руб.</p>
          <p><strong>Доступные даты начала:</strong></p>
          <ul>${selectedCourse.start_dates.map(date => `<li>${new Date(date).toLocaleString()}</li>`).join("")}</ul>
      </div>`;
    
      document.querySelector("#courseModal .modal-content").innerHTML = modalContent;

      const modalInstance = new bootstrap.Modal(document.getElementById("courseModal"));
      modalInstance.show();
}


// Функция настройки пагинации
function setupPagination2(data) {
    const paginationContainer = document.getElementById("pagination2");
    
    paginationContainer.innerHTML = ""; // Очищаем старые кнопки

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE2); // Кол-во страниц

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${i === currentPage2 ? "active" : ""}`;
        
        pageItem.innerHTML = `
            <a href="#" class="page-link">${i}</a>
        `;

        pageItem.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage2 = i;
            renderTutors(data, currentPage2); // Переключаем страницу
            setupPagination2(data); // Обновляем активную кнопку
        });

        paginationContainer.appendChild(pageItem);
    }
}



