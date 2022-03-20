const BASE_URL = 'http://localhost:3000/api/';

//

function getCart() { }
function setCart() { }

//

async function fetchProducts(id) { 
    let result = await fetch(BASE_URL + `products/${id || ''}`);
    let products = await result.json();
    return products;
}
