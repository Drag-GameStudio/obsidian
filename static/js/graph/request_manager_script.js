const BASE_URL = window.location.origin;


function logout_user() {
    fetch(`${BASE_URL}/menu/logout/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": get_csrf_token()
            },
        }

    ).then(response => {
        window.location.href = window.location.origin + "/menu/"; // перенаправление на главную страницу
    })
}

function gpt_think(comment_id, parent) {
    parent.classList.add("loading-block")
    fetch(`${BASE_URL}/graph/gpt_think?comment_id=${comment_id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": get_csrf_token()
            },

        })
        .then(response => response.json())
        .then(data => {
            comment_data = data.comment_data

            addNote(comment_data.content, comment_id, comment_data.comment_id, comment_data.date, true, false)
            parent.classList.remove("loading-block")


        })
}

function addComment(text, parentCommentId = null) {
    return fetch(`${BASE_URL}/graph/add_comment/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": get_csrf_token()
        },
        body: JSON.stringify({
            content: text,
            parent_comment_id: parentCommentId
        })
    })

}

function loadNotesByParent(parent_id) {
    fetch(`${BASE_URL}/graph/read_comments?parent_comment_id=${parent_id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": get_csrf_token()
            },

        }).then(response => response.json())
        .then(data => {
            comments_data = data.comments
            comments_data.forEach(note => {
                addNote(note.content, parent_id, note.comment_id, note.created_at, note.isGPT, note.withUnder);
            });
        }
        )


}

function delete_comment(curr_comment_id) {
    fetch(`${BASE_URL}/graph/delete_comment/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": get_csrf_token()
        },
        body: JSON.stringify({
            comment_id: curr_comment_id
        })
    })
        .then(response => {
            del_note(curr_comment_id)
        })
}

function edit_comment(curr_comment_id, new_content) {
    fetch(`${BASE_URL}/graph/edit_comment/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": get_csrf_token()
        },
        body: JSON.stringify({
            comment_id: curr_comment_id,
            new_content: new_content
        })
    })
        .then(response => {
            if(response.ok){
            }
            else{
                (response => response.json()).then(data => {console.log(data)})
            }
        })
}
