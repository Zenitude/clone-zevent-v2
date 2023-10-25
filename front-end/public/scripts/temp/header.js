const header = document.querySelector('header');

let pathname = document.location.pathname;
pathname = pathname.includes('index.html') ? pathname.replace('/front-end/', '') : pathname.replace('/front-end/pages/', '');
pathname = pathname.replace('.html', '');

header.innerHTML = `
<div class="navigationHeader">
        <nav>
            <ul>
                <li>
                    <a href="/">
                        <img src="/images/zevent/zevent-logo-105x60.webp" alt="Link for go to Home page" />
                    </a>
                </li>
                <li>
                    <a href="/" aria-label="Link for go to Home page">
                        <span>Accueil</span>
                        <i class="fa-solid fa-house fa-2x"></i>
                    </a>
                </li>
                <li>
                    <a href="/associations" aria-label="Link for go to Associations page">
                        <span>Les associations</span>
                        <i class="fa-solid fa-building fa-2x"></i>
                    </a>
                </li>
                <li>
                    <a href="/clips" aria-label="Link for go to Clips page">
                        <span>Les clips</span>
                        <i class="fa-brands fa-square-youtube fa-2x"></i>
                    </a>
                </li>
                <li>
                    <a href="/stats" aria-label="Link for go to Statistics page">
                        <span>Les stats</span>
                        <i class="fa-solid fa-bars-progress fa-2x"></i>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="menu">
            <img src="/images/header/hamburger.svg" alt="Afficher menu" class="hamburger active" />
            <img src="/images/header/close.svg" alt="Fermer menu" class="close" />
        </div>
    </div>
    
    <div class="networksHeader">
        <nav>
            <ul>
                <li><a href="https://twitter.com/ZEventfr" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a></li>
                <li><a href="https://www.instagram.com/zeventfr/" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a></li>
                <li><a href="https://www.reddit.com/r/ZEvent/" aria-label="Reddit"><i class="fa-brands fa-reddit-alien"></i></a></li>
            </ul>
        </nav>
    </div>

`;

const navHeader = document.querySelector('.navigationHeader ul');
if(navHeader) {
    if(pathname === 'shop') {
        document.querySelector('.navigationHeader ul').innerHTML += `
        <li class="cart">
        <a href="/cart" aria-label="Link for go to Statistics page">
            <svg 
                class="icon icon-cart-empty" aria-hidden="true" focusable="false" 
                role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="3 1 35 35"
            >
                <path d="m15.75 11.8h-3.16l-.77 11.6a5 5 0 0 0 4.99 5.34h7.38a5 5 0 0 0 4.99-5.33l-.78-11.61zm0 1h-2.22l-.71 10.67a4 4 0 0 0 3.99 4.27h7.38a4 4 0 0 0 4-4.27l-.72-10.67h-2.22v.63a4.75 4.75 0 1 1 -9.5 0zm8.5 0h-7.5v.63a3.75 3.75 0 1 0 7.5 0z" fill-rule="evenodd"></path>
            </svg>
        </a>
    </li>
        `;
    }
}

if(document.querySelector('.menu')) {
    const menu = document.querySelector('.menu');
    const [iconHamburger, iconClose] = document.querySelectorAll('.menu img');
    const links = document.querySelectorAll('.navigationHeader nav li:not(.navigationHeader nav li:first-of-type, .navigationHeader nav li.cart)');
    
    menu.addEventListener('click', () => {
        iconHamburger.classList.toggle('active');
        iconClose.classList.toggle('active');
        links.forEach(link => link.classList.toggle('active'));
    });
}

const data = new Date();
const date = data.toLocaleDateString();
const hours = data.toLocaleTimeString();