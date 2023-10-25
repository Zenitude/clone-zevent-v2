if(document.querySelector('.containerShop')) {   
    const productsList = document.querySelector('.products');

    async function fetchApi(url) {
        const response = await fetch(url);
        const datas = await response.json();
        return datas;
    }
    
    const datasProducts = fetchApi('http://localhost:3001/shop');
    
    datasProducts
    .then(products => {
        for(let i = 0 ; i < products.length ; i++) {
            productsList.innerHTML += `
                <article>
                    <h2>${products[i].title}</h2>
                            <div class="content">
                                <div class="carousel">
                                        <img src="../public/assets/images/shop/${products[i].category}/${products[i].category}.webp" alt="${products[i].category}">
                                        <img src="../public/assets/images/shop/${products[i].category}/${products[i].category}-details.webp" alt="${products[i].category} details">
                                        <img src="../public/assets/images/shop/${products[i].category}/${products[i].category}.webp" alt="${products[i].category}">
                                </div>
                                                
                                <div class="price">
                                    <div>
                                        <h3>Précommande</h3>
                                        ${ 
                                            products[i].subtitle.length > 0
                                            ? (`<p>${products[i].subtitle}</p>`)
                                            : (``)
                                        }
                                        <p>€ ${products[i].price},00 <span>Taxes incluses</span></p>
                                    </div>
                                    <form novalidate>
                                        ${
                                            products[i].sizes.length > 0
                                            ? (`
                                            <div class="size">
                                                <h3>Tailles</h3>
                                                <p>Sélectionnez une taille</p>
                                                <div>
                                                
                                                </div>
                                            </div>
                                            `)
                                            : (``)   
                                        }
                                        
                                        <div class="quantity">
                                            <label for="${products[i].category}-qty">Quantité</label>
                                            <div>
                                                <button class="btnLess">-</button>
                                                <input type="number" name="${products[i].category}-qty" id="${products[i].category}-qty" value="1" min="1" max="20">
                                                <button class="btnMore">+</button>
                                            </div>
                                        </div>
                                        
                                        <button class="submitButton">Acheter maintenant</button>
                                    </form>
                                </div> 
    
                                <div class="details">
                                    
    
                                </div>
                            
                            </div>
                        </article>
            
            `;
    
            const sizes = document.querySelectorAll('.size div');
            const details = document.querySelectorAll('.details');
    
            if(products[i].sizes && products[i].sizes.length > 0) {
                products[i].sizes.forEach(size => {
                    sizes[i].innerHTML += 
                        `<div class="radio">
                            <input type="radio" name="size" id="size-${size}">
                            <label for="size-${size}">${size.toUpperCase()}</label>
                        </div>`
                })
            }
    
            if(products[i].descriptions && products[i].descriptions.length > 0) {
                products[i].descriptions.forEach(description => { 
                    details[i].innerHTML += `<details>
                        <summary>
                            <img src="../public/assets/images/shop/accordion/${description.icon}" alt="Cliquez pour afficher le description de ${description.summary}">
                            ${description.summary}
                        </summary>
                        <div>
                            ${description.details}
                        </div>
                    </details>`
                })
    
                details.innerHTML += `
                    <a href="shop.html">
                    Afficher les détails
                    <img src="../public/assets/images/shop/arrow.svg" alt="Aller sur la page de présentation du ${products[i].category}">
                    </a>
                `;
            }
    
    
    
        }

        const btnsMore = document.querySelectorAll('.btnMore');
        const btnsLess = document.querySelectorAll('.btnLess');
        const inputQty = document.querySelectorAll('.quantity input');

        for(let i = 0 ; i < btnsMore.length ; i++) {
            btnsMore[i].addEventListener('click', (e) => {
                e.preventDefault();
                if(inputQty[i].value >= parseInt(20)) {
                    inputQty[i].value = 20;
                } else {
                    inputQty[i].value++;
                }
            });

            btnsLess[i].addEventListener('click', (e) => {
                e.preventDefault();
                if(inputQty[i].value <= parseInt(1)) {
                    inputQty[i].value = 1;
                } else {
                    inputQty[i].value--;
                }
            });
        }

    })
    
    const year = document.querySelector('.yearCopy');
    year.innerHTML = new Date().getFullYear();

}

