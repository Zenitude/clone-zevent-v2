

if(document.querySelector(".containerClips")) {
    
    const buttonsTab = Object.entries(document.querySelectorAll('.buttonTabsClips button:not(.buttonTabsClips button:first-of-type)')).map(button => button.pop());
    const tabs = document.querySelectorAll('section');

    buttonsTab.forEach(button => {
        button.addEventListener('click', () => {
            buttonsTab.forEach(button => button.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));
            button.classList.add('active');
            tabs[buttonsTab.indexOf(button)].classList.add('active');
        })
    })
}