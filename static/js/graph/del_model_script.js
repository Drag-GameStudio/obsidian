let del_note_id = null


let modal = document.getElementById("noteModal");
let noteText = document.getElementById("noteText");
let currentParent = null;

function openModal(parentNote) {
    modal.style.display = "block";
    currentParent = parentNote;
}

function closeModal() {
    modal.style.display = "none";
    noteText.value = "";
    currentParent = null;
}


window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
};

const deleteModal = document.getElementById('deleteModal');
const cancelBtn = document.getElementById('deleteModalCancelBtn');
const confirmBtn = document.getElementById('deleteModalConfirmBtn');

function open_delete_model(comment_id) {
    del_note_id = comment_id
    deleteModal.classList.add('active');
}

cancelBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
});

confirmBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    delete_comment(del_note_id)
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
    }
});


let editModal = document.getElementById("editNoteModal");
let editNoteText = document.getElementById("editNoteText");
let edit_comment_note = null

function openEditModal(comment) {
    editModal.style.display = "block";
    edit_comment_note = comment
    const current_text = edit_comment_note.getElementsByClassName("text_block")[0].querySelector("span").innerHTML
    
    editNoteText.innerHTML = current_text

}

function closeEditModal() {
    editModal.style.display = "none";
    editNoteText.value = "";
    edit_comment_note = null
}