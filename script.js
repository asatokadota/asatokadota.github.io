
let products = [
    {
        name: 'Turquoise Necklace',
        image: 'image/item_photo_3.jpg',
        description: 'Two-strand necklace of thin chains in different designs. Adjustable length with a trigger clasp.',
        currentPrice: 992,
        originalPrice: 1240,
        weight: '25g',
        madeIn: 'Indonesia',
        productCode: '1011178000'
    },
    {
        name: 'Flower Lace Choker',
        image: 'image/item_photo_4.jpg',
        description: 'Metal chain necklace with flat, wood-look plastic beads and a trigger clasp.',
        currentPrice: 576,
        originalPrice: 720,
        weight: '15g',
        madeIn: 'Poland',
        productCode: '1011178001'
    },
    {
        name: 'Black Lace Choker',
        image: 'image/item_photo_6.jpg',
        description: 'Necklace of metal chains in different designs with a trigger clasp. Adjustable length. ',
        currentPrice: 512,
        originalPrice: 640,
        weight: '10g',
        madeIn: 'poland',
        productCode: '1011178002'
    },
    {
        name: 'Turquoise Earrings',
        image: 'image/item_photo_1.jpg',
        description: 'Set with two ear cuffs and three pairs of earrings in metal. ',
        currentPrice: 520,
        originalPrice: null,
        weight: '20g',
        madeIn: 'Indonesia',
        productCode: '1011178003'
    },
    {
        name: 'Marble Stud Earrings',
        image: 'image/item_photo_5.jpg',
        description: 'Metal earrings with metal, flower-shaped pendants.',
        currentPrice: 520,
        originalPrice: null,
        weight: '25g',
        madeIn: 'Indonesia',
        productCode: '1011178004'
    },
    {
        name: 'Angel Earrings',
        image: 'image/item_photo_2.jpg',
        description: 'A pair of metal earrings with a gentle spiral shape.',
        currentPrice: 480,
        originalPrice: null,
        weight: '10g',
        madeIn: 'China',
        productCode: '1011178005'
    }
]

class ShoppingCart {
    constructor(products) {
        this.products = products;
        this.cart = {};
    }

    addOne(productId) {
        let count = this.cart[productId];
        if (count) {
            this.cart[productId] = count + 1;
        } else {
            this.cart[productId] = 1;
        }
    }

    setCount(productId, count) {
        this.cart[productId] = count;
    }

    removeAll(productId) {
        delete this.cart[productId];
    }

    removeZero() {
        for (let productId in this.cart) {
            let count = this.cart[productId];
            if (count == 0) {
                delete this.cart[productId];
            }
        }
    }

    updateTotalItems() {
        var totalItems = 0;
        for (let productId in this.cart) {
            let count = this.cart[productId];
            totalItems += count;
        }

        if (totalItems > 0) {
            document.getElementById('js-cart-amount').innerHTML = totalItems;
        } else {
            document.getElementById('js-cart-amount').innerHTML = null;
        }
    }

    updateTotalPrice() {
        var price = 0;
        for (let productId in this.cart) {
            let product = this.products.find(product => product.productCode == productId);
            let count = this.cart[productId];
            price += count * product.currentPrice;
        }
        document.getElementById('js-cart-total-price').innerHTML = price + " SEK";
    }
}

function createProductElement(product) {
    let template = document.getElementById('js-product-template').content.querySelector('#item');
    let article = document.importNode(template, true); 
    
    article.querySelector('#js-image').src = product.image;
    article.querySelector('#js-name').innerHTML = product.name;
    article.querySelector('#js-description').innerHTML = product.description;
    article.querySelector('#js-original-price').innerHTML = product.originalPrice + " SEK";
    article.querySelector('#js-current-price').innerHTML = product.currentPrice + " SEK";
    article.querySelectorAll('dd')[0].innerHTML = product.weight;
    article.querySelectorAll('dd')[1].innerHTML = product.madeIn;
    article.querySelectorAll('dd')[2].innerHTML = product.productCode;
    article.querySelector('#js-add-cart').addEventListener("click", function() {
        shoppingCart.addOne(product.productCode);
        shoppingCart.updateTotalItems();
    });

    article.querySelector('#js-item-details-toggle').addEventListener("click", function(e) {
        e.preventDefault();
        toggleActive(article.querySelector('#js-item-details'));
        toggleActive(article.querySelector('#js-item-details-icon'));
    });

    if (product.originalPrice == null) {
        article.querySelector('#js-original-price').parentElement.style.display = "none";
    }

    return article;
}

function createCartElement(product, count) {
    let template = document.getElementById('js-cart-template').content.querySelector('#cart-item');
    let article = document.importNode(template, true);

    article.querySelector('#js-cart-image').src = product.image;
    article.querySelector('#js-cart-name').innerHTML = product.name;
    article.querySelector('#js-cart-price').innerHTML = product.currentPrice + " SEK";

    let input = article.querySelector('#js-count');
    input.value = count;
    input.addEventListener("change", function(){
        shoppingCart.setCount(product.productCode, Number(input.value));
        shoppingCart.updateTotalPrice();
        shoppingCart.updateTotalItems();
    });
    article.querySelector('#js-remove-all').addEventListener("click", function(){
        shoppingCart.removeAll(product.productCode);
        updateCart();
    });

    return article;
}

function updateProducts() {
    var listElement = document.getElementById('item-list');
    while (listElement.firstChild) {
        listElement.firstChild.remove();
    }

    products.forEach(function(product) {
        let productElement = createProductElement(product);
        listElement.appendChild(productElement);     
    })
}

function updateCart() {
    var listElement = document.getElementById('cart-list');
    while (listElement.firstChild) {
        listElement.firstChild.remove();
    }

    for (let productCode in shoppingCart.cart) {
        let product = products.find(product => product.productCode == productCode);
        let count = shoppingCart.cart[productCode];
        let cartElement = createCartElement(product, count);
        listElement.appendChild(cartElement);
    }

    shoppingCart.updateTotalItems();
    shoppingCart.updateTotalPrice();
}

var shoppingCart = new ShoppingCart(products);

document.getElementById('js-cart-btn').addEventListener("click", function(e) {
    e.preventDefault();
    toggleActive(document.getElementById('js-cart'));
    toggleActive(document.getElementById('js-cart-icon'));
    toggleActive(document.getElementById('js-cart-amount'));
    shoppingCart.removeZero();
    updateCart();
});

updateProducts();

function toggleActive(element) {
    if (element.classList.contains('is-active')) {
        element.classList.remove('is-active');
    } else {
        element.classList.add('is-active');
    }
}
