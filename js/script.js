   // Загрузка задач из localStorage при загрузке страницы
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', function () {
            renderTasks();
        });

      

        // Добавление новой задачи
        function addTask() {
            const input = document.getElementById('taskInput');
            const taskText = input.value.trim();

            if (taskText === '') {
                alert('Пожалуйста, введите задачу!');
                return;
            }

            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };

            tasks.push(task);
            saveTasks();
            renderTasks();
            input.value = '';
            input.focus();
        }

        // Переключение статуса выполнения задачи
        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            }
        }

        // Удаление задачи
        function deleteTask(id) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }

        function editTask(id) {
            console.log('Диагностика: editTask');
            console.log('Диагностика: id', id);
            console.log('Тип id:', typeof id);

            const selector = `[data-task-id="${id}"]`;
            console.log('Диагностика: selector', selector);

            const taskElement = document.querySelector(selector);
            console.log('Диагностика: taskElement', taskElement);

            const allTaskElements = document.querySelectorAll('[data-task-id]');
            console.log('Диагностика: allTaskElements', allTaskElements);

            if (!taskElement) {
                console.error('Элемент не найден');
                return;
            }
            const task = tasks.find(t => t.id === id);
            console.log('Диагностика: task', task);
        
            taskElement.innerHTML = `
            <input type="text" id="edit-${id}" value="${task.text}">
            <button onclick="saveEdit(${id})">Сохранить</button>
            <button onclick="cancelEdit(${id})">Отменить</button>
            `;
        }

        function saveEdit(id) {
            const task = tasks.find(t => t.id === id);
            const input = document.getElementById(`edit-${id}`);
            task.text = input.value.trim();
            saveTasks();
            renderTasks();
        }

        function cancelEdit(id) {
            renderTasks();
        }

        // Сохранение задач в localStorage
        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        function deleteCompleted() {
            tasks = tasks.filter(t => !t.completed)
            saveTasks();
            renderTasks()
        }

        function searchTasks(searchTerm) {
            if (searchTerm === '') {
                renderTasks();
                return;
            }
            
            const fileteredTasks = tasks.filter(task =>
                task.text.toLowerCase().includes(searchTerm.toLowerCase())
            );
            renderTasks(fileteredTasks);
        }

        // Отображение всех задач
        function renderTasks(tasksToRender = tasks) {
            const container = document.getElementById('tasksContainer');

            if (tasksToRender.length === 0) {
                if (tasks.length === 0) {
                     container.innerHTML = '<div class="empty-state">Нет задач. Добавьте первую задачу!</div>';
                } else {
                container.innerHTML = '<div class="empty-state">Задачи не найдены</div>';
                } 
            } else {
                container.innerHTML = tasksToRender.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                    <span class="task-text" ondblclick="editTask(${task.id})">${escapeHtml(task.text)}</span>
                    <button class="delete-button" onclick="deleteTask(${task.id})">Удалить</button>
                </div>
                `).join('');
            }

            updateStats();
        }

        // Обновление статистики
        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;

            document.getElementById('totalTasks').textContent = total;
            document.getElementById('completedTasks').textContent = completed;
        }

        // Экранирование HTML для безопасности
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }