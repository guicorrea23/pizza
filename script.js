const c = (el) => document.querySelector(el);
const cAll = (el) => document.querySelectorAll(el);
let cart = [];
let modalQtd = 1;
let modalKey = 0;

//Listagem das pizzas

pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true); // Usado para clonar a tag e todos os filhos que estão dentro!

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //Abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQtd = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected'); //REsetar a seleção dos tamanhos
        cAll('.pizzaInfo--size').forEach((size, sizeIndex) =>{
            if(sizeIndex === 2){
                size.classList.add('selected'); // Deixar o tamanho grande selecionado.
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });
        
        c('.pizzaInfo--qt').innerHTML = modalQtd;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;  //Usar o time out para o transition funcionar corretamente!
        }, 200);
        
        
    });
    

    c('.pizza-area').append( pizzaItem );
});

// Eventos do Modal
const closeModal = () => {
    c('.pizzaWindowArea').style.opacity = 0;

    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQtd > 1){
        modalQtd--;
        c('.pizzaInfo--qt').innerHTML = modalQtd;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQtd++;
    c('.pizzaInfo--qt').innerHTML = modalQtd;
});

cAll('.pizzaInfo--size').forEach((size) =>{
    size.addEventListener('click', ()=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected'); // Target para deixar o "alvo" no nosso item;
    });

});

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=> item.identifier === identifier);

    if(key > -1){
        cart[key].qtd += modalQtd;
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qtd: modalQtd
        });
    }

    updateCart();
    closeModal();
});

function updateCart(){
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('.cart--item img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;



            c('.cart').append(cartItem);
        }
    }else{
        c('aside').classList.remove('show');
    }
}