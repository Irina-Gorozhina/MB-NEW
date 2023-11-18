const back = document.querySelector('.back');
if (back) {
    back.addEventListener('click', (e) => {
        e.preventDefault();
        history.back();
    })
}
