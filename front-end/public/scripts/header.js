if(document.querySelector('.menu')) {
    const menu = document.querySelector('.menu');
    const [iconHamburger, iconClose] = document.querySelectorAll('.menu img');
    const links = document.querySelectorAll('.navigationHeader nav li:not(.navigationHeader nav li:first-of-type, .navigationHeader nav li:last-of-type)');
    
    menu.addEventListener('click', () => {
        iconHamburger.classList.toggle('active');
        iconClose.classList.toggle('active');
        links.forEach(link => link.classList.toggle('active'));
    });
}

const data = new Date();
const date = data.toLocaleDateString();
const hours = data.toLocaleTimeString();