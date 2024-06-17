function CreateNewTodo() {
    if (document.getElementById('create-todo')) {
        return;
    }

    const create_todo_div = document.createElement('div');
    const create_todo_name = document.createElement('input');
    const create_todo_confirm = document.createElement('button');

    create_todo_div.classList.add('create-todo');
    create_todo_confirm.classList.add('default-btn', 'blue')
    create_todo_div.id = 'create-todo';
    create_todo_name.placeholder = 'Enter new task name';
    create_todo_confirm.innerText = 'Add Task';

    create_todo_div.appendChild(create_todo_name);
    create_todo_div.appendChild(create_todo_confirm);
    document.body.appendChild(create_todo_div);

    create_todo_confirm.addEventListener('click', () => {
        const todo_name = create_todo_name.value.trim();
        if (todo_name) {
            let lists = JSON.parse(localStorage.getItem('USER_LISTS'));
            const todoListName = document.querySelector('#container > h1').innerText;

            if (lists && lists['LISTS'] && lists['LISTS']['LIST'][todoListName]) {
                const todoList = lists['LISTS']['LIST'][todoListName];
                if (!todoList.Tasks) {
                    todoList.Tasks = {};
                }
                todoList.Tasks[todo_name] = { Completed: false };
                localStorage.setItem('USER_LISTS', JSON.stringify(lists));

                OpenUserTodoList(todoListName); 
            }

            document.body.removeChild(create_todo_div);
        } else {
            alert('Task name cannot be empty.');
        }
    });
}

function OpenUserTodoList(todoListName) {
    const container = document.getElementById('container');
    if (container) {
        container.remove();
    }

    const new_container = document.createElement('div');
    new_container.id = 'container';
    new_container.classList.add('container');
    document.body.appendChild(new_container);

    const create_todo_button = document.createElement('button');
    create_todo_button.classList.add('default-btn', 'blue');
    create_todo_button.innerText = 'Create New';
    new_container.appendChild(create_todo_button);

    create_todo_button.addEventListener('click', () => {
        CreateNewTodo()
    });

    const USER_LISTS_DATA = localStorage.getItem("USER_LISTS");

    if (USER_LISTS_DATA) {
        const USER_LISTS = JSON.parse(USER_LISTS_DATA);
        const TODO_LIST_DATA = USER_LISTS.LISTS.LIST[todoListName];

        const list_title = document.createElement('h1');
        list_title.innerText = todoListName;
        new_container.insertBefore(list_title, create_todo_button);

        if (TODO_LIST_DATA && TODO_LIST_DATA.Tasks) {
            const tasks = TODO_LIST_DATA.Tasks;
            const completedTasks = [];

            for (const taskName in tasks) {
                if (tasks.hasOwnProperty(taskName)) {
                    const task = tasks[taskName];

                    const task_div = document.createElement('div');
                    const task_buttons_div = document.createElement('div');
                    const task_name = document.createElement('h3');
                    const task_complete_button = document.createElement('button');
                    const task_delete_button = document.createElement('button');

                    task_div.classList.add('task');
                    task_complete_button.classList.add('default-btn', 'green');
                    task_delete_button.classList.add('default-btn', 'red');
                    task_buttons_div.classList.add('buttons');

                    task_name.innerText = taskName;
                    task_complete_button.innerText = task.Completed ? 'Undo' : 'Complete';
                    task_delete_button.innerText = 'Delete';

                    task_complete_button.setAttribute('data-task-name', taskName);
                    task_delete_button.setAttribute('data-task-name', taskName);

                    task_div.appendChild(task_name);
                    task_div.appendChild(task_buttons_div);
                    task_buttons_div.appendChild(task_complete_button);
                    task_buttons_div.appendChild(task_delete_button);

                    task_div.id = `${taskName}_Completed_${task.Completed}`;

                    if (task.Completed) {
                        task_div.classList.add('completed');
                        completedTasks.push(task_div);
                    }

                    new_container.appendChild(task_div);

                    task_delete_button.addEventListener('click', (event) => {
                        const taskName = event.target.getAttribute('data-task-name');
                        console.log('Task to be deleted:', taskName);

                        let lists = JSON.parse(localStorage.getItem('USER_LISTS'));

                        if (lists) {
                            let todoList = lists['LISTS']['LIST'][todoListName];

                            if (todoList && todoList['Tasks'] && todoList['Tasks'][taskName]) {
                                delete todoList['Tasks'][taskName];
                                console.log('Task deleted:', taskName);
                                console.log('Updated todo list:', todoList);

                                localStorage.setItem('USER_LISTS', JSON.stringify(lists));
                                console.log('Updated lists saved to local storage:', lists);
                            } else {
                                console.log('Task not found in the list:', taskName);
                            }
                        } else {
                            console.log('No lists found in local storage');
                        }

                        task_div.remove();
                    });

                    task_complete_button.addEventListener('click', (event) => {
                        const taskName = event.target.getAttribute('data-task-name');
                        console.log('Task to be completed:', taskName);

                        let lists = JSON.parse(localStorage.getItem('USER_LISTS'));

                        if (lists) {
                            let todoList = lists['LISTS']['LIST'][todoListName];

                            if (todoList && todoList['Tasks'] && todoList['Tasks'][taskName]) {

                                todoList['Tasks'][taskName].Completed = !todoList['Tasks'][taskName].Completed;
                                console.log('Task status updated:', todoList['Tasks'][taskName]);

                                localStorage.setItem('USER_LISTS', JSON.stringify(lists));
                                console.log('Updated lists saved to local storage:', lists);

                                task_complete_button.innerText = todoList['Tasks'][taskName].Completed ? 'Undo' : 'Complete';
                                task_div.classList.toggle('completed', todoList['Tasks'][taskName].Completed);

                                confetti();
                            } else {
                                console.log('Task not found in the list:', taskName);
                            }
                        } else {
                            console.log('No lists found in local storage');
                        }
                    });
                }
            }
        } else {
            console.log(`Todo list '${todoListName}' or its tasks not found.`);
        }
    } else {
        console.log("No USER_LISTS data found in localStorage.");
    }
}
