const head = document.head;
let title;
let pathname = document.location.pathname;
pathname = pathname.includes('index.html') ? pathname.replace('/front-end/', '') : pathname.replace('/front-end/pages/', '');
pathname = pathname.replace('.html', '');
switch(pathname) {
    case 'associations' : 
        title = 'Les associations'; 
        break;
    case 'clips' : 
        title = 'Les clips'; 
        break;
    case 'shop' : 
        title = 'La boutique'; 
        break;
    case 'stats' : title = 'Les stats'; break;
    default : 
        title = 'Accueil';
}

head.title.innerHTML = `ZEvent 2022 - Du 9 au 11 septembre 2022 - ${title}`;
