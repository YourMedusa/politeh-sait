const currentPage = 1;
const ITEMS_PER_PAGE = 3;
let allCourses = [];
let filteredCourses = [];

async function fetchCourses() {
    const apiUrl = "http://cat-facts-api.std-900.ist.mospolytech.ru/api/courses?api_key=b1f19860-58f9-4c45-a7fd-a1554c4f18d9";

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);
        
        allCourses = await response.json();
        console.log("Данные успешно загружены:", allCourses);
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        alert("Не удалось загрузить данные. Попробуйте позже.");
    }
}

document.addEventListener("DOMContentLoaded", fetchCourses);

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCourses();
    filteredCourses = [...allCourses];
    setupPagination(filteredCourses);
    renderCourses(filteredCourses, currentPage); 
});

function renderCourses(courses, page) {
    const coursesContainer = document.querySelector("#courses.row");
    coursesContainer.innerHTML = "";

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const coursesToRender = courses.slice(startIndex, endIndex);

    coursesToRender.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.className = "col-md-4 mb-3";

        courseCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p><strong>Уровень:</strong> ${course.level}</p>
                    <button class="btn btn-primary" data-id="${course.id}">Подробнее</button>
                </div>
            </div>
        `;

        coursesContainer.appendChild(courseCard);
    });
}

function showCourseDetails(courseId) {
    const selectedCourse = allCourses.find(course => course.id === courseId);

    if (!selectedCourse) {
        alert("Курс не найден!");
        return;
    }

    document.getElementById("courseName").value = selectedCourse.name;
    document.getElementById("teacherName").value = selectedCourse.teacher;
    document.getElementById("courseDuration").value = `${selectedCourse.total_length} недель`;

    const startDateSelect = document.getElementById("startDate");
    startDateSelect.innerHTML = selectedCourse.start_dates.map(date => 
        `<option value="${date}">${new Date(date).toLocaleDateString()}</option>`
    ).join("");

    const modalInstance = new bootstrap.Modal(document.getElementById("applyModal"));
    modalInstance.show();
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCourses();

    const courseSelect = document.getElementById("courseSelect");
    courseSelect.innerHTML = "";

    allCourses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });

    courseSelect.addEventListener("change", updateCourseDetails);
});

function updateCourseDetails() {
    const selectedCourseId = parseInt(document.getElementById("courseSelect").value);
    const selectedCourse = allCourses.find(course => course.id === selectedCourseId);

    if (selectedCourse) {
        document.getElementById("courseName").value = selectedCourse.name;
        document.getElementById("teacherName").value = selectedCourse.teacher;
        document.getElementById("courseDuration").value = `${selectedCourse.total_length} недель`;

        const startDateSelect = document.getElementById("startDate");
        startDateSelect.innerHTML = ""; 
        selectedCourse.start_dates.forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = new Date(date).toLocaleDateString();
            startDateSelect.appendChild(option);
        });

        const personsCount = parseInt(document.getElementById("personsCount").value) || 1;
        document.getElementById("totalPrice").value = `${calculateTotalPrice(selectedCourse, personsCount)} руб.`;
    }
}

function calculateTotalPrice(course, persons) {
    if (!course) return 0;

    const durationWeeks = course.total_length;
    const pricePerHour = course.course_fee_per_hour;
    let basePrice = durationWeeks * course.week_length * pricePerHour * persons;

    const personalizedCheckbox = document.getElementById("personalized");
    if (personalizedCheckbox?.checked) {
        basePrice += 200 * durationWeeks;
    }

    const interactiveCheckbox = document.getElementById("interactive");
    if (interactiveCheckbox?.checked) {
        basePrice *= 2;
    }

    return Math.round(basePrice); 
}

function clearForm() {
    document.getElementById("applicationForm").reset();
}

function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.role = "alert";
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 5000);
}

function showCourseDetails(courseId) {
    const selectedCourse = allCourses.find(course => course.id === courseId);

    if (!selectedCourse) {
        alert("Курс не найден!");
        return;
    }

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
    
    document.querySelector("#courseModal.modal-content").innerHTML = modalContent;

    const modalInstance = new bootstrap.Modal(document.getElementById("courseModal"));
    modalInstance.show();
}

const ITEMS_PER_PAGE2 = 3;
let currentPage2 = 1;
let allTutors = [];

document.addEventListener("DOMContentLoaded", async () => {
    await fetchTutors();
    setupPagination2(allTutors);
    renderTutors(allTutors, currentPage2); 
});

async function fetchTutors() {
    const apiUrl = "http://cat-facts-api.std-900.ist.mospolytech.ru/api/tutors?api_key=a2973cdd-d303-48f2-a6b6-78ff07878f95";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);
        
        allTutors = await response.json();
        console.log("Данные успешно загружены:", allTutors);
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        alert("Не удалось загрузить данные. Попробуйте позже.");
    }
}

document.getElementById("qualification-filter").addEventListener("change", filterTutorsByLevel);
function filterTutorsByLevel(level) {
    if (level === "allTutors") {
        filteredTutors = [...allTutors];
        function filterTutorsByLevel(level) {
            if (level === "allTutors") {
                filteredTutors = [...allTutors];
            } else {
                const selectedLevel = parseInt(level);
                filteredTutors = allTutors.filter(tutor => tutor.level === selectedLevel);
            }
        }
        
        function setupPagination2(courses) {
            const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE2);
            currentPage2 = Math.min(currentPage2, totalPages);
        
            const paginationContainer = document.querySelector("#pagination");
            paginationContainer.innerHTML = "";
        
            if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                    const button = document.createElement("button");
                    button.textContent = i;
                    button.className = `btn btn-outline-secondary me-1 ${i === currentPage2 ? 'active' : ''}`;
                    button.addEventListener("click", () => renderTutors(courses, i));
                    paginationContainer.appendChild(button);
                }
            } else {
                const button = document.createElement("button");
                button.textContent = 1;
                button.className = "btn btn-outline-secondary";
                paginationContainer.appendChild(button);
            }
        }
        
        function renderTutors(tutors, page) {
            const tutorsContainer = document.querySelector("#tutors.row");
            tutorsContainer.innerHTML = "";
        
            const startIndex = (page - 1) * ITEMS_PER_PAGE2;
            const endIndex = startIndex + ITEMS_PER_PAGE2;
        
            const tutorsToRender = tutors.slice(startIndex, endIndex);
        
            tutorsToRender.forEach(tutor => {
                const tutorCard = document.createElement("div");
                tutorCard.className = "col-md-4 mb-3";
        
                tutorCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${tutor.name}</h5>
                            <p><strong>Уровень:</strong> ${tutor.level}</p>
                            <button class="btn btn-primary" data-id="${tutor.id}">Подробнее</button>
                        </div>
                    </div>
                `;
        
                tutorsContainer.appendChild(tutorCard);
            });
        }
    }
}
        