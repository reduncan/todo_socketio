const socket = io();

$(function () {
    const state = {
        toDoList: [],
    };

    $('#submit').on('click', function (event) {
        event.preventDefault();
        console.log('Submit works');

        const newTodo = {
            todoItem: $('#todo-input').val().trim(),
            todoStatus: false
        };

        if (newTodo.todoItem === '') {
            alert('Todo Item Required');
        }

        $.ajax({
            url: "/api/todo",
            method: "POST",
            data: newTodo
        })
            .then(function (data) {
                socket.emit('new-todo', data);
                console.log(data, "This should be the updated list");
                // Clear the form when submitting
                // getAllItems()
                $('#todo-input').val('');
                $('#todo-input').focus();
            })
    });
});

socket.on('emit-todo', function (data) {
    console.log(data, "This is the new todo that is being emitted from the backend")
    populateList(data);
});

//far fa-times-circle / circle with x for completed
//far fa-circle / empty circle not complete
function populateList(data) {
    // event.preventDefault();
    // $('#addTasks').empty();
    // data.forEach((data) => {
    const listTag = $('<li>');
    const textDiv = $('<div>');

    const button = $('<i class="far fa-circle">');
    //x for delete
    button.attr('data-status', data.todoStatus);

    listTag.append()
    listTag.append(button);
    addUpdateListener(button);

    listTag.append(textDiv);
    // listTag.append(button);

    textDiv.addClass('textDiv');
    textDiv.text(data.todoItem);

    button.addClass('delete');
    button.attr('data-id', data._id);

    $('#addTasks').append(listTag);
};
// addDeleteListener();

//far fa-times-circle / circle with x for completed
//far fa-circle / empty circle not complete
function toggleCheckbox(element) {
    console.log('icon toggle function working')
    if ($(element).hasClass('far fa-circle')) { // not completed box
        $(element).removeClass('far fa-circle');//not completed box
        $(element).addClass('far fa-times-circle');//checked completed
    }
}
function addUpdateListener(element) {
    $(element).on('click', function () {
        let id = $(this).attr('data-id');
        let status = $(this).attr('data-status');

        if (status === "false") {
            status = true;
        } else {
            status = false;
        }

        const updateTask =
        {
            id: id,
            todoStatus: status
        }

        $.post(`/api/todo/${id}`, updateTask)
        .then(function (data) {
            socket.emit('update-todo', data);
        });

        toggleCheckbox(this);
    })
}

// function addUpdateListener(element) {
//     $(element).on('click', function () {
        
//         let id = $(this).attr('data-id');
//         if ($(this).attr('data-status') === 'false') {
//             $.ajax({
//                 url: `/api/todo/${id}`,
//                 type: 'PUT',
//                 data: {
//                     _id: id,
//                     todoStatus: true
//                 }
//             })
//                 .then(function (data) {
//                     socket.emit('update-todo', data)
//                     button.attr('data-status', data.todoStatus)
//                 });
    //     } else {
    //         $.ajax({
    //             url: `/api/todo/${id}`,
    //             type: 'PUT',
    //             data: {
    //                 _id: id,
    //                 todoStatus: false
    //             }
    //         })
    //             .then(function (data) {
    //                 socket.emit('update-todo', data)
    //                 button.attr('data-status', data.todoStatus)
    //             });
    //     }
    //     toggleCheckbox(this);
    // });
// }

socket.on('emit-update', function (data) {
    console.log(data, "This is the updated todo being emitted from the backend")
    getAllItems();
});

function getAllItems() {
    $('#addTasks').empty();
    $.get('/api/todo', function (data) {
        
        data.forEach((e) => {
            const listTag = $('<li>');
            const textDiv = $('<div>');
            // const button = $('<i class="far fa-times-circle">');//x for delete
            if (e.todoStatus == true) {
                button = $('<i class="far fa-times-circle">');//checked completed
            } else {
                button = $('<i class="far fa-circle not complete">');//unchecked not completed
            }

            button.attr('data-id', e._id);
            button.attr('data-status', e.todoStatus);
            

            listTag.append()
            listTag.append(button);
            addUpdateListener(button);

            listTag.append(textDiv);

            textDiv.addClass('textDiv');
            textDiv.text(e.todoItem);

            button.addClass('delete');
            // button.attr('data-id', e._id);

            $('#addTasks').append(listTag);
        });
        // addDeleteListener();
    });
}

getAllItems();

// function addDeleteListener() {
//     $(".delete").on('click', function () {
//         const deleteThisId = {
//             id: $(this).attr('data-id')
//         }

//         $.delete(`/api/todo/${deleteThisID.id}`, deleteThisId.id, function (data) {
//             socket.emit('delete-todo', data);
//         });
//     });
// };
// socket.on('emit-new', function(data) {
//     getAllItems();
// })