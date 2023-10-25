async function fetchApi (url) {
    const response = await fetch(url);
    const datas = await response.json();
    return datas;
}

// Historics
const cardsHistorics = document.querySelector('.historics .cards');
const datasHistorics = fetchApi('http://localhost:3001/historics-list');

datasHistorics
.then(historics => {
    if(historics && historics.length > 0) {
        historics.forEach(historic => {
            cardsHistorics.innerHTML += `
            <article>
                <h3>${historics.date}</h3>
                <strong class="amount">${parseInt(historic.amount).toLocaleString("fr-FR")} €</strong>
                <strong>${historic.associations.split(',').join(' - ')}</strong>
            </article>
            `;
        });
    } else {
        cardsHistorics.innerHTML = `<p>Aucun historique recensé pour le moment.</p>`;
    }
})

// Streamers
const cardsStreamers = document.querySelector('.streamers .cards');

const datasStreamers = fetchApi('http://localhost:3001/streamers-list');

datasStreamers
.then(streamers => {
    if(streamers && streamers.length > 0) {
        streamers.forEach(streamer => {
            cardsStreamers.innerHTML += `
                <article>
                    <a href="${streamer.twitch}" target="_blank">
                        <div class="containerImg">
                            <img src="./public/assets/images/streamers/${streamer.name.toLowerCase().split(' ').join('-')}.webp" alt="Lien vers le profil de ${streamer.name}" >
                        </div>
                        <h3>${streamer.name}</h3>
                    </a>
                </article>
            `;
        });
    } else {
        cardsStreamers.innerHTML = `<p>Aucun streamer recensé pour le moment.</p>`;
    }
})