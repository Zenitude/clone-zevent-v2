// Back previous page
if(document.querySelector('.containerDeleteStreamer')) {
    const buttonBack = document.querySelector('.back');
    buttonBack.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    })
}