if(document.querySelector('.containerShop')) {
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
}