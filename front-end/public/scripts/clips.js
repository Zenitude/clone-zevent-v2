if(document.querySelector(".containerClips")) {
    
    const buttonsTab = Object.entries(document.querySelectorAll('.buttonTabsClips button:not(.buttonTabsClips button:first-of-type)')).map(button => button.pop());
    const buttonsSide = Object.entries(document.querySelectorAll('.sidebar button')).map(button => button.pop());
    const buttons = buttonsTab.concat(buttonsSide);
    const tabs = Object.entries(document.querySelectorAll('section')).map(tab => tab.pop());
    console.log(buttons);
    console.log(tabs);

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(button => button.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));
            button.classList.add('active');
            tabs[buttons.indexOf(button)].classList.add('active');
        })
    })

    const buttonActiveSidebar = document.querySelector('.buttonTabsClips button:first-of-type');
    const sidebar = document.querySelector('.sidebar');

    buttonActiveSidebar.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('active');
        buttonActiveSidebar.classList.toggle('activeSide');

    })
}