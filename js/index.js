function CreateNewTodoList() {
    if (document.getElementById('create-todo-list')) {
        return;
    }

    const create_todo_list_div = document.createElement('div');
    const create_todo_list_name = document.createElement('input');
    const create_todo_list_confirm = document.createElement('button');

    create_todo_list_div.classList.add('create-todo');
    create_todo_list_confirm.classList.add('default-btn', 'blue');
    
    create_todo_list_div.id = 'create-todo-list';
    create_todo_list_name.placeholder = 'Enter new list name';
    create_todo_list_confirm.innerText = 'Add List';

    create_todo_list_div.appendChild(create_todo_list_name);
    create_todo_list_div.appendChild(create_todo_list_confirm);
    document.body.appendChild(create_todo_list_div);

    create_todo_list_confirm.addEventListener('click', () => {
        const todo_list_name = create_todo_list_name.value.trim();
        if (todo_list_name) {
            let lists = JSON.parse(localStorage.getItem('USER_LISTS'));

            if (!lists) {
                lists = { "LISTS": { "LIST": {} } };
            }

            if (!lists.LISTS.LIST[todo_list_name]) {
                lists.LISTS.LIST[todo_list_name] = { "Tasks": {} };
                localStorage.setItem('USER_LISTS', JSON.stringify(lists));

                LoadUserTodoLists();
            }

            document.body.removeChild(create_todo_list_div);
        } else {
            alert('List name cannot be empty.');
        }
    });
}


function LoadUserTodoLists() {
    const open_list = document.getElementById('open-lists');
    open_list.innerHTML = '';

    const create_new_list = document.getElementById('create-new-list');

    create_new_list.addEventListener('click', () => {
        CreateNewTodoList();
    })

    if (localStorage.getItem("USER_LISTS")) {
        const users_lists = JSON.parse(localStorage.getItem("USER_LISTS"));

        for (const list_key in users_lists.LISTS.LIST) {
            if (users_lists.LISTS.LIST.hasOwnProperty(list_key)) {
                const list_item = users_lists.LISTS.LIST[list_key];

                const NEW_CARD_DIV = document.createElement('div');
                const NEW_CARD_TITLE = document.createElement('h1');
                const NEW_CARD_BUTTON = document.createElement('button');
                const NEW_CARD_DELETE_BUTTON = document.createElement('button');

                NEW_CARD_DIV.classList.add('card');
                NEW_CARD_BUTTON.classList.add('default-btn');
                NEW_CARD_DELETE_BUTTON.classList.add('default-btn', 'red');
                NEW_CARD_BUTTON.innerText = 'Open';
                NEW_CARD_DELETE_BUTTON.innerText = 'Delete';
                NEW_CARD_TITLE.innerText = list_key;

                NEW_CARD_DIV.appendChild(NEW_CARD_TITLE);
                NEW_CARD_DIV.appendChild(NEW_CARD_BUTTON);
                NEW_CARD_DIV.appendChild(NEW_CARD_DELETE_BUTTON);
                open_list.append(NEW_CARD_DIV);

                NEW_CARD_BUTTON.addEventListener('click', () => {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });

                    OpenUserTodoList(list_key);
                });

                NEW_CARD_DELETE_BUTTON.addEventListener('click', () => {
                    let lists = JSON.parse(localStorage.getItem('USER_LISTS'));

                    if (lists && lists['LISTS'] && lists['LISTS']['LIST'][list_key]) {
                        delete lists['LISTS']['LIST'][list_key];
                        localStorage.setItem('USER_LISTS', JSON.stringify(lists));
                        LoadUserTodoLists(); 
                    } else {
                        console.log(`Todo list '${list_key}' not found in localStorage.`);
                    }
                });
            }
        }
    } else {
        const user_list = {
            "LISTS": {
                "LIST": {
                    "My First Todo List": {
                        "Tasks": {
                            "Check The Complete Button": {
                                "Completed": false
                            },
                            "Create A New Task": {
                                "Completed": false
                            }
                        }
                    }
                }
            }
        };

        localStorage.setItem("USER_LISTS", JSON.stringify(user_list));

        LoadUserTodoLists();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    confetti();
    LoadUserTodoLists();
});