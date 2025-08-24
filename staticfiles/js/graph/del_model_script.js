let del_note_id = null

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