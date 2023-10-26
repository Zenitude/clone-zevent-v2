if(document.querySelector(".containerClips")) {
    
    const buttonsTab = Object.entries(document.querySelectorAll('.buttonTabsClips button:not(.buttonTabsClips button:first-of-type)')).map(button => button.pop());
    const buttonsSide = Object.entries(document.querySelectorAll('.sidebar button')).map(button => button.pop());
    const buttons = buttonsTab.concat(buttonsSide);
    const tabs = Object.entries(document.querySelectorAll('section')).map(tab => tab.pop());

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

const tabs = document.querySelectorAll('section:not(.games) .clips');
tabs.forEach(tab => {
    for(let i = 0; i < 4 ; i++) {
        tab.innerHTML += `<article>
            <video src="" controls></video>
            <div class="description">
                <p class="viewsAndTime">
                    <span>1 000 000 vues</span>
                    <span>01/01/2023 à 11:00</span>
                </p>
                <div class="avatarAndTitle">
                    <img src="/images/streamers/mister-mv.webp" alt="avatar de mister mv">
                    <h2>Title</h2>
                </div>
                <p class="nameAndActivity">
                    <span>Nom streamer</span> -
                    <span>Activité</span>
                </p>
            </div>
        </article>`;
    }
})

const tabGame = document.querySelector('section.games .clips');

async function fetchApi (url) {
    const options = {
        method: 'GET',
        headers: {
            'Cache-control': 'max-age=2592000, public'
        }
    }
    const response = await fetch(url, options);
    const datas = await response.json();
    return datas;
}

const datasGames = fetchApi('http://localhost:3001/games-list');

datasGames
.then(games => {
    if(games && games.length > 0) {
        games.forEach(game => {
            let linkImage = game.name.replace(':', 'µ').toLowerCase().split(' ').join('-');
            tabGame.innerHTML += `
                <article>
                    <a href="${game.link}">
                    <img src="/images/games/${linkImage}.webp" alt="Lien vers la page officiel de ${game.name}">
                    <p>${game.name}</p>
                </a>
            </article>
            `;
        })
    }
    else {
        tabGame.innerHTML = `<p>Aucun jeu recencé pour le moment`;
    }
})
