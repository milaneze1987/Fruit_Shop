window.onload = function () {
    let cart = {};
    let goods = {};

    //завантажуєм кошик з localstorage
    function loadCartFromStorage() {
        if (localStorage.getItem('cart') != undefined){
        cart = JSON.parse( localStorage.getItem('cart') );
    }
        console.log(cart);
    }
    loadCartFromStorage();

    // посилаєм запит
    let getJSON = function (url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response)
            }
            else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    }

    getJSON('https://spreadsheets.google.com/feeds/list/1Nx9s6k5Y2sjRAKSS5Ruk7pIjFrhA7fMM9Q_b93HT-is/od6/public/values?alt=json', function (err, data) {
        //console.log(data);
        if (err !== null){
            alert ('Eror ' +err);
        }
        else {
            data = data['feed']['entry'];
            console.log(data);
            goods = arrayHelper(data);
            console.log(goods);
            document.querySelector('.shop-field').innerHTML = showGoods(data);
            showCart();
        }
    });

function showGoods(data) {
    //функція виводу товару 
    let out = '';
    for (var i=0; i<data.length; i++){
        if (data[i]['gsx$show']['$t']!=0){
            out +=`<div class="col-lg-3 col-nd-3 col-sm-2 text-center">`;
            out +=`<div class="doods">`;
            out +=`<h5>${data[i]['gsx$name']['$t']}</h5>`;
            out +=`<img src="${data[i]['gsx$image']['$t']}" alt="">`;
            out +=`<p class="cost">Ціна: ${data[i]['gsx$cost']['$t']} грн </p>`;
            out +=`<p class="cost">Наявність на складі: ${data[i]['gsx$kg']['$t']}кг</p>`;
            out +=`<p class="cost"><button type="button" class="btn btn-success" name="add-to-cart" data="${data[i]['gsx$id']['$t']}">Купити</button></p>`;
            out +=`</div>`;
            out +=`</div>`;

            }
        }
        return out;
    }

    document.onclick = function(e){
        console.log(e.target.attributes.data.nodeValue);
        if (e.target.attributes.name.nodeValue == 'add-to-cart'){
            addToCart(e.target.attributes.data.nodeValue);
        }
        else if (e.target.attributes.name.nodeValue == 'delete-goods'){
            delete cart[e.target.attributes.data.nodeValue];
            showCart();
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart);
        }
        else if (e.target.attributes.name.nodeValue == 'plus-goods'){
            cart[e.target.attributes.data.nodeValue]++;
            showCart();
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart);
        }
        else if (e.target.attributes.name.nodeValue == 'minus-goods'){
            if (cart[e.target.attributes.data.nodeValue] - 1 == 0 ){
                delete cart[e.target.attributes.data.nodeValue];
            }
            else {
                cart[e.target.attributes.data.nodeValue]--;
            }
            showCart();
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart);
        }
    }

    function addToCart(elem) {
        if (cart[elem]!==undefined) {
            cart[elem]++;
        }
        else{
            cart[elem] = 1;
        }
        showCart();
        localStorage.setItem('cart', JSON.stringify(cart));
        showCart();
        console.log(cart);
    }
    function arrayHelper(arr) {
        let out ={};
        for (let i = 0; i < arr.length; i++) {
            let temp = {};
            temp['article'] = arr[i]['gsx$article']['$t'];
            temp['name'] = arr[i]['gsx$name']['$t'];
            temp['category'] = arr[i]['gsx$category']['$t'];
            temp['cost'] = arr[i]['gsx$cost']['$t'];
            temp['image'] = arr[i]['gsx$image']['$t'];
            out [ arr[i]['gsx$id']['$t'] ] = temp;
        }
        return out;
    }

    function showCart() {
        //виводим кошик
        let ul = document.querySelector('.cart');
        ul.innerHTML = '';
        let sum = 0;
        for (let key in cart) {
            let li = '<li>';
            li += goods[key]['name'] + ' ';
            li += ` <button name="minus-goods" data="${key}">-</button> `;
            li += cart[key]+'кг ';
            li += ` <button name="plus-goods" data="${key}">+</button> `;
            li += goods[key]['cost']*cart[key] + 'грн';
            li += ` <button name="delete-goods" data="${key}">x</button> `;
            li += '</li>';
            sum += goods[key]['cost']*cart[key];
            ul.innerHTML += li;

        }
        ul.innerHTML += 'Разом: ' + sum +  ' грн';

        ul.innerHTML += '<hr>';
    }
}