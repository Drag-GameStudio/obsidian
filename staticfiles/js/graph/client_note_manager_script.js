let notesContainer = document.getElementById("notes-container");


function del_note(note_id) {
    all_headers = document.getElementsByClassName("note");

    for (let header of all_headers) {

        if (header.getElementsByClassName("note-header")[0].dataset.commentId == note_id) {
            curr_note = header;
        }

    }

    parent_element = curr_note.parentElement.parentElement
    note_content = curr_note.parentElement

    curr_note.remove()

    count_of_blocks = note_content.getElementsByClassName("note").length
    if (count_of_blocks < 1) {
        parent_element.getElementsByClassName("note-header")[0].dataset.with_under = false
        parent_element.getElementsByClassName("note-header")[0].classList.remove("note-with-under")

    }



}

function addNote(text, parent_id, comment_id, date, isGPT, withUnder) {
    parentNote = null;
    if (parent_id != null) {

        all_headers = document.getElementsByClassName("note");
        for (let header of all_headers) {
            if (header.getElementsByClassName("note-header")[0].dataset.commentId == comment_id) {
                return;
            }
            if (header.getElementsByClassName("note-header")[0].dataset.commentId == parent_id) {
                parentNote = header;
                if (header.getElementsByClassName("note-with-under").length < 1) {
                    header.getElementsByClassName("note-header")[0].dataset.with_under = true

                }
                if (header.getElementsByClassName("note-header")[0].dataset.isActivate == "false" || header.classList.contains("collapsed")) {

                    header.getElementsByClassName("note-header")[0].click()
                    return;
                }
                break;
            }

        }
    }
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";

    const header = document.createElement("div");
    header.className = "note-header";
    header.dataset.with_under = false
    if (isGPT) {
        header.classList.add("gpt-think")
    }
    if (withUnder) {
        header.classList.add("note-with-under")
        header.dataset.with_under = true
    }
    header.dataset.commentId = comment_id
    header.dataset.isActivate = false

    header.innerHTML = `
    <div style="width: 75%;" class="text_block"">
        <span style="overflow-wrap: break-word;">${text} </span>
    </div>
    <div style="text-align: right;">
        <button class="handle_button" onclick=" event.stopPropagation(); gpt_think(${comment_id}, this.parentElement.parentElement)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#888888" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 9.95 10.86c.03-.28.05-.56.05-.86a10 10 0 0 0-10-10zm-1 14v-4H8l4-8v4h3l-4 8z"/>
        </svg>
        </button>

        <button class="handle_button" onclick=" event.stopPropagation(); openEditModal(this.parentElement.parentElement)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#888888" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34c.38-.38.38-1.01 0-1.39l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.85z"/>
        </svg>
        </button>

        <button class="handle_button" onclick=" event.stopPropagation();  openModal(this.parentElement.parentElement.parentElement)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#888888" viewBox="0 0 24 24">
            <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z"/>
        </svg>
        </button>

        <button class="handle_button" onclick=" event.stopPropagation();  open_delete_model(${comment_id})">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#888888" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
        </button>

        <span style="display: block; padding-top: 10px;" class="date">${date}</span>


    </div>
    `;
    noteDiv.classList.toggle("collapsed");

    header.onclick = function (e) {
        if (e.target.tagName.toLowerCase() !== "button") {
            status_toggle = noteDiv.classList.toggle("collapsed")
            if (!status_toggle){
                header.classList.remove("note-with-under")
            }
            else{
                if (header.dataset.with_under){
                    header.classList.add("note-with-under")
                }
            }

            if (header.dataset.isActivate === "false") {
                header.dataset.isActivate = "true";
                loadNotesByParent(header.dataset.commentId);
            }
        }
    };

    const content = document.createElement("div");
    content.className = "note-content";

    noteDiv.appendChild(header);
    noteDiv.appendChild(content);

    if (parentNote) {
        parentNote.querySelector(".note-content").prepend(noteDiv);
    } else {
        notesContainer.prepend(noteDiv);
    }
}

function saveNote() {
    const text = noteText.value.trim();
    if (text === "") return;
    curr_fetch = addComment(text, currentParent ? currentParent.getElementsByClassName("note-header")[0].dataset.commentId : null)
    curr_fetch.then(response => response.json())
        .then(data => {
            comment_data = data.comment_data
            comment_id = comment_data.comment_id
            date = comment_data.date
            if (currentParent) {
                addNote(text, currentParent.getElementsByClassName("note-header")[0].dataset.commentId, comment_id, date, false, false);
            } else {
                addNote(text, null, comment_id, date, false, false);
            }

            closeModal();
        })
}


function editNote(){
    const new_content = editNoteText.value.trim()
    edit_comment(edit_comment_note.dataset.commentId, new_content)
    const current_text = edit_comment_note.getElementsByClassName("text_block")[0].querySelector("span")
    current_text.innerHTML = new_content
    closeEditModal()
}